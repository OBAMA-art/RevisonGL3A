/* =========================================================================
   compte.js — ☁️ Compte étudiant OPTIONNEL + sauvegarde des notes en ligne
   -------------------------------------------------------------------------
   Tout reste utilisable SANS compte (notes 100% locales). Avec un compte :
   les notes se synchronisent (notes_sync, privées — RLS owner-only, le
   délégué n'y a pas accès) et l'étudiant les retrouve sur tout appareil.
   Connexion : email OU matricule + mot de passe.
   Mot de passe oublié : matricule + date de naissance → lien envoyé par mail.
   Dépend de : sbClient/cloudConfigured (cloud.js), $/escapeHtml/go (app.js),
   notesLoad/notesSave/renderMesNotes (notes.js).
   NB : une seule session Supabase par appareil — se connecter en étudiant
   remplace une éventuelle session admin (et inversement).
   ========================================================================= */

const PROFILE_DRAFT_KEY = 'gl3a_compte_draft';   // profil en attente (email à confirmer)
const NOTES_AT_KEY = 'gl3a_mes_notes_at';        // dernière modif locale des notes (ms)

let _syncTimer = null;
let _syncState = 'off';   // off | sync | ok | offline

/* ------------------------------ Utilitaires ------------------------------ */
function maskEmail(e) {
  const m = /^(.)(.*)(@.+)$/.exec(e || '');
  if (!m) return e || '';
  return m[1] + '•'.repeat(Math.max(2, Math.min(6, m[2].length))) + m[3];
}
function compteErrorFr(e) {
  const msg = (e && e.message) || String(e || '');
  if (/already registered/i.test(msg)) return 'Un compte existe déjà avec cet email.';
  if (/invalid login credentials/i.test(msg)) return 'Identifiants incorrects.';
  if (/email not confirmed/i.test(msg)) return 'Confirme d\'abord ton email : clique le lien reçu dans ta boîte mail, puis reconnecte-toi.';
  if (/matricule_uniq|duplicate key/i.test(msg)) return 'Ce matricule est déjà utilisé par un autre compte.';
  if (/password.*(at least|short)/i.test(msg)) return 'Mot de passe trop court (6 caractères minimum).';
  if (/rate limit/i.test(msg)) return 'Trop de tentatives — réessaie dans quelques minutes.';
  if (/failed to fetch|network/i.test(msg)) return 'Pas de connexion Internet.';
  return msg || 'Une erreur est survenue.';
}

// Une session Supabase est-elle stockée sur CET appareil ? (test purement
// local — évite de charger la librairie CDN pour les utilisateurs sans compte)
function compteHasLocalSession() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf('sb-') === 0 && k.indexOf('-auth-token') !== -1) return true;
    }
  } catch {}
  return false;
}

async function compteCurrentUser() {
  if (!cloudConfigured()) return null;
  try {
    const c = await sbClient();
    // getSession lit le stockage local (réseau seulement si le jeton a expiré)
    const { data } = await c.auth.getSession();
    return (data && data.session && data.session.user) || null;
  } catch { return null; }
}

/* ------------------------------- Profil ---------------------------------- */
async function compteFetchProfil(userId) {
  const c = await sbClient();
  const { data, error } = await c.from('etudiants').select('*').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return data || null;
}
async function compteInsertProfil(userId, p) {
  const c = await sbClient();
  const { error } = await c.from('etudiants').insert({
    user_id: userId,
    nom: p.nom, prenoms: p.prenoms, email: p.email,
    date_naissance: p.date_naissance || null,
    lieu_naissance: p.lieu_naissance || '',
    classe: p.classe || '',
    matricule: p.matricule,
    annee_academique: p.annee_academique || ''
  });
  if (error) throw error;
}

/* --------------------------- Inscription / Connexion --------------------- */
async function compteSignup(p, password) {
  const c = await sbClient();
  // Le matricule doit être libre AVANT de créer le compte auth.
  const { data: taken } = await c.rpc('email_for_matricule', { p_matricule: p.matricule });
  if (taken) throw new Error('Ce matricule est déjà utilisé par un autre compte.');

  const { data, error } = await c.auth.signUp({ email: p.email, password });
  if (error) throw error;

  if (data && data.session && data.user) {
    // Pas de confirmation d'email exigée : profil créé immédiatement.
    await compteInsertProfil(data.user.id, p);
    await notesSyncPull();
    return { confirmed: true };
  }
  // Confirmation d'email exigée : on garde le profil en brouillon local,
  // il sera créé à la première connexion.
  try { localStorage.setItem(PROFILE_DRAFT_KEY, JSON.stringify(p)); } catch {}
  return { confirmed: false };
}

