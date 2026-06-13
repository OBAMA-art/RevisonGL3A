/* =========================================================================
   cloud.js — Base partagée d'épreuves + modération (Supabase)
   PWA Révisions GL3A. Site statique : la PWA parle directement à Supabase.
   Flux : proposer (pending) → l'admin valide → visible par tous (approved).
   Réutilise les globales d'app.js : $, escapeHtml, go, normalizeTitle,
   getUserEpreuves, MATIERE_LABEL (ocr.js), renderEpreuveDetail, renderEpreuves.
   ========================================================================= */

const SUPABASE_LIB_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
const CLOUD_CACHE_KEY = 'gl3a_cloud_approved';
const CLOUD_SUBMITTED_KEY = 'gl3a_submitted_titles';
const CONFIG_CACHE_KEY = 'gl3a_matiere_config';
const VISITOR_KEY = 'gl3a_visitor_id';
const VISIT_DAY_KEY = 'gl3a_visit_day';

let _sbLib = null, _sbLibLoading = null, _sbClient = null;

function cloudConfigured() {
  return typeof SUPABASE_URL === 'string' && SUPABASE_URL.startsWith('http')
      && typeof SUPABASE_ANON_KEY === 'string' && SUPABASE_ANON_KEY.length > 20;
}

function loadSupabaseLib() {
  if (window.supabase && window.supabase.createClient) return Promise.resolve(window.supabase);
  if (_sbLibLoading) return _sbLibLoading;
  _sbLibLoading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SUPABASE_LIB_CDN; s.async = true;
    s.onload = () => (window.supabase && window.supabase.createClient)
      ? resolve(window.supabase)
      : (_sbLibLoading = null, reject(new Error('Supabase introuvable.')));
    s.onerror = () => { _sbLibLoading = null; reject(new Error('Chargement Supabase échoué (connexion requise).')); };
    document.head.appendChild(s);
  });
  return _sbLibLoading;
}

async function sbClient() {
  if (_sbClient) return _sbClient;
  if (!cloudConfigured()) throw new Error('Supabase non configuré.');
  const lib = _sbLib || (_sbLib = await loadSupabaseLib());
  _sbClient = lib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true }
  });
  return _sbClient;
}

/* ---------------------- ÉPREUVES VALIDÉES (lecture) ---------------------- */
function getCloudCache() {
  try { const o = JSON.parse(localStorage.getItem(CLOUD_CACHE_KEY) || '{}'); return o.data || {}; }
  catch { return {}; }
}
function getCloudApproved(matiereId) {
  return getCloudCache()[matiereId] || [];
}
// QCM (quiz) extraits des épreuves approuvées en ligne, pour cette matière.
function getCloudQuiz(matiereId) {
  return getCloudApproved(matiereId)
    .flatMap(e => Array.isArray(e.quiz) ? e.quiz : [])
    .filter(q => q && q.q && Array.isArray(q.options) && q.options.length >= 2);
}
function getCloudCacheAge() {
  try { const o = JSON.parse(localStorage.getItem(CLOUD_CACHE_KEY) || '{}'); return o.at || 0; }
  catch { return 0; }
}

// Récupère les épreuves approuvées et met à jour le cache local. Retourne le map par matière.
async function cloudFetchApproved() {
  const c = await sbClient();
  // select('*') : tolère l'absence de la colonne quiz tant que
  // supabase-ia.sql n'a pas été exécuté (elle arrive alors à undefined).
  const { data, error } = await c.from('epreuves')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
  if (error) throw error;
  const byMat = {};
  (data || []).forEach(r => { (byMat[r.matiere_id] = byMat[r.matiere_id] || []).push(r); });
  try { localStorage.setItem(CLOUD_CACHE_KEY, JSON.stringify({ at: Date.now(), data: byMat })); } catch {}
  return byMat;
}

/* ---------------- CONFIG MATIÈRES (classement par l'admin) --------------- */
function getMatiereConfigAll() {
  try { const o = JSON.parse(localStorage.getItem(CONFIG_CACHE_KEY) || '{}'); return o.data || {}; }
  catch { return {}; }
}
function getMatiereConfig(matiereId) {
  return getMatiereConfigAll()[matiereId] || null;
}
async function cloudFetchMatiereConfig() {
  const c = await sbClient();
  const { data, error } = await c.from('matiere_config').select('matiere_id,ue,exam_label,ordre');
  if (error) throw error;
  const byId = {};
  (data || []).forEach(r => { byId[r.matiere_id] = { ue: r.ue, exam_label: r.exam_label || '', ordre: r.ordre || 0 }; });
  try { localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify({ at: Date.now(), data: byId })); } catch {}
  return byId;
}
// Admin : enregistre (upsert) plusieurs configs d'un coup.
async function cloudSaveMatiereConfig(rows) {
  const c = await sbClient();
  const payload = rows.map(r => ({
    matiere_id: r.matiere_id,
    ue: r.ue || null,
    exam_label: r.exam_label || '',
    ordre: r.ordre || 0,
    updated_at: new Date().toISOString()
  }));
  const { error } = await c.from('matiere_config').upsert(payload, { onConflict: 'matiere_id' });
  if (error) throw error;
  return true;
}

