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
  const { data, error } = await c.from('epreuves')
    .select('id,matiere_id,titre,source,questions,quiz,signature,created_at')
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
    quiz: Array.isArray(epreuve.quiz) ? epreuve.quiz : [],
    signature: epreuve.signature || normalizeTitle(epreuve.titre || ''),
    status: 'pending',
    submitted_by: submittedBy || ''
  };
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
    <h3 class="admin-h3">⏳ Épreuves en attente</h3>
    <div id="admin-pending"><p class="scan-status">Chargement…</p></div>
    <button id="admin-home-btn" class="btn-secondary btn-block" style="margin-top:16px;">🏠 Accueil</button>`;
  $('admin-logout-btn').onclick = async () => { try { await cloudLogout(); } catch {} renderAdminScreen(); };
  $('admin-prog-btn').onclick = () => renderAdminProgramme(email);
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