async function compteLogin(identifiant, password) {
  const c = await sbClient();
  let email = (identifiant || '').trim();
  if (!email.includes('@')) {
    // Connexion par matricule → on retrouve l'email (le mot de passe est
    // ensuite vérifié par Supabase Auth).
    const { data, error } = await c.rpc('email_for_matricule', { p_matricule: email });
    if (error) throw error;
    if (!data) throw new Error('Matricule inconnu. Vérifie, ou connecte-toi avec ton email.');
    email = data;
  }
  const { data, error } = await c.auth.signInWithPassword({ email, password });
  if (error) throw error;

  // Profil manquant (inscription avec confirmation d'email) → créer depuis le brouillon.
  let profil = null;
  try { profil = await compteFetchProfil(data.user.id); } catch {}
  if (!profil) {
    let draft = null;
    try { draft = JSON.parse(localStorage.getItem(PROFILE_DRAFT_KEY) || 'null'); } catch {}
    if (draft && draft.email && draft.email.toLowerCase() === email.toLowerCase()) {
      try { await compteInsertProfil(data.user.id, draft); localStorage.removeItem(PROFILE_DRAFT_KEY); } catch {}
    }
  }
  await notesSyncPull();
  return data.user;
}

async function compteLogout() {
  try { const c = await sbClient(); await c.auth.signOut(); } catch {}
  _syncState = 'off';
}

/* --------------------------- Mot de passe oublié ------------------------- */
// Matricule + date de naissance → email masqué + lien de réinitialisation.
async function compteResetRequest(matricule, dateNaissance) {
  const c = await sbClient();
  const { data: email, error } = await c.rpc('email_for_reset', {
    p_matricule: matricule, p_date_naissance: dateNaissance
  });
  if (error) throw error;
  if (!email) throw new Error('Aucun compte ne correspond à ce matricule et cette date de naissance. Si tu as oublié ton matricule, demande-le au délégué.');
  const { error: e2 } = await c.auth.resetPasswordForEmail(email, {
    redirectTo: location.origin + location.pathname
  });
  if (e2) throw e2;
  return maskEmail(email);
}

/* ------------------------- Synchronisation des notes --------------------- */
function notesLocalAt() {
  try { return parseInt(localStorage.getItem(NOTES_AT_KEY) || '0', 10) || 0; } catch { return 0; }
}
function setSyncState(s) {
  _syncState = s;
  const el = document.getElementById('notes-sync-state');
  if (!el) return;
  const map = {
    ok:      ['☁️ Notes synchronisées', 'sync-ok'],
    sync:    ['☁️ Synchronisation…', 'sync-busy'],
    offline: ['📴 Hors-ligne — sync à la reconnexion', 'sync-off'],
    off:     ['', '']
  };
  const [txt, cls] = map[s] || ['', ''];
  el.textContent = txt;
  el.className = 'notes-sync-state ' + cls;
}

// Envoi (débouncé) des notes locales vers le cloud — appelé à chaque saisie.
function compteNotesChanged() {
  try { localStorage.setItem(NOTES_AT_KEY, String(Date.now())); } catch {}
  if (_syncState === 'off') return;        // pas connecté : tout reste local
  clearTimeout(_syncTimer);
  _syncTimer = setTimeout(() => { notesSyncPush().catch(() => {}); }, 1500);
}