/* -------------- ANNONCES D'EXAMEN (templates du délégué) ----------------- */
const ANNONCE_CACHE_KEY = 'gl3a_annonce';
const ANNONCE_VUE_KEY = 'gl3a_annonce_vue';

// Les 4 types d'examens du planning annuel IAI (+ annonce libre).
// 1er semestre : SN1 · 2nd semestre : SN2, puis Rattrapage des CC,
// et enfin Rattrapage des SN1 & SN2.
const EXAM_TEMPLATES = {
  sn1: {
    icone: '📘', label: 'Session Normale — 1er semestre (SN1)',
    titre: 'Session Normale du 1er semestre (SN1)',
    message: "Chers camarades, la Session Normale du 1er semestre (SN1) se tiendra {periode}. Mettez toutes les chances de votre côté : résumés, quiz et épreuves corrigées vous attendent dans l'app. Bonne révision à tous ! 💪"
  },
  sn2: {
    icone: '📗', label: 'Session Normale — 2nd semestre (SN2)',
    titre: 'Session Normale du 2nd semestre (SN2)',
    message: "Chers camarades, la Session Normale du 2nd semestre (SN2) se tiendra {periode}. C'est la dernière ligne droite du semestre : révisez régulièrement, entraînez-vous sur les épreuves corrigées. On se donne à fond ! 💪"
  },
  rattrapage_cc: {
    icone: '🔁', label: 'Rattrapage des Contrôles Continus (CC)',
    titre: 'Rattrapage des Contrôles Continus',
    message: "Chers camarades, le rattrapage des Contrôles Continus est programmé {periode}. Concernés : vérifiez vos matières, et appuyez-vous sur les quiz et épreuves corrigées de l'app pour combler les lacunes. Courage à tous ! 💪"
  },
  rattrapage_sn: {
    icone: '🔂', label: 'Rattrapage SN1 & SN2',
    titre: 'Rattrapage des Sessions Normales (SN1 & SN2)',
    message: "Chers camarades, le rattrapage des Sessions Normales (SN1 & SN2) se déroulera {periode}. C'est l'ultime chance de valider vos modules : consultez le planning dans l'app et révisez les matières concernées. Bonne chance à tous ! 💪"
  },
  libre: {
    icone: '📢', label: 'Annonce libre',
    titre: '',
    message: ''
  }
};

// '2026-06-10' → '10 juin 2026' (en UTC des deux côtés : la date affichée ne
// dépend pas du fuseau de l'appareil — pas de glissement au jour précédent).
function fmtDateFrISO(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
  if (!m) return '';
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]))
    .toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
function annoncePeriode(a) {
  const d = fmtDateFrISO(a && a.date_debut), f = fmtDateFrISO(a && a.date_fin);
  if (d && f) return 'du ' + d + ' au ' + f;
  if (d) return 'à partir du ' + d;
  return '';
}

// HTML de la bannière (partagé : accueil + aperçu admin). Tout est échappé.
function annonceBannerHTML(a, opts) {
  const t = EXAM_TEMPLATES[a.type] || EXAM_TEMPLATES.libre;
  const periode = annoncePeriode(a);
  const typeClass = /^[a-z0-9_]+$/.test(a.type || '') ? a.type : 'libre';
  return `
    <div class="annonce-banner annonce-${typeClass}">
      <div class="annonce-head">
        <span class="annonce-ico">${t.icone}</span>
        <div class="annonce-titles">
          <span class="annonce-kicker">📣 Annonce du délégué</span>
          <strong class="annonce-titre">${escapeHtml(a.titre || t.label)}</strong>
        </div>
        ${opts && opts.dismiss ? '<button class="annonce-close" id="annonce-close" aria-label="Fermer l\'annonce">✕</button>' : ''}
      </div>
      ${periode ? `<div class="annonce-periode">📅 ${escapeHtml(periode.charAt(0).toUpperCase() + periode.slice(1))}</div>` : ''}
      ${a.message ? `<p class="annonce-msg">${escapeHtml(a.message)}</p>` : ''}
    </div>`;
}

function getAnnonceCached() {
  try {
    const o = JSON.parse(localStorage.getItem(ANNONCE_CACHE_KEY) || 'null');
    const a = o && o.data;
    // Validation minimale : un cache corrompu ne doit pas casser le rendu.
    return (a && a.id && a.titre) ? a : null;
  } catch { return null; }
}
async function cloudFetchAnnonce() {
  const c = await sbClient();
  const { data, error } = await c.from('annonces')
    .select('id,type,titre,message,date_debut,date_fin,active,created_at')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) throw error;
  const a = (data && data[0]) || null;
  try { localStorage.setItem(ANNONCE_CACHE_KEY, JSON.stringify({ at: Date.now(), data: a })); } catch {}
  return a;
}
// Publie une annonce (et désactive la précédente : une seule active à la fois).
// NB : pas de transaction (2 requêtes) — sans gravité car il n'y a qu'un seul
// délégué, et la lecture (limit 1, plus récente) reste correcte même si deux
// annonces se retrouvaient actives.
async function cloudSaveAnnonce(a) {
  const c = await sbClient();
  const off = await c.from('annonces').update({ active: false }).eq('active', true);
  if (off.error) throw off.error;
  const { error } = await c.from('annonces').insert({
    type: a.type || 'libre',
    titre: a.titre,
    message: a.message || '',
    date_debut: a.date_debut || null,
    date_fin: a.date_fin || null,
    active: true
  });
  if (error) throw error;
  return cloudFetchAnnonce();
}
async function cloudDesactiverAnnonce() {
  const c = await sbClient();
  const { error } = await c.from('annonces').update({ active: false }).eq('active', true);
  if (error) throw error;
  try { localStorage.setItem(ANNONCE_CACHE_KEY, JSON.stringify({ at: Date.now(), data: null })); } catch {}
  return true;
}