async function notesSyncPush() {
  const user = await compteCurrentUser();
  if (!user) { setSyncState('off'); return; }
  setSyncState('sync');
  try {
    const c = await sbClient();
    const { error } = await c.from('notes_sync').upsert({
      user_id: user.id,
      store: notesLoad(),
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    if (error) throw error;
    setSyncState('ok');
  } catch { setSyncState('offline'); }
}

// Fusion PAR MATIÈRE : une matière saisie sur un seul appareil n'est jamais
// perdue ; en cas de conflit sur la même matière, la version du store le plus
// récent gagne. Bien plus sûr qu'un remplacement en bloc.
function notesMerge(localStore, remoteStore, remoteNewer) {
  const out = {};
  const keys = new Set(Object.keys(localStore).concat(Object.keys(remoteStore)));
  keys.forEach(k => {
    const l = localStore[k], r = remoteStore[k];
    if (l === undefined) out[k] = r;
    else if (r === undefined) out[k] = l;
    else out[k] = remoteNewer ? r : l;
  });
  return out;
}

async function notesSyncPull() {
  const user = await compteCurrentUser();
  if (!user) { setSyncState('off'); return; }
  setSyncState('sync');
  try {
    const c = await sbClient();
    const { data, error } = await c.from('notes_sync')
      .select('store,updated_at').eq('user_id', user.id).maybeSingle();
    if (error) throw error;
    const remote = (data && data.store && typeof data.store === 'object') ? data.store : null;
    const remoteAt = data ? new Date(data.updated_at).getTime() : 0;
    const localAt = notesLocalAt();
    const local = notesLoad();

    if (remote) {
      const merged = notesMerge(local, remote, remoteAt > localAt);
      const changedLocal = JSON.stringify(merged) !== JSON.stringify(local);
      const changedRemote = JSON.stringify(merged) !== JSON.stringify(remote);
      if (changedLocal) {
        notesSave(merged);
        try { localStorage.setItem(NOTES_AT_KEY, String(Math.max(remoteAt, localAt))); } catch {}
        if (typeof state !== 'undefined' && state.currentScreen === 'mes-notes') renderMesNotes();
      }
      if (changedRemote) { await notesSyncPush(); return; }
    } else if (Object.keys(local).length) {
      // Rien en ligne : première sauvegarde du local.
      await notesSyncPush();
      return;
    }
    setSyncState('ok');
  } catch { setSyncState('offline'); }
}

/* ------------------------------- ÉCRANS ---------------------------------- */
function compteField(id, label, type, placeholder, required, value, autocomplete) {
  return `
    <div class="form-group">
      <label for="${id}">${label}${required ? ' <span class="required">*</span>' : ''}</label>
      <input type="${type}" id="${id}" placeholder="${escapeHtml(placeholder || '')}"
             value="${escapeHtml(value || '')}"${autocomplete ? ` autocomplete="${autocomplete}"` : (type === 'email' ? ' autocomplete="email"' : '')}>
    </div>`;
}

async function renderCompte() {
  go('compte');
  const box = $('compte-content');
  if (!cloudConfigured()) {
    box.innerHTML = '<p class="form-error">La base en ligne n\'est pas configurée.</p>';
    return;
  }
  box.innerHTML = '<p class="scan-status">⏳ Vérification de la session…</p>';
  const user = await compteCurrentUser();
  if (!user) { compteViewChoice(); return; }

  let profil = null;
  try { profil = await compteFetchProfil(user.id); } catch {}
  box.innerHTML = `
    <div class="compte-card">
      <div class="compte-avatar">🎓</div>
      <h3>${profil ? escapeHtml(profil.prenoms + ' ' + profil.nom) : escapeHtml(user.email)}</h3>
      ${profil ? `
      <div class="compte-infos">
        <div><span>Matricule</span><strong>${escapeHtml(profil.matricule)}</strong></div>
        <div><span>Classe</span><strong>${escapeHtml(profil.classe || '—')}</strong></div>
        <div><span>Année</span><strong>${escapeHtml(profil.annee_academique || '—')}</strong></div>
        <div><span>Email</span><strong>${escapeHtml(maskEmail(profil.email))}</strong></div>
      </div>` : `
      <p class="scan-status">⚠️ Ton profil n'est pas encore rempli — sans lui, la connexion par
      matricule et la récupération de mot de passe ne marcheront pas.</p>
      <button id="compte-complete" class="btn-primary btn-block">📝 Compléter mon profil</button>`}
      <p class="compte-sync-note">☁️ Tes notes sont sauvegardées en ligne et te suivent sur tous tes appareils.
      Elles restent <strong>privées</strong> — personne d'autre n'y a accès, pas même le délégué.</p>
      <div class="form-actions">
        <button id="compte-go-notes" class="btn-primary">🎓 Mes notes</button>
        <button id="compte-logout" class="btn-secondary">Se déconnecter</button>
      </div>
    </div>`;
  $('compte-go-notes').onclick = () => renderMesNotes();
  $('compte-logout').onclick = async () => {
    await compteLogout();
    renderCompte();
  };
  const cmp = $('compte-complete');
  if (cmp) cmp.onclick = () => compteViewCompleteProfile(user);
  notesSyncPull().catch(() => {});
}

function compteViewChoice() {
  $('compte-content').innerHTML = `
    <div class="compte-card">
      <div class="compte-avatar">☁️</div>
      <h3>Sauvegarde en ligne — optionnel</h3>
      <p class="compte-pitch">Crée un compte pour <strong>ne jamais perdre tes notes</strong>
      (changement ou perte de téléphone) et les retrouver sur PC comme sur mobile.
      Sans compte, tout continue de marcher : tes notes restent sur cet appareil.</p>
      <div class="form-actions">
        <button id="compte-to-login" class="btn-primary">🔑 Se connecter</button>
        <button id="compte-to-signup" class="btn-secondary">✨ Créer un compte</button>
      </div>
    </div>`;
  $('compte-to-login').onclick = () => compteViewLogin();
  $('compte-to-signup').onclick = () => compteViewSignup();
}

function compteViewLogin(msg, isError) {
  $('compte-content').innerHTML = `
    <h3 class="compte-h3">🔑 Connexion</h3>
    ${msg ? `<div class="${isError ? 'form-error' : 'form-success'}">${escapeHtml(msg)}</div>` : ''}
    ${compteField('login-id', 'Email ou matricule', 'text', 'ex: 23GL1234 ou toi@mail.com', true, '', 'username')}
    ${compteField('login-pass', 'Mot de passe', 'password', '••••••••', true, '', 'current-password')}
    <div class="form-actions">
      <button id="login-btn" class="btn-primary">Se connecter</button>
      <button id="login-back" class="btn-secondary">← Retour</button>
    </div>
    <button id="login-forgot" class="compte-link">Mot de passe oublié ?</button>
    <button id="login-to-signup" class="compte-link">Pas encore de compte ? S'inscrire</button>`;
  $('login-back').onclick = () => compteViewChoice();
  $('login-forgot').onclick = () => compteViewReset();
  $('login-to-signup').onclick = () => compteViewSignup();
  $('login-btn').onclick = async () => {
    const id = $('login-id').value.trim(), pass = $('login-pass').value;
    if (!id || !pass) { compteViewLogin('Identifiant et mot de passe requis.', true); return; }
    const b = $('login-btn'); b.disabled = true; b.textContent = '⏳ Connexion…';
    try {
      await compteLogin(id, pass);
      renderCompte();
    } catch (e) {
      compteViewLogin(compteErrorFr(e), true);
    }
  };
}

function compteViewSignup(msg) {
  $('compte-content').innerHTML = `
    <h3 class="compte-h3">✨ Créer mon compte</h3>
    <p class="form-intro">Tes infos permettent au délégué de t'aider si tu oublies ton matricule.
    Ton <strong>mot de passe</strong> et tes <strong>notes</strong> restent privés — personne n'y a accès.</p>
    ${msg ? `<div class="form-error">${escapeHtml(msg)}</div>` : ''}
    <div class="compte-grid2">
      ${compteField('su-nom', 'Nom', 'text', 'ex: OBAMA', true)}
      ${compteField('su-prenoms', 'Prénoms', 'text', 'ex: Guy Oswald', true)}
    </div>
    ${compteField('su-email', 'Adresse email', 'email', 'toi@exemple.com', true)}
    <div class="compte-grid2">
      ${compteField('su-naissance', 'Date de naissance', 'date', '', true)}
      ${compteField('su-lieu', 'Lieu de naissance', 'text', 'ex: Yaoundé', true)}
    </div>
    <div class="compte-grid2">
      ${compteField('su-classe', 'Classe', 'text', 'ex: GL3A', true)}
      ${compteField('su-matricule', 'Matricule', 'text', 'ex: 23GL1234', true)}
    </div>
    ${compteField('su-annee', 'Année académique', 'text', 'ex: 2025-2026', true)}
    <div class="compte-grid2">
      ${compteField('su-pass', 'Mot de passe (6 min.)', 'password', '••••••••', true, '', 'new-password')}
      ${compteField('su-pass2', 'Confirme le mot de passe', 'password', '••••••••', true, '', 'new-password')}
    </div>
    <div class="form-actions">
      <button id="signup-btn" class="btn-primary">✨ Créer mon compte</button>
      <button id="signup-back" class="btn-secondary">← Retour</button>
    </div>
    <button id="signup-to-login" class="compte-link">Déjà un compte ? Se connecter</button>`;
  $('signup-back').onclick = () => compteViewChoice();
  $('signup-to-login').onclick = () => compteViewLogin();
  $('signup-btn').onclick = async () => {
    const p = {
      nom: $('su-nom').value.trim(),
      prenoms: $('su-prenoms').value.trim(),
      email: $('su-email').value.trim().toLowerCase(),
      date_naissance: $('su-naissance').value || null,
      lieu_naissance: $('su-lieu').value.trim(),
      classe: $('su-classe').value.trim(),
      matricule: $('su-matricule').value.trim(),
      annee_academique: $('su-annee').value.trim()
    };
    const pass = $('su-pass').value, pass2 = $('su-pass2').value;
    if (!p.nom || !p.prenoms || !p.email || !p.matricule || !p.date_naissance || !p.lieu_naissance || !p.classe || !p.annee_academique) {
      compteViewSignup('Tous les champs sont obligatoires.'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) { compteViewSignup('Adresse email invalide.'); return; }
    if (pass.length < 6) { compteViewSignup('Mot de passe trop court (6 caractères minimum).'); return; }
    if (pass !== pass2) { compteViewSignup('Les deux mots de passe ne correspondent pas.'); return; }
    const b = $('signup-btn'); b.disabled = true; b.textContent = '⏳ Création…';
    try {
      const r = await compteSignup(p, pass);
      if (r.confirmed) renderCompte();
      else compteViewLogin('Compte créé ! 📬 Clique le lien de confirmation reçu sur ' + maskEmail(p.email) + ', puis connecte-toi ici.', false);
    } catch (e) {
      compteViewSignup(compteErrorFr(e));
    }
  };
}

function compteViewReset(msg, isError) {
  $('compte-content').innerHTML = `
    <h3 class="compte-h3">🔓 Mot de passe oublié</h3>
    <p class="form-intro">Entre ton <strong>matricule</strong> et ta <strong>date de naissance</strong> :
    un lien de réinitialisation sera envoyé sur l'email de ton compte.<br>
    Matricule oublié aussi ? Le <strong>délégué</strong> peut te le redonner.</p>
    ${msg ? `<div class="${isError ? 'form-error' : 'form-success'}">${escapeHtml(msg)}</div>` : ''}
    ${compteField('rs-matricule', 'Matricule', 'text', 'ex: 23GL1234', true)}
    ${compteField('rs-naissance', 'Date de naissance', 'date', '', true)}
    <div class="form-actions">
      <button id="reset-btn" class="btn-primary">📬 Envoyer le lien</button>
      <button id="reset-back" class="btn-secondary">← Connexion</button>
    </div>`;
  $('reset-back').onclick = () => compteViewLogin();
  $('reset-btn').onclick = async () => {
    const mat = $('rs-matricule').value.trim(), dn = $('rs-naissance').value;
    if (!mat || !dn) { compteViewReset('Matricule et date de naissance requis.', true); return; }
    const b = $('reset-btn'); b.disabled = true; b.textContent = '⏳ Envoi…';
    try {
      const masked = await compteResetRequest(mat, dn);
      compteViewReset('📬 Lien envoyé à ' + masked + ' — ouvre le mail depuis cet appareil et choisis ton nouveau mot de passe.', false);
    } catch (e) {
      compteViewReset(compteErrorFr(e), true);
    }
  };
}

// Écran "compléter mon profil" — connexion depuis un nouvel appareil après une
// inscription dont le profil n'a jamais été créé (brouillon resté ailleurs).
function compteViewCompleteProfile(user, msg) {
  $('compte-content').innerHTML = `
    <h3 class="compte-h3">📝 Compléter mon profil</h3>
    <p class="form-intro">Ces infos activent la connexion par matricule, la récupération de mot de passe,
    et permettent au délégué de t'aider si tu oublies ton matricule.</p>
    ${msg ? `<div class="form-error">${escapeHtml(msg)}</div>` : ''}
    <div class="compte-grid2">
      ${compteField('cp-nom', 'Nom', 'text', 'ex: OBAMA', true)}
      ${compteField('cp-prenoms', 'Prénoms', 'text', 'ex: Guy Oswald', true)}
    </div>
    <div class="compte-grid2">
      ${compteField('cp-naissance', 'Date de naissance', 'date', '', true)}
      ${compteField('cp-lieu', 'Lieu de naissance', 'text', 'ex: Yaoundé', true)}
    </div>
    <div class="compte-grid2">
      ${compteField('cp-classe', 'Classe', 'text', 'ex: GL3A', true)}
      ${compteField('cp-matricule', 'Matricule', 'text', 'ex: 23GL1234', true)}
    </div>
    ${compteField('cp-annee', 'Année académique', 'text', 'ex: 2025-2026', true)}
    <div class="form-actions">
      <button id="cp-btn" class="btn-primary">💾 Enregistrer mon profil</button>
      <button id="cp-back" class="btn-secondary">← Retour</button>
    </div>`;
  $('cp-back').onclick = () => renderCompte();
  $('cp-btn').onclick = async () => {
    const p = {
      nom: $('cp-nom').value.trim(),
      prenoms: $('cp-prenoms').value.trim(),
      email: user.email,
      date_naissance: $('cp-naissance').value || null,
      lieu_naissance: $('cp-lieu').value.trim(),
      classe: $('cp-classe').value.trim(),
      matricule: $('cp-matricule').value.trim(),
      annee_academique: $('cp-annee').value.trim()
    };
    if (!p.nom || !p.prenoms || !p.matricule || !p.date_naissance || !p.lieu_naissance || !p.classe || !p.annee_academique) {
      compteViewCompleteProfile(user, 'Tous les champs sont obligatoires.'); return;
    }
    const b = $('cp-btn'); b.disabled = true; b.textContent = '⏳…';
    try {
      await compteInsertProfil(user.id, p);
      renderCompte();
    } catch (e) {
      compteViewCompleteProfile(user, compteErrorFr(e));
    }
  };
}

// Écran "nouveau mot de passe" (arrivée via le lien du mail de réinitialisation)
function compteViewNewPass(msg) {
  go('compte');
  $('compte-content').innerHTML = `
    <h3 class="compte-h3">🔐 Nouveau mot de passe</h3>
    ${msg ? `<div class="form-error">${escapeHtml(msg)}</div>` : ''}
    ${compteField('np-pass', 'Nouveau mot de passe (6 min.)', 'password', '••••••••', true, '', 'new-password')}
    ${compteField('np-pass2', 'Confirme le mot de passe', 'password', '••••••••', true, '', 'new-password')}
    <div class="form-actions">
      <button id="np-btn" class="btn-primary">💾 Enregistrer</button>
    </div>`;
  $('np-btn').onclick = async () => {
    const p1 = $('np-pass').value, p2 = $('np-pass2').value;
    if (p1.length < 6) { compteViewNewPass('Mot de passe trop court (6 caractères minimum).'); return; }
    if (p1 !== p2) { compteViewNewPass('Les deux mots de passe ne correspondent pas.'); return; }
    const b = $('np-btn'); b.disabled = true; b.textContent = '⏳…';
    try {
      const c = await sbClient();
      const { error } = await c.auth.updateUser({ password: p1 });
      if (error) throw error;
      renderCompte();
    } catch (e) {
      compteViewNewPass(compteErrorFr(e));
    }
  };
}

/* ------------------------------ Initialisation --------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Arrivée depuis le lien "réinitialiser mon mot de passe" du mail.
  if (location.hash.includes('type=recovery')) {
    sbClient().then(c => {
      c.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') compteViewNewPass();
      });
      // Si la session recovery est déjà établie au chargement :
      setTimeout(async () => {
        const { data } = await c.auth.getSession();
        if (data && data.session && location.hash.includes('type=recovery')) compteViewNewPass();
      }, 800);
    }).catch(() => {});
  }
  // Si déjà connecté : active la sync en arrière-plan (sans bloquer l'app).
  // Test local d'abord : pas de session stockée → on ne charge RIEN (ni CDN).
  if (typeof cloudConfigured === 'function' && cloudConfigured() && compteHasLocalSession()) {
    compteCurrentUser().then(u => { if (u) notesSyncPull().catch(() => {}); }).catch(() => {});
  }
  // Retour du réseau : re-pousse les notes (état offline OU push débouncé en attente).
  window.addEventListener('online', () => {
    if (_syncState === 'offline' || _syncTimer) {
      clearTimeout(_syncTimer); _syncTimer = null;
      notesSyncPush().catch(() => {});
    }
  });
  // Fermeture/mise en arrière-plan : tente d'envoyer tout push en attente
  // (best-effort ; sinon le pull au prochain lancement re-poussera le local).
  window.addEventListener('pagehide', () => {
    if (_syncTimer) {
      clearTimeout(_syncTimer); _syncTimer = null;
      notesSyncPush().catch(() => {});
    }
  });
});