/* ----------------- COMPTEUR DE VISITEURS (analytics) --------------------- */
function getVisitorId() {
  let id = null;
  try { id = localStorage.getItem(VISITOR_KEY); } catch {}
  if (!id) {
    id = (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : 'v-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    try { localStorage.setItem(VISITOR_KEY, id); } catch {}
  }
  return id;
}
// Enregistre une visite — au plus UNE par appareil et par jour. Silencieux si offline.
async function cloudTrackVisit() {
  if (!cloudConfigured()) return;
  const today = new Date().toISOString().slice(0, 10);
  try { if (localStorage.getItem(VISIT_DAY_KEY) === today) return; } catch {}
  try {
    const c = await sbClient();
    await c.from('visits').insert({
      visitor_id: getVisitorId(),
      day: today,
      ua: (navigator.userAgent || '').slice(0, 300)
    });
    try { localStorage.setItem(VISIT_DAY_KEY, today); } catch {}
  } catch (e) { /* table absente / offline : on ignore */ }
}
// Journalise un événement anonyme (matière ouverte, quiz terminé…). Fire-and-forget.
function logEvent(type, label) {
  if (!cloudConfigured()) return;
  sbClient().then(c => c.from('events').insert({
    visitor_id: getVisitorId(), type: type, label: label || null
  })).catch(() => {});
}
// Renvoie les compteurs agrégés { total, unique, today, today_unique }.
async function cloudVisitStats() {
  const c = await sbClient();
  const { data, error } = await c.rpc('visit_stats');
  if (error) throw error;
  return data || {};
}
// Tableau de bord complet (évolution, top matières, appareils, quiz).
async function cloudAnalytics() {
  const c = await sbClient();
  const { data, error } = await c.rpc('analytics_overview');
  if (error) throw error;
  return data || {};
}

/* ---------------------- SOUMISSION (contributeur) ------------------------ */
function getSubmittedSet() {
  try { return new Set(JSON.parse(localStorage.getItem(CLOUD_SUBMITTED_KEY) || '[]')); }
  catch { return new Set(); }
}
function markSubmitted(titre) {
  const set = getSubmittedSet();
  set.add(normalizeTitle(titre));
  try { localStorage.setItem(CLOUD_SUBMITTED_KEY, JSON.stringify([...set])); } catch {}
}
function isSubmitted(titre) {
  return getSubmittedSet().has(normalizeTitle(titre));
}

// Insère une épreuve en 'pending'. RLS + trigger garantissent qu'elle ne peut pas s'auto-valider.
async function cloudSubmitEpreuve(matiereId, epreuve, submittedBy) {
  const c = await sbClient();
  const row = {
    matiere_id: matiereId,
    titre: (epreuve.titre || '').trim(),
    source: epreuve.source || '',
    questions: epreuve.questions || [],
    signature: epreuve.signature || normalizeTitle(epreuve.titre || ''),
    status: 'pending',
    submitted_by: submittedBy || ''
  };
  // QCM extraits par l'IA : inclus seulement s'il y en a (la colonne quiz
  // n'existe qu'après exécution de supabase-ia.sql — les soumissions
  // classiques restent ainsi compatibles sans elle).
  if (Array.isArray(epreuve.quiz) && epreuve.quiz.length) row.quiz = epreuve.quiz;
  // Pas de .select() : un anon ne peut pas relire une ligne 'pending' (RLS).
  const { error } = await c.from('epreuves').insert(row);
  if (error) throw error;
  markSubmitted(row.titre);
  return true;
}

/* ---------------------------- AUTH ADMIN --------------------------------- */
async function cloudLogin(email, password) {
  const c = await sbClient();
  const { data, error } = await c.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
  return data;
}
async function cloudLogout() {
  const c = await sbClient();
  await c.auth.signOut();
}
async function cloudCurrentEmail() {
  if (!cloudConfigured()) return null;
  try {
    const c = await sbClient();
    const { data } = await c.auth.getUser();
    return data && data.user ? data.user.email : null;
  } catch { return null; }
}

/* ------------------------- MODÉRATION (admin) ---------------------------- */
async function cloudFetchPending() {
  const c = await sbClient();
  const { data, error } = await c.from('epreuves')
    .select('*').eq('status', 'pending').order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}
async function cloudModerate(id, approve) {
  const c = await sbClient();
  const { error } = await c.from('epreuves')
    .update({ status: approve ? 'approved' : 'rejected', reviewed_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

/* ====================== UI : SOUMETTRE UNE ÉPREUVE ======================= */
async function submitEpreuveToCloud(m, epreuve) {
  if (!cloudConfigured()) { alert('La base en ligne n\'est pas configurée.'); return; }
  // Doublon déjà validé en ligne ?
  const approved = getCloudApproved(m.id);
  const norm = normalizeTitle(epreuve.titre);
  if (approved.some(e => normalizeTitle(e.titre) === norm)) {
    alert('✅ Cette épreuve est déjà publiée en ligne pour cette matière.');
    return;
  }
  if (isSubmitted(epreuve.titre)) {
    if (!confirm('Tu as déjà soumis une épreuve avec ce titre. Soumettre quand même ?')) return;
  }
  if (!confirm(`Soumettre « ${epreuve.titre} » pour validation par le délégué ?\n\nElle restera visible chez toi en attendant.`)) return;

  try {
    await cloudSubmitEpreuve(m.id, epreuve, '');
    alert('📨 Épreuve envoyée !\n\nElle sera visible par tous une fois validée par le délégué.');
    renderEpreuves(m);
  } catch (e) {
    alert('❌ Échec de l\'envoi : ' + (e.message || e) + '\n(Vérifie ta connexion Internet.)');
  }
}

/* ====================== UI : ÉCRAN ADMIN / MODÉRATION ==================== */
function matLabel(id) {
  return (typeof MATIERE_LABEL !== 'undefined' && MATIERE_LABEL[id]) || id;
}

async function renderAdminScreen() {
  go('admin');
  $('admin-content').innerHTML = '<p class="scan-status">⏳ Connexion à la base…</p>';
  if (!cloudConfigured()) {
    $('admin-content').innerHTML = '<p class="form-error">La base en ligne n\'est pas configurée.</p>';
    return;
  }
  const email = await cloudCurrentEmail();
  if (email) showAdminQueue(email);
  else showAdminLogin();
}

function showAdminLogin(errMsg) {
  $('admin-content').innerHTML = `
    <p class="form-intro">Espace réservé au délégué. Connecte-toi pour valider les épreuves proposées par les camarades.</p>
    ${errMsg ? `<div class="form-error">${escapeHtml(errMsg)}</div>` : ''}
    <div class="form-group">
      <label for="admin-email">Email</label>
      <input type="email" id="admin-email" placeholder="ton email admin" autocomplete="username">
    </div>
    <div class="form-group">
      <label for="admin-pass">Mot de passe</label>
      <input type="password" id="admin-pass" placeholder="••••••••" autocomplete="current-password">
    </div>
    <div class="form-actions">
      <button id="admin-login-btn" class="btn-primary">🔐 Se connecter</button>
      <button id="admin-back-btn" class="btn-secondary">← Retour</button>
    </div>`;
  $('admin-login-btn').onclick = async () => {
    const email = $('admin-email').value, pass = $('admin-pass').value;
    if (!email || !pass) { showAdminLogin('Email et mot de passe requis.'); return; }
    $('admin-login-btn').textContent = '⏳ Connexion…';
    $('admin-login-btn').disabled = true;
    try {
      await cloudLogin(email, pass);
      showAdminQueue(email);
    } catch (e) {
      showAdminLogin('Connexion refusée : ' + (e.message || 'identifiants incorrects') + '.');
    }
  };
  $('admin-back-btn').onclick = () => renderHome();
}

async function showAdminQueue(email) {
  $('admin-content').innerHTML = `
    <div class="admin-bar">
      <span class="admin-who">👤 ${escapeHtml(email)}</span>
      <button id="admin-logout-btn" class="btn-secondary">Déconnexion</button>
    </div>
    <div id="admin-stats" class="admin-stats"><p class="scan-status">📊 Chargement des statistiques…</p></div>
    <button id="admin-prog-btn" class="btn-primary btn-block">📅 Organiser le programme (UE & horaires)</button>
    <button id="admin-annonce-btn" class="btn-primary btn-block">📢 Annoncer un examen</button>
    <button id="admin-etudiants-btn" class="btn-primary btn-block">👥 Étudiants inscrits</button>
    <h3 class="admin-h3">⏳ Épreuves en attente</h3>
    <div id="admin-pending"><p class="scan-status">Chargement…</p></div>
    <button id="admin-home-btn" class="btn-secondary btn-block" style="margin-top:16px;">🏠 Accueil</button>`;
  $('admin-logout-btn').onclick = async () => { try { await cloudLogout(); } catch {} renderAdminScreen(); };
  $('admin-prog-btn').onclick = () => renderAdminProgramme(email);
  $('admin-annonce-btn').onclick = () => renderAdminAnnonce(email);
  $('admin-etudiants-btn').onclick = () => renderAdminEtudiants(email);
  $('admin-home-btn').onclick = () => renderHome();

  // Tableau de bord de fréquentation (détaillé)
  cloudAnalytics().then(a => renderAnalytics(a))
    .catch(() => {
      // repli sur les compteurs simples si analytics_overview n'existe pas encore
      cloudVisitStats().then(s => renderAnalytics(s))
        .catch(() => {
          $('admin-stats').innerHTML = `<div class="form-error">📊 Statistiques indisponibles. As-tu exécuté le SQL <code>supabase-visits.sql</code> ?</div>`;
        });
    });

  let pending;
  try { pending = await cloudFetchPending(); }
  catch (e) {
    $('admin-pending').innerHTML = `<div class="form-error">Erreur de chargement : ${escapeHtml(e.message || '')}.<br>Si tu vois "permission", ton compte n'est pas dans la liste des admins.</div>`;
    return;
  }

  if (!pending.length) {
    $('admin-pending').innerHTML = '<p class="scan-status">🎉 Aucune épreuve en attente. Tout est à jour !</p>';
    return;
  }

  $('admin-pending').innerHTML = pending.map(ep => `
    <div class="admin-card" data-id="${ep.id}">
      <div class="admin-card-head">
        <span class="scan-badge scan-badge-maybe">${escapeHtml(matLabel(ep.matiere_id))}</span>
        <span class="admin-q">${(ep.questions || []).length} question(s)</span>
      </div>
      <div class="admin-card-titre">${escapeHtml(ep.titre)}</div>
      <div class="admin-card-src">${escapeHtml(ep.source || '')}</div>
      <details class="scan-raw">
        <summary>👁️ Aperçu des questions</summary>
        <pre>${escapeHtml((ep.questions || []).map((q, i) =>
          `Q${q.numero || (i + 1)} — ${q.enonce || ''}\n→ ${(q.correction || '').slice(0, 400)}`).join('\n\n'))}</pre>
      </details>
      <div class="admin-actions">
        <button class="btn-primary admin-approve" data-id="${ep.id}">✅ Valider</button>
        <button class="btn-secondary admin-reject" data-id="${ep.id}">🗑️ Rejeter</button>
      </div>
    </div>`).join('');

  document.querySelectorAll('.admin-approve').forEach(b => b.onclick = () => moderate(b.dataset.id, true, email));
  document.querySelectorAll('.admin-reject').forEach(b => b.onclick = () => moderate(b.dataset.id, false, email));
}

/* ============== UI : TABLEAU DE BORD DE FRÉQUENTATION ==================== */
function renderAnalytics(a) {
  a = a || {};
  const box = $('admin-stats');
  if (!box) return;

  // KPI principaux
  let html = `
    <div class="stat-grid">
      <div class="stat-box"><span class="stat-num">${a.unique ?? 0}</span><span class="stat-lbl">👥 Visiteurs uniques</span></div>
      <div class="stat-box"><span class="stat-num">${a.today_unique ?? 0}</span><span class="stat-lbl">📆 Uniques aujourd'hui</span></div>
      <div class="stat-box"><span class="stat-num">${a.today ?? 0}</span><span class="stat-lbl">⚡ Visites aujourd'hui</span></div>
      <div class="stat-box"><span class="stat-num">${a.total ?? 0}</span><span class="stat-lbl">📈 Visites totales</span></div>
    </div>`;

  // Évolution (14 derniers jours) — mini bar chart
  const byDay = Array.isArray(a.by_day) ? a.by_day : [];
  if (byDay.length) {
    const maxV = Math.max(1, ...byDay.map(d => d.visits || 0));
    const bars = byDay.map(d => {
      const h = Math.round(((d.visits || 0) / maxV) * 64) + 4;
      const jour = (d.day || '').slice(8, 10) + '/' + (d.day || '').slice(5, 7);
      return `<div class="chart-col" title="${escapeHtml(d.day)} : ${d.visits} visites, ${d.uniques} uniques">
        <div class="chart-bar" style="height:${h}px"></div>
        <span class="chart-x">${escapeHtml(jour)}</span>
      </div>`;
    }).join('');
    html += `<div class="stat-card">
      <div class="stat-title">📊 Évolution (14 derniers jours)</div>
      <div class="chart-row">${bars}</div>
    </div>`;
  }

  // Top matières consultées (toujours affiché, même vide)
  const top = Array.isArray(a.top_matieres) ? a.top_matieres : [];
  let topHtml;
  if (top.length) {
    const maxN = Math.max(1, ...top.map(t => t.n || 0));
    topHtml = top.map(t => {
      const w = Math.round(((t.n || 0) / maxN) * 100);
      return `<div class="bar-row">
        <span class="bar-lbl">${escapeHtml(matLabel(t.label))}</span>
        <span class="bar-track"><span class="bar-fill" style="width:${w}%"></span></span>
        <span class="bar-n">${t.n}</span>
      </div>`;
    }).join('');
  } else {
    topHtml = `<p class="stat-empty">Aucune matière consultée pour l'instant. Les données apparaîtront dès que les étudiants ouvriront des matières (et que le SQL <code>analytics</code> est exécuté).</p>`;
  }
  html += `<div class="stat-card">
    <div class="stat-title">📚 Matières les plus consultées</div>
    ${topHtml}
  </div>`;

  // Appareils + quiz
  const dev = a.devices || {};
  const mob = dev.mobile || 0, desk = dev.desktop || 0, tot = mob + desk;
  const pMob = tot ? Math.round((mob / tot) * 100) : 0;
  html += `<div class="stat-grid">
    <div class="stat-box"><span class="stat-num">${tot ? pMob + '%' : '—'}</span><span class="stat-lbl">📱 Mobile (${mob}) · 💻 ${desk}</span></div>
    <div class="stat-box"><span class="stat-num">${a.quiz_done ?? 0}</span><span class="stat-lbl">🎯 Quiz terminés</span></div>
  </div>`;

  box.innerHTML = html;
}

/* ============== UI : ADMIN — ORGANISER LE PROGRAMME (UE & horaires) ====== */
async function renderAdminProgramme(email) {
  $('admin-content').innerHTML = '<p class="scan-status">⏳ Chargement du programme…</p>';
  // Récupère la config la plus fraîche
  let cfg = {};
  try { cfg = await cloudFetchMatiereConfig(); } catch (e) { cfg = getMatiereConfigAll(); }

  const mats = (typeof getAllMatieres === 'function') ? getAllMatieres() : [];
  const unites = (typeof UNITES !== 'undefined') ? UNITES : [];
  const ueOptions = (sel) => unites.map(u =>
    `<option value="${u.id}"${u.id === sel ? ' selected' : ''}>${escapeHtml(u.label)}</option>`).join('');

  $('admin-content').innerHTML = `
    <div class="admin-bar">
      <span class="admin-who">📅 Programme des rattrapages</span>
      <button id="prog-back-btn" class="btn-secondary">← Modération</button>
    </div>
    <p class="form-intro">Classe chaque matière dans son UE et renseigne son horaire/date d'examen selon le programme officiel. Laisse l'horaire vide tant qu'il n'est pas connu. Tout le monde verra ces infos.</p>
    <div class="prog-list">
      ${mats.map(m => {
        const c = cfg[m.id] || {};
        const ue = c.ue || m.ue || '';
        return `
        <div class="prog-row" data-id="${m.id}">
          <div class="prog-mat"><span>${m.icone || '📘'}</span><strong>${escapeHtml(m.titre)}</strong></div>
          <label class="prog-field">UE
            <select data-f="ue">${ueOptions(ue)}</select>
          </label>
          <label class="prog-field">Horaire / date d'examen
            <input type="text" data-f="exam" value="${escapeHtml(c.exam_label || '')}" placeholder="ex: Lundi 15 juin · 08h-10h" maxlength="60">
          </label>
        </div>`;
      }).join('')}
    </div>
    <div id="prog-msg"></div>
    <div class="form-actions">
      <button id="prog-save-btn" class="btn-primary">💾 Enregistrer le programme</button>
      <button id="prog-home-btn" class="btn-secondary">🏠 Accueil</button>
    </div>`;

  $('prog-back-btn').onclick = () => showAdminQueue(email);
  $('prog-home-btn').onclick = () => renderHome();
  $('prog-save-btn').onclick = async () => {
    const rows = [];
    document.querySelectorAll('.prog-row').forEach((row, i) => {
      rows.push({
        matiere_id: row.dataset.id,
        ue: row.querySelector('[data-f="ue"]').value,
        exam_label: row.querySelector('[data-f="exam"]').value.trim(),
        ordre: i
      });
    });
    $('prog-save-btn').disabled = true;
    $('prog-save-btn').textContent = '⏳ Enregistrement…';
    try {
      await cloudSaveMatiereConfig(rows);
      await cloudFetchMatiereConfig().catch(() => {});
      $('prog-msg').innerHTML = '<div class="form-success">✅ Programme enregistré ! Visible par tous les étudiants.</div>';
    } catch (e) {
      $('prog-msg').innerHTML = `<div class="form-error">❌ ${escapeHtml(e.message || 'Échec')}.</div>`;
    } finally {
      $('prog-save-btn').disabled = false;
      $('prog-save-btn').textContent = '💾 Enregistrer le programme';
    }
  };
  go('admin');
}

async function moderate(id, approve, email) {
  if (!approve && !confirm('Rejeter définitivement cette proposition ?')) return;
  const card = document.querySelector(`.admin-card[data-id="${id}"]`);
  if (card) card.style.opacity = '0.5';
  try {
    await cloudModerate(id, approve);
    if (approve) await cloudFetchApproved().catch(() => {}); // rafraîchit le cache public
    showAdminQueue(email); // recharge la file
  } catch (e) {
    if (card) card.style.opacity = '1';
    alert('❌ Action impossible : ' + (e.message || e));
  }
}

/* ============== UI : ADMIN — ANNONCER UN EXAMEN (templates) ============== */
async function renderAdminAnnonce(email) {
  $('admin-content').innerHTML = '<p class="scan-status">⏳ Chargement…</p>';
  if (typeof EXAM_TEMPLATES === 'undefined') {
    $('admin-content').innerHTML = '<p class="form-error">Configuration des annonces indisponible (ancien cache). Recharge l\'application.</p>';
    return;
  }
  let cur = null;
  try { cur = await cloudFetchAnnonce(); } catch { cur = getAnnonceCached(); }

  const types = Object.keys(EXAM_TEMPLATES);
  $('admin-content').innerHTML = `
    <div class="admin-bar">
      <span class="admin-who">📢 Annoncer un examen</span>
      <button id="annonce-back" class="btn-secondary">← Modération</button>
    </div>
    <p class="form-intro">Les <strong>4 types d'examens du planning annuel</strong> sont prédéfinis :
    choisis-en un, le titre et le message se remplissent tout seuls (tu peux les retoucher),
    ajoute les dates, publie — l'annonce s'affiche sur l'accueil de tous les camarades.</p>
    ${cur ? `
    <div class="annonce-cur">
      <span>Annonce active : <strong>${escapeHtml(cur.titre)}</strong></span>
      <button id="annonce-off" class="btn-secondary">🚫 Désactiver</button>
    </div>` : ''}
    <div class="annonce-types">
      ${types.map(t => `
        <button class="annonce-type" data-t="${t}">
          <span class="annonce-type-ico">${EXAM_TEMPLATES[t].icone}</span>
          <span>${escapeHtml(EXAM_TEMPLATES[t].label)}</span>
        </button>`).join('')}
    </div>
    <div class="annonce-dates">
      <div class="form-group"><label for="annonce-debut">Date de début</label>
        <input type="date" id="annonce-debut"></div>
      <div class="form-group"><label for="annonce-fin">Date de fin</label>
        <input type="date" id="annonce-fin"></div>
    </div>
    <div class="form-group">
      <label for="annonce-titre">Titre de l'annonce <span class="required">*</span></label>
      <input type="text" id="annonce-titre" maxlength="120" placeholder="ex: Session Normale du 1er semestre (SN1)">
    </div>
    <div class="form-group">
      <label for="annonce-msg">Message aux camarades</label>
      <textarea id="annonce-msg" rows="4" maxlength="600" placeholder="Le message qui accompagne l'annonce…"></textarea>
    </div>
    <div class="form-divider">Aperçu (ce que verront les camarades)</div>
    <div id="annonce-preview"></div>
    <div id="annonce-msg-zone"></div>
    <div class="form-actions">
      <button id="annonce-save" class="btn-primary">📣 Publier l'annonce</button>
    </div>`;

  let selType = (cur && cur.type) || null;

  const readForm = () => ({
    type: selType || 'libre',
    titre: $('annonce-titre').value.trim(),
    message: $('annonce-msg').value.trim(),
    date_debut: $('annonce-debut').value || null,
    date_fin: $('annonce-fin').value || null
  });
  const updatePreview = () => {
    const a = readForm();
    $('annonce-preview').innerHTML = (a.titre || a.message)
      ? annonceBannerHTML(a)
      : '<p class="scan-status">Choisis un type d\'examen ci-dessus pour générer l\'annonce.</p>';
  };

  // Le message est-il encore celui du template ? (si le délégué l'a retouché
  // à la main, on ne l'écrase plus automatiquement)
  let msgEdited = false;

  const applyTemplate = (t) => {
    selType = t;
    document.querySelectorAll('.annonce-type').forEach(b =>
      b.classList.toggle('annonce-type-sel', b.dataset.t === t));
    const tpl = EXAM_TEMPLATES[t];
    const periode = annoncePeriode(readForm()) || 'prochainement (dates à confirmer)';
    if (tpl.titre) $('annonce-titre').value = tpl.titre;
    if (tpl.message) $('annonce-msg').value = tpl.message.replace('{periode}', periode);
    msgEdited = false;   // choisir un template régénère volontairement le message
    updatePreview();
  };

  document.querySelectorAll('.annonce-type').forEach(b => {
    b.onclick = () => applyTemplate(b.dataset.t);
  });
  ['annonce-titre', 'annonce-msg', 'annonce-debut', 'annonce-fin'].forEach(id => {
    $(id).addEventListener('input', updatePreview);
  });
  $('annonce-msg').addEventListener('input', () => { msgEdited = true; });
  // Si les dates changent APRÈS le choix du template, on régénère le message
  // SAUF si le délégué l'a déjà personnalisé (pas de perte de saisie).
  ['annonce-debut', 'annonce-fin'].forEach(id => {
    $(id).addEventListener('change', () => {
      if (selType && selType !== 'libre' && !msgEdited) applyTemplate(selType);
    });
  });

  // Pré-remplir depuis l'annonce active (pour modification rapide)
  if (cur) {
    if (cur.date_debut) $('annonce-debut').value = String(cur.date_debut).slice(0, 10);
    if (cur.date_fin) $('annonce-fin').value = String(cur.date_fin).slice(0, 10);
    $('annonce-titre').value = cur.titre || '';
    $('annonce-msg').value = cur.message || '';
    if (cur.message) msgEdited = true;   // message existant = à préserver
    document.querySelectorAll('.annonce-type').forEach(b =>
      b.classList.toggle('annonce-type-sel', b.dataset.t === selType));
  }
  updatePreview();

  $('annonce-back').onclick = () => showAdminQueue(email);
  const offBtn = $('annonce-off');
  if (offBtn) offBtn.onclick = async () => {
    if (!confirm('Désactiver l\'annonce actuellement affichée sur l\'accueil ?')) return;
    offBtn.disabled = true;
    try { await cloudDesactiverAnnonce(); renderAdminAnnonce(email); }
    catch (e) { alert('❌ ' + (e.message || 'Échec')); offBtn.disabled = false; }
  };

  $('annonce-save').onclick = async () => {
    const a = readForm();
    if (!a.titre) {
      $('annonce-msg-zone').innerHTML = '<div class="form-error">Le titre est obligatoire.</div>';
      return;
    }
    if (a.date_debut && a.date_fin && a.date_fin < a.date_debut) {
      $('annonce-msg-zone').innerHTML = '<div class="form-error">La date de fin est avant la date de début.</div>';
      return;
    }
    const btn = $('annonce-save');
    btn.disabled = true; btn.textContent = '⏳ Publication…';
    try {
      await cloudSaveAnnonce(a);
      $('annonce-msg-zone').innerHTML = '<div class="form-success">✅ Annonce publiée ! Elle s\'affiche maintenant sur l\'accueil de tous.</div>';
    } catch (e) {
      $('annonce-msg-zone').innerHTML = `<div class="form-error">❌ ${escapeHtml(e.message || 'Échec')}.<br>As-tu exécuté le SQL <code>supabase-annonces.sql</code> ?</div>`;
    } finally {
      btn.disabled = false; btn.textContent = '📣 Publier l\'annonce';
    }
  };
}

/* ============== UI : ADMIN — ÉTUDIANTS INSCRITS (profils) ================ */
// Le délégué voit les PROFILS (pour redonner un matricule oublié) —
// jamais les notes (RLS owner-only) ni les mots de passe (hachés).
async function renderAdminEtudiants(email) {
  $('admin-content').innerHTML = '<p class="scan-status">⏳ Chargement des étudiants…</p>';
  let rows = [];
  try {
    const c = await sbClient();
    const { data, error } = await c.from('etudiants')
      .select('nom,prenoms,email,date_naissance,lieu_naissance,classe,matricule,annee_academique,created_at')
      .order('nom', { ascending: true });
    if (error) throw error;
    rows = data || [];
  } catch (e) {
    $('admin-content').innerHTML = `
      <div class="admin-bar"><span class="admin-who">👥 Étudiants inscrits</span>
        <button id="etu-back" class="btn-secondary">← Modération</button></div>
      <div class="form-error">Erreur : ${escapeHtml(e.message || 'chargement impossible')}.<br>
      As-tu exécuté le SQL <code>supabase-comptes.sql</code> ?</div>`;
    $('etu-back').onclick = () => showAdminQueue(email);
    return;
  }

  const card = (r) => `
    <div class="etu-card" data-search="${escapeHtml(((r.nom || '') + ' ' + (r.prenoms || '') + ' ' + (r.matricule || '') + ' ' + (r.classe || '')).toLowerCase())}">
      <div class="etu-head">
        <strong>${escapeHtml((r.nom || '').toUpperCase())} ${escapeHtml(r.prenoms || '')}</strong>
        <span class="etu-matricule">${escapeHtml(r.matricule || '—')}</span>
      </div>
      <div class="etu-infos">
        <span>🏫 ${escapeHtml(r.classe || '—')} · ${escapeHtml(r.annee_academique || '—')}</span>
        <span>✉️ ${escapeHtml(r.email || '—')}</span>
        <span>🎂 ${r.date_naissance ? escapeHtml(fmtDateFrISO(r.date_naissance)) : '—'}${r.lieu_naissance ? ' à ' + escapeHtml(r.lieu_naissance) : ''}</span>
      </div>
    </div>`;

  $('admin-content').innerHTML = `
    <div class="admin-bar">
      <span class="admin-who">👥 ${rows.length} étudiant${rows.length > 1 ? 's' : ''} inscrit${rows.length > 1 ? 's' : ''}</span>
      <button id="etu-back" class="btn-secondary">← Modération</button>
    </div>
    <p class="form-intro">Si un camarade a oublié son <strong>matricule</strong>, retrouve-le ici pour le lui
    redonner (il pourra alors réinitialiser son mot de passe). Les <strong>notes</strong> des étudiants ne sont
    pas visibles : elles restent privées.</p>
    <div class="form-group">
      <input type="text" id="etu-search" placeholder="🔍 Rechercher (nom, matricule, classe…)" maxlength="60">
    </div>
    <p id="etu-count" class="scan-status" role="status" aria-live="polite"></p>
    <div id="etu-list">${rows.length ? rows.map(card).join('') : '<p class="scan-status">Aucun étudiant inscrit pour le moment.</p>'}</div>`;

  $('etu-back').onclick = () => showAdminQueue(email);
  $('etu-search').addEventListener('input', () => {
    const q = $('etu-search').value.trim().toLowerCase();
    let visibles = 0;
    document.querySelectorAll('.etu-card').forEach(c => {
      const hide = q !== '' && !(c.dataset.search || '').includes(q);
      c.hidden = hide;
      if (!hide) visibles++;
    });
    $('etu-count').textContent = q === '' ? ''
      : visibles === 0 ? `Aucun étudiant ne correspond à « ${q} ».`
      : `${visibles} résultat${visibles > 1 ? 's' : ''} sur ${rows.length}.`;
  });
}
