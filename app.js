// Application Révisions GL3A - Logique
'use strict';

const $ = (id) => document.getElementById(id);
const STORAGE_BEST = 'gl3a_best_scores';
const STORAGE_THEME = 'gl3a_theme';
const STORAGE_WELCOME = 'gl3a_welcome_seen';
const STORAGE_USER_EPREUVES = 'gl3a_user_epreuves';
const STORAGE_UE_OPEN = 'gl3a_ue_open';

const state = {
  matiere: null,
  currentScreen: 'home',
  history: [],
  quiz: {
    questions: [],
    index: 0,
    score: 0,
    answered: false,
    erreurs: []
  }
};

// ============ NAVIGATION (synchronisée avec l'historique du navigateur) ============
let _navLock = false;   // vrai pendant une restauration (popstate) : on n'écrit pas l'historique

function currentRoute(screenId) {
  return { screen: screenId, m: (state.matiere && state.matiere.id) || null };
}

function go(screenId, addToHistory = true) {
  const changed = state.currentScreen !== screenId;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = $(`screen-${screenId}`);
  if (!target) return;
  target.classList.add('active');
  window.scrollTo({top: 0, behavior: 'instant'});
  state.currentScreen = screenId;
  $('btnBack').hidden = (screenId === 'home');

  // Synchronise l'historique du navigateur (sauf pendant une restauration)
  if (!_navLock) {
    const route = currentRoute(screenId);
    try { sessionStorage.setItem('gl3a_route', JSON.stringify(route)); } catch {}
    if (addToHistory && changed) history.pushState(route, '');
    else history.replaceState(route, '');
  }
}

// Le bouton retour de l'app = le bouton retour du téléphone (on dépile l'historique)
function goBack() {
  history.back();
}

// Restaure/affiche l'écran décrit par une route (sans réécrire l'historique).
function dispatchRoute(route) {
  const m = (route && route.m && typeof findMatiereById === 'function') ? findMatiereById(route.m) : null;
  if (m) state.matiere = m;   // rétablit le contexte matière après restauration
  switch (route && route.screen) {
    case 'planning':        renderPlanning(); break;
    case 'mes-notes':       (typeof renderMesNotes === 'function') ? renderMesNotes() : renderHome(); break;
    case 'matiere':         m ? renderMatiere(m) : renderHome(); break;
    case 'resume':          m ? renderResume(m) : renderHome(); break;
    case 'sujets':          m ? renderSujets(m) : renderHome(); break;
    case 'epreuves':        m ? renderEpreuves(m) : renderHome(); break;
    // Écrans à état dynamique : on revient au parent sûr
    case 'quiz':
    case 'result':
    case 'review':          m ? renderMatiere(m) : renderHome(); break;
    case 'epreuve-detail':
    case 'scan-epreuve':
    case 'add-epreuve':     m ? renderEpreuves(m) : renderHome(); break;
    case 'admin':           renderHome(); break;   // nécessite reconnexion
    case 'home':
    default:                renderHome(); break;
  }
}

// Bouton retour du navigateur / du téléphone
window.addEventListener('popstate', (e) => {
  const route = (e.state && e.state.screen) ? e.state : { screen: 'home', m: null };
  try { sessionStorage.setItem('gl3a_route', JSON.stringify(route)); } catch {}
  _navLock = true;
  dispatchRoute(route);
  _navLock = false;
});

// ============ ACCUEIL (groupé par Unité d'Enseignement) ============
function getAllMatieres() {
  return [
    ...(typeof MATIERES !== 'undefined' ? MATIERES : []),
    ...(typeof MATIERES_JEUDI !== 'undefined' ? MATIERES_JEUDI : []),
    ...(typeof MATIERES_EXTRA !== 'undefined' ? MATIERES_EXTRA : [])
  ];
}

function isMatiereVide(m) {
  return (!m.resume || !m.resume.length)
      && (!m.qcm || !m.qcm.length)
      && (!m.questionsOuvertes || !m.questionsOuvertes.length);
}

// État déplié/replié des UE (mémorisé)
function getOpenUEs() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_UE_OPEN) || '[]')); }
  catch { return new Set(); }
}
function toggleUE(ueId) {
  const set = getOpenUEs();
  if (set.has(ueId)) set.delete(ueId); else set.add(ueId);
  try { localStorage.setItem(STORAGE_UE_OPEN, JSON.stringify([...set])); } catch {}
  return set.has(ueId);
}

// UE effective = celle fixée par l'admin (config) sinon celle par défaut de la matière.
function getEffectiveUE(m) {
  const c = (typeof getMatiereConfig === 'function') ? getMatiereConfig(m.id) : null;
  return (c && c.ue) || m.ue;
}
// Horaire/date d'examen : priorité à l'admin (Supabase), sinon programme officiel embarqué.
function getExamLabel(m) {
  const c = (typeof getMatiereConfig === 'function') ? getMatiereConfig(m.id) : null;
  if (c && c.exam_label) return c.exam_label;
  return (typeof programmeLabel === 'function') ? programmeLabel(m.id) : '';
}
function getMatiereOrdre(m) {
  const c = (typeof getMatiereConfig === 'function') ? getMatiereConfig(m.id) : null;
  if (c && typeof c.ordre === 'number' && c.ordre > 0) return c.ordre;
  const p = (typeof programmeInfo === 'function') ? programmeInfo(m.id) : null;
  if (p && typeof p.ordre === 'number' && p.ordre > 0) return p.ordre;
  return 999;
}
// Statut de l'épreuve selon l'horloge : 'passe' | 'encours' | 'avenir' | null.
function getExamStatus(m) {
  return (typeof programmeStatus === 'function') ? programmeStatus(m.id) : null;
}

function renderHome(skipConfigRefresh) {
  const list = $('matieres-list');
  const allMatieres = getAllMatieres();
  const unites = (typeof UNITES !== 'undefined') ? UNITES : [];

  const renderCard = m => {
    const vide = isMatiereVide(m);
    const examLabel = getExamLabel(m);
    const status = getExamStatus(m);
    let statusClass = '', badge = '';
    if (status === 'passe') {
      statusClass = ' exam-passe';
      badge = '<span class="exam-badge badge-passe">✅ Déjà passé</span>';
    } else if (status === 'encours') {
      statusClass = ' exam-encours';
      badge = '<span class="exam-badge badge-encours">🔴 En ce moment</span>';
    } else if (status === 'avenir') {
      badge = '<span class="exam-badge badge-avenir">⏳ À passer</span>';
    }
    const meta = examLabel ? `📅 ${escapeHtml(examLabel)}` : (vide ? '📭 Contenu à venir' : '📚 Disponible');
    return `
    <button class="matiere-card${vide ? ' matiere-vide' : ''}${statusClass}" data-id="${m.id}" style="--accent: ${m.couleur}">
      <span class="icon">${m.icone}</span>
      <span class="info">
        <h3>${escapeHtml(m.titre)}</h3>
        <p>${escapeHtml(m.sousTitre)}</p>
        <span class="time">${meta}</span>
        ${badge}
      </span>
      <span class="arrow">›</span>
    </button>`;
  };

  const openSet = getOpenUEs();
  const sectionHTML = (ueId, icone, label, items) => {
    const prets = items.filter(m => !isMatiereVide(m)).length;
    const passes = items.filter(m => getExamStatus(m) === 'passe').length;
    const open = openSet.has(ueId);
    const passesTxt = passes ? ` · ${passes} déjà passée${passes > 1 ? 's' : ''}` : '';
    return `
      <div class="ue-section${open ? ' ue-open' : ''}" data-ue="${ueId}">
        <button class="ue-header" data-ue-toggle="${ueId}">
          <span class="ue-icon">${icone || '📦'}</span>
          <div class="ue-title">
            <h3>${label}</h3>
            <span class="ue-sub">${items.length} matières · ${prets} avec contenu${passesTxt}</span>
          </div>
          <span class="ue-chevron">▾</span>
        </button>
        <div class="ue-cards">${items.map(renderCard).join('')}</div>
      </div>`;
  };

  let html = '';
  let lastSem = null;
  unites.forEach(ue => {
    const items = allMatieres
      .filter(m => getEffectiveUE(m) === ue.id)
      .sort((a, b) => getMatiereOrdre(a) - getMatiereOrdre(b));
    if (!items.length) return;
    if (ue.semestre !== lastSem) {
      html += `<div class="sem-divider">${ue.semestre === 'S5' ? 'Semestre 5' : 'Semestre 6'}</div>`;
      lastSem = ue.semestre;
    }
    html += sectionHTML(ue.id, ue.icone, ue.label, items);
  });
  // Matières sans UE reconnue (sécurité)
  const orphelines = allMatieres.filter(m => !unites.some(u => u.id === getEffectiveUE(m)));
  if (orphelines.length) {
    html += sectionHTML('autres', '📦', 'Autres matières', orphelines);
  }
  list.innerHTML = html;

  // Accordéon : clic sur l'en-tête déroule/replie l'UE
  list.querySelectorAll('.ue-header').forEach(h => {
    h.addEventListener('click', () => {
      const section = h.closest('.ue-section');
      const isOpen = toggleUE(h.dataset.ueToggle);
      section.classList.toggle('ue-open', isOpen);
    });
  });

  list.querySelectorAll('.matiere-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const m = allMatieres.find(x => x.id === btn.dataset.id);
      renderMatiere(m);
    });
  });
  // Bouton « Planning des rattrapages » + sous-titre dynamique (X passées · Y à venir)
  const _plan = $('btn-planning');
  if (_plan) {
    const scheduled = allMatieres.filter(m => getExamStatus(m) !== null);
    const passes = scheduled.filter(m => getExamStatus(m) === 'passe').length;
    const restants = scheduled.length - passes;
    const sub = $('planning-cta-sub');
    if (sub) sub.textContent = scheduled.length
      ? `${passes} passée${passes > 1 ? 's' : ''} · ${restants} restante${restants > 1 ? 's' : ''}`
      : 'Calendrier des épreuves';
    _plan.onclick = () => renderPlanning();
  }

  // Bouton espace délégué (modération)
  const _adm = $('btn-admin');
  if (_adm) {
    if (typeof cloudConfigured === 'function' && cloudConfigured()) {
      _adm.hidden = false;
      _adm.onclick = () => renderAdminScreen();
    } else {
      _adm.hidden = true;
    }
  }
  $('appTitle').textContent = 'Révisions GL3A';
  $('appSubtitle').textContent = 'Rattrapages SN1 & SN2';
  go('home', false);
  state.history = [];

  // Rafraîchit en arrière-plan le classement officiel (config admin) une seule fois, puis re-render.
  if (!skipConfigRefresh && typeof cloudFetchMatiereConfig === 'function' && cloudConfigured()) {
    cloudFetchMatiereConfig().then(() => {
      if (state.currentScreen === 'home') renderHome(true);
    }).catch(() => {});
  }
}

// ============ ÉCRAN PLANNING DES RATTRAPAGES ============
function renderPlanning() {
  const all = getAllMatieres();
  const now = new Date();
  const scheduled = all
    .filter(m => programmeInfo(m.id))
    .sort((a, b) => programmeInfo(a.id).ordre - programmeInfo(b.id).ordre)
    .map(m => ({ m, p: programmeInfo(m.id), st: programmeStatus(m.id, now) }));

  const passes  = scheduled.filter(x => x.st === 'passe');
  const encours = scheduled.filter(x => x.st === 'encours');
  const avenir  = scheduled.filter(x => x.st === 'avenir');
  const total = scheduled.length;
  const done = passes.length;
  const pct = total ? Math.round(done / total * 100) : 0;

  const row = (x, opts) => {
    opts = opts || {};
    const vide = isMatiereVide(x.m);
    const cls = 'plan-row' + (opts.passe ? ' plan-row-passe' : '') + (opts.now ? ' plan-row-now' : '');
    const tag = opts.passe ? '<span class="plan-tag tag-passe">✅ Fait</span>'
              : opts.now   ? '<span class="plan-tag tag-now">🔴 Maintenant</span>'
              : (vide ? '<span class="plan-tag tag-vide">📭 à venir</span>' : '<span class="plan-tag tag-go">Réviser →</span>');
    return `
      <button class="${cls}" data-id="${x.m.id}" style="--accent:${x.m.couleur}">
        <span class="plan-creneau">${escapeHtml(x.p.creneau)}</span>
        <span class="plan-body">
          <span class="plan-name"><span class="plan-emoji">${x.m.icone}</span><span class="plan-name-txt">${escapeHtml(x.m.titre)}</span></span>
          <span class="plan-sub">${escapeHtml(x.m.sousTitre)}</span>
        </span>
        ${tag}
      </button>`;
  };

  // « À passer » groupé par jour, dans l'ordre chronologique.
  let aVenirHTML = '';
  let lastJour = null;
  avenir.forEach(x => {
    if (x.p.jour !== lastJour) {
      aVenirHTML += `<div class="plan-day">${escapeHtml(x.p.jour)}</div>`;
      lastJour = x.p.jour;
    }
    aVenirHTML += row(x);
  });

  const encoursHTML = encours.map(x => row(x, { now: true })).join('');
  const passesHTML = passes.map(x => row(x, { passe: true })).join('');

  const clockWarn = (typeof horlogeImplausible === 'function' && horlogeImplausible(now))
    ? `<div class="plan-clockwarn">⚠️ L'heure de ton téléphone semble incorrecte (réglée avant juin 2026). Les statuts « déjà passé / à venir » risquent d'être faux — vérifie la date et l'heure de ton appareil.</div>`
    : '';

  $('planning-content').innerHTML = `
    ${clockWarn}
    <div class="plan-progress-card">
      <div class="plan-progress-top">
        <span>Avancement du rattrapage</span>
        <strong>${done} / ${total}</strong>
      </div>
      <div class="plan-bar"><div class="plan-bar-fill" style="width:${pct}%"></div></div>
      <div class="plan-progress-legend">${done} épreuve${done > 1 ? 's' : ''} passée${done > 1 ? 's' : ''} · ${total - done} restante${(total - done) > 1 ? 's' : ''}</div>
    </div>

    ${encours.length ? `<div class="plan-section plan-section-now">
      <h3 class="plan-section-title">🔴 En ce moment</h3>
      ${encoursHTML}
    </div>` : ''}

    <div class="plan-section">
      <h3 class="plan-section-title">⏳ À passer ${avenir.length ? `(${avenir.length})` : ''}</h3>
      ${avenir.length ? aVenirHTML : '<p class="plan-empty">🎉 Plus aucune épreuve à venir au programme. Bon courage pour la suite !</p>'}
    </div>

    ${passes.length ? `<details class="plan-section plan-done">
      <summary class="plan-section-title" aria-label="Afficher ou masquer les matières déjà passées">✅ Déjà passées (${passes.length})</summary>
      <div class="plan-done-list">${passesHTML}</div>
    </details>` : ''}
  `;

  // Clic sur une ligne → ouvrir la matière pour réviser.
  $('planning-content').querySelectorAll('.plan-row').forEach(btn => {
    btn.addEventListener('click', () => {
      const m = all.find(x => x.id === btn.dataset.id);
      if (m) renderMatiere(m);
    });
  });

  $('appTitle').textContent = 'Planning rattrapages';
  $('appSubtitle').textContent = '10 → 13 juin 2026';
  go('planning');
}

// ============ ÉCRAN MATIÈRE ============
function renderMatiere(m) {
  state.matiere = m;
  if (typeof logEvent === 'function') logEvent('matiere', m.id);
  document.documentElement.style.setProperty('--accent', m.couleur);
  $('appTitle').textContent = m.titre;
  $('appSubtitle').textContent = m.sousTitre;
  const examLabel = getExamLabel(m);
  const sousLigne = examLabel ? `${m.sousTitre} · 📅 ${escapeHtml(examLabel)}` : m.sousTitre;
  const nResume = (m.resume || []).length, nQcm = (m.qcm || []).length, nSujets = (m.questionsOuvertes || []).length;
  $('matiere-header').innerHTML = `
    <div class="big-icon">${m.icone}</div>
    <h2>${m.titre}</h2>
    <p>${sousLigne}</p>
    ${isMatiereVide(m) ? '<p class="matiere-vide-note">📭 Cours pas encore intégré. Tu peux déjà ajouter ou 📷 scanner des épreuves — elles seront partagées après validation du délégué.</p>' : ''}
  `;
  $('matiere-header').style.setProperty('--accent', m.couleur);

  // Descriptions des modes (gèrent le cas vide)
  $('quiz-count').textContent = nQcm ? `${nQcm} questions à choix multiples` : 'Pas encore de QCM';
  const dResume = document.querySelector('.mode-card[data-mode="resume"] .mode-desc');
  if (dResume) dResume.textContent = nResume ? 'Les notions clés en un coup d\'œil' : 'Pas encore de résumé';
  const dSujets = document.querySelector('.mode-card[data-mode="sujets"] .mode-desc');
  if (dSujets) dSujets.textContent = nSujets ? 'Questions type examen' : 'Pas encore de sujets';

  // Griser visuellement les modes vides (sauf Épreuves, toujours actif)
  document.querySelector('.mode-card[data-mode="resume"]').classList.toggle('mode-disabled', !nResume);
  document.querySelector('.mode-card[data-mode="quiz"]').classList.toggle('mode-disabled', !nQcm);
  document.querySelector('.mode-card[data-mode="sujets"]').classList.toggle('mode-disabled', !nSujets);

  const epStat = (typeof EPREUVES_DATA !== 'undefined' && EPREUVES_DATA[m.id]) || [];
  const epUser = getUserEpreuves(m.id);
  const epCloud = (typeof getCloudApproved === 'function') ? getCloudApproved(m.id) : [];
  const ep = [...epStat, ...epCloud, ...epUser];
  const totalQuestions = ep.reduce((acc, e) => acc + (e.questions || []).length, 0);
  $('epreuves-count').textContent = ep.length
    ? `${ep.length} épreuves · ${totalQuestions} questions${epCloud.length ? ' · ' + epCloud.length + ' ✅' : ''}${epUser.length ? ' · ' + epUser.length + ' 📝' : ''}`
    : 'Aucune épreuve — ➕ ajoute ou 📷 scanne !';

  const best = getBestScore(m.id);
  $('best-score').innerHTML = best ? `🏆 Meilleur score : <strong>${best.score}/${best.total}</strong>` : '';

  document.querySelectorAll('.mode-card').forEach(c => {
    c.onclick = () => {
      const mode = c.dataset.mode;
      if (mode === 'resume') {
        if (!nResume) return toastVide('résumé');
        renderResume(m);
      } else if (mode === 'quiz') {
        if (!nQcm) return toastVide('quiz');
        startQuiz(m);
      } else if (mode === 'sujets') {
        if (!nSujets) return toastVide('sujets ouverts');
        renderSujets(m);
      } else if (mode === 'epreuves') renderEpreuves(m);
    };
  });
  go('matiere');
}

function toastVide(quoi) {
  alert(`📭 Le ${quoi} de cette matière n'est pas encore disponible.\n\nLe programme officiel des rattrapages n'est pas encore sorti. En attendant, tu peux déjà ajouter ou scanner des épreuves dans « 📋 Épreuves corrigées ».`);
}

// ============ ÉPREUVES PERSO (localStorage) ============
function getUserEpreuvesAll() {
  try { return JSON.parse(localStorage.getItem(STORAGE_USER_EPREUVES) || '{}'); }
  catch { return {}; }
}
function getUserEpreuves(matiereId) {
  return getUserEpreuvesAll()[matiereId] || [];
}
function saveUserEpreuves(matiereId, list) {
  const all = getUserEpreuvesAll();
  all[matiereId] = list;
  try { localStorage.setItem(STORAGE_USER_EPREUVES, JSON.stringify(all)); return true; }
  catch { return false; }
}
function deleteUserEpreuve(matiereId, idx) {
  const list = getUserEpreuves(matiereId);
  list.splice(idx, 1);
  saveUserEpreuves(matiereId, list);
}
function normalizeTitle(t) {
  return String(t || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')   // enlève les accents
    .replace(/[^\w\s]/g, ' ')                            // ponctuation → espace
    .replace(/\s+/g, ' ').trim();
}
function isDuplicateEpreuve(matiereId, titre) {
  const norm = normalizeTitle(titre);
  if (!norm) return false;
  const all = [
    ...((typeof EPREUVES_DATA !== 'undefined' && EPREUVES_DATA[matiereId]) || []),
    ...getUserEpreuves(matiereId)
  ];
  return all.some(e => normalizeTitle(e.titre) === norm);
}

// ============ ÉPREUVES CORRIGÉES ============
function renderEpreuves(m, skipCloudRefresh) {
  const epStatiques = (typeof EPREUVES_DATA !== 'undefined' && EPREUVES_DATA[m.id]) || [];
  const epUser = getUserEpreuves(m.id);
  const epCloud = (typeof getCloudApproved === 'function') ? getCloudApproved(m.id) : [];

  // Une épreuve perso déjà publiée en ligne (même titre normalisé) n'est plus affichée en double.
  const cloudTitles = new Set(epCloud.map(e => normalizeTitle(e.titre)));
  const submittedHas = (typeof isSubmitted === 'function') ? isSubmitted : () => false;

  const all = [
    ...epStatiques.map((e, i) => ({...e, _kind: 'static', _idx: i})),
    ...epCloud.map((e, i) => ({...e, _kind: 'cloud', _idx: i})),
    ...epUser
      .map((e, i) => ({...e, _kind: 'user', _idx: i}))
      .filter(e => !cloudTitles.has(normalizeTitle(e.titre)))
  ];

  $('epreuves-titre').textContent = `📋 ${m.titre} — Épreuves corrigées`;
  if (!all.length) {
    $('epreuves-list').innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:30px;">Aucune épreuve disponible. Clique sur ➕ pour en ajouter une, ou 📷 pour en scanner une !</p>';
  } else {
    $('epreuves-list').innerHTML = all.map((e, i) => {
      let badge = '';
      if (e._kind === 'cloud') badge = '<span class="ep-badge ep-badge-cloud">✅ Communauté</span>';
      else if (e._kind === 'user') badge = submittedHas(e.titre)
        ? '<span class="ep-badge ep-badge-pending">⏳ En attente</span>'
        : '<span class="ep-badge">📝 Perso</span>';

      let actions = '';
      if (e._kind === 'user') {
        const canSubmit = (typeof cloudConfigured === 'function' && cloudConfigured() && !submittedHas(e.titre));
        actions = `<div class="ep-actions">
          ${canSubmit ? `<span class="ep-submit-btn" data-sub="${e._idx}">🌐 Soumettre en ligne</span>` : ''}
          <span class="ep-delete-btn" data-del="${e._idx}">🗑️ Supprimer</span>
        </div>`;
      }

      return `
      <button class="epreuve-card" data-kind="${e._kind}" data-idx="${e._idx}">
        <div class="ep-num">Épreuve ${i + 1}${badge}</div>
        <div class="ep-titre">${escapeHtml(e.titre)}</div>
        <div class="ep-source">${escapeHtml(e.source || '')}</div>
        <div class="ep-meta">${(e.questions || []).length} questions corrigées →</div>
        ${actions}
      </button>`;
    }).join('');

    document.querySelectorAll('.epreuve-card').forEach(btn => {
      btn.onclick = (ev) => {
        if (ev.target.classList.contains('ep-delete-btn')) {
          const idx = parseInt(ev.target.dataset.del, 10);
          if (confirm('Supprimer cette épreuve personnelle ?')) { deleteUserEpreuve(m.id, idx); renderEpreuves(m); }
          return;
        }
        if (ev.target.classList.contains('ep-submit-btn')) {
          const idx = parseInt(ev.target.dataset.sub, 10);
          submitEpreuveToCloud(m, getUserEpreuves(m.id)[idx]);
          return;
        }
        const idx = parseInt(btn.dataset.idx, 10);
        let epreuve;
        if (btn.dataset.kind === 'user') epreuve = epUser[idx];
        else if (btn.dataset.kind === 'cloud') epreuve = epCloud[idx];
        else epreuve = epStatiques[idx];
        renderEpreuveDetail(m, epreuve);
      };
    });
  }

  $('btn-add-epreuve').onclick = () => renderAddEpreuve(m);
  $('btn-export-epreuves').onclick = () => exportUserEpreuves(m);
  $('btn-import-epreuves').onclick = () => $('file-import').click();
  $('file-import').onchange = (e) => importUserEpreuves(e, m);
  const _sb = $('btn-scan-epreuve'); if (_sb) _sb.onclick = () => renderScanEpreuve(m);

  go('epreuves');

  // Rafraîchit en arrière-plan les épreuves validées du cloud (une seule fois), puis re-render.
  if (!skipCloudRefresh && typeof cloudFetchApproved === 'function' && cloudConfigured()) {
    cloudFetchApproved().then(() => {
      if (state.currentScreen === 'epreuves' && state.matiere && state.matiere.id === m.id) {
        renderEpreuves(m, true);
      }
    }).catch(() => {});
  }
}

// ============ FORMULAIRE AJOUT D'ÉPREUVE ============
let addFormState = { matiere: null, questions: [{enonce: '', correction: '', bareme: ''}] };

function renderAddEpreuve(m) {
  addFormState = { matiere: m, questions: [{enonce: '', correction: '', bareme: ''}] };
  $('add-titre').textContent = `➕ Nouvelle épreuve — ${m.titre}`;
  $('ep-titre').value = '';
  $('ep-source').value = '';
  $('form-error').hidden = true;
  $('form-error').className = 'form-error';
  renderQuestionsForm();

  $('btn-add-question').onclick = () => {
    addFormState.questions.push({enonce: '', correction: '', bareme: ''});
    renderQuestionsForm();
  };
  $('btn-save-epreuve').onclick = () => saveNewEpreuve(m);
  $('btn-cancel-epreuve').onclick = () => {
    if (confirm('Annuler la création de cette épreuve ?')) renderEpreuves(m);
  };
  go('add-epreuve');
}

function renderQuestionsForm() {
  // Sauvegarde temporaire de ce que l'utilisateur a déjà tapé
  const cards = document.querySelectorAll('.question-form-card');
  cards.forEach((card, i) => {
    if (addFormState.questions[i]) {
      addFormState.questions[i].enonce = card.querySelector('[data-field="enonce"]').value;
      addFormState.questions[i].correction = card.querySelector('[data-field="correction"]').value;
      addFormState.questions[i].bareme = card.querySelector('[data-field="bareme"]').value;
    }
  });

  $('questions-list').innerHTML = addFormState.questions.map((q, i) => `
    <div class="question-form-card" data-q="${i}">
      <div class="q-form-header">
        <span class="q-form-num">Question ${i + 1}</span>
        ${addFormState.questions.length > 1 ? `<button type="button" class="q-form-remove" data-remove="${i}">🗑️</button>` : ''}
      </div>
      <div class="form-group">
        <label>Énoncé <span class="required">*</span></label>
        <textarea data-field="enonce" placeholder="Texte de la question...">${escapeHtml(q.enonce)}</textarea>
      </div>
      <div class="form-group">
        <label>Correction <span class="required">*</span></label>
        <textarea data-field="correction" rows="5" placeholder="Réponse complète, raisonnement, code...">${escapeHtml(q.correction)}</textarea>
      </div>
      <div class="form-group">
        <label>Barème (optionnel)</label>
        <input type="text" data-field="bareme" value="${escapeHtml(q.bareme)}" placeholder="ex: 3 pts" maxlength="40">
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.q-form-remove').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.remove, 10);
      addFormState.questions.splice(idx, 1);
      renderQuestionsForm();
    };
  });
}

function saveNewEpreuve(m) {
  // Sync DOM → state
  document.querySelectorAll('.question-form-card').forEach((card, i) => {
    addFormState.questions[i].enonce = card.querySelector('[data-field="enonce"]').value;
    addFormState.questions[i].correction = card.querySelector('[data-field="correction"]').value;
    addFormState.questions[i].bareme = card.querySelector('[data-field="bareme"]').value;
  });

  const titre = $('ep-titre').value.trim();
  const source = $('ep-source').value.trim();
  const questions = addFormState.questions
    .map(q => ({
      enonce: q.enonce.trim(),
      correction: q.correction.trim(),
      bareme: q.bareme.trim()
    }))
    .filter(q => q.enonce && q.correction);

  const err = $('form-error');
  err.className = 'form-error';

  if (!titre) {
    err.textContent = '⚠️ Le titre de l\'épreuve est obligatoire.';
    err.hidden = false;
    window.scrollTo({top: 0, behavior: 'smooth'});
    return;
  }
  if (!questions.length) {
    err.textContent = '⚠️ Ajoute au moins une question complète (énoncé + correction).';
    err.hidden = false;
    return;
  }
  if (isDuplicateEpreuve(m.id, titre)) {
    err.textContent = `❌ Une épreuve avec ce titre existe déjà dans la base "${m.titre}". Choisis un autre titre.`;
    err.hidden = false;
    window.scrollTo({top: 0, behavior: 'smooth'});
    return;
  }

  // Sauvegarder
  const nouvelle = {
    titre,
    source: source || `Épreuve personnelle · ${new Date().toLocaleDateString('fr-FR')}`,
    questions: questions.map((q, i) => ({
      numero: String(i + 1),
      enonce: q.enonce,
      correction: q.correction,
      bareme: q.bareme || ''
    }))
  };
  const list = getUserEpreuves(m.id);
  list.push(nouvelle);
  if (!saveUserEpreuves(m.id, list)) {
    err.textContent = '⚠️ Impossible d\'enregistrer (espace de stockage plein ?). Essaie d\'exporter puis de supprimer d\'anciennes épreuves.';
    err.hidden = false;
    return;
  }
  // Succès → retour à la liste
  renderEpreuves(m);
}

// ============ EXPORT / IMPORT JSON ============
function exportUserEpreuves(m) {
  const list = getUserEpreuves(m.id);
  if (!list.length) {
    alert('Tu n\'as encore aucune épreuve personnelle à exporter pour cette matière.');
    return;
  }
  const data = {
    app: 'revisions-gl3a',
    version: 1,
    matiere: m.id,
    matiere_titre: m.titre,
    exported_at: new Date().toISOString(),
    epreuves: list
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `epreuves_${m.id}_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importUserEpreuves(event, m) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.app !== 'revisions-gl3a' || !Array.isArray(data.epreuves)) {
        alert('❌ Fichier invalide. Ce n\'est pas un export de cette application.');
        return;
      }
      if (data.matiere !== m.id) {
        if (!confirm(`Ce fichier contient des épreuves pour "${data.matiere_titre || data.matiere}". Tu es sur "${m.titre}". Importer quand même ?`)) {
          event.target.value = '';
          return;
        }
      }
      const list = getUserEpreuves(m.id);
      let added = 0, dups = 0;
      for (const ep of data.epreuves) {
        if (!ep.titre || !Array.isArray(ep.questions)) continue;
        if (isDuplicateEpreuve(m.id, ep.titre) || list.some(x => normalizeTitle(x.titre) === normalizeTitle(ep.titre))) {
          dups++;
          continue;
        }
        list.push(ep);
        added++;
      }
      saveUserEpreuves(m.id, list);
      alert(`✅ Import terminé !\n\n• ${added} épreuve(s) ajoutée(s)\n• ${dups} doublon(s) ignoré(s)`);
      renderEpreuves(m);
    } catch (err) {
      alert('❌ Fichier illisible : ' + err.message);
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}

function renderEpreuveDetail(m, e) {
  $('epreuve-detail-header').innerHTML = `
    <h2>${escapeHtml(e.titre)}</h2>
    <div class="src">${escapeHtml(e.source || '')}</div>
  `;
  $('epreuve-detail-content').innerHTML = e.questions.map((q, i) => `
    <div class="question-card" data-idx="${i}">
      <span class="q-num">Question ${escapeHtml(String(q.numero || (i + 1)))}</span>
      ${q.bareme ? `<span class="q-bareme">${escapeHtml(q.bareme)}</span>` : ''}
      <div class="q-enonce">${escapeHtml(q.enonce)}</div>
      <button class="reveal-btn">📥 Voir la correction</button>
      <div class="correction" hidden>
        <span class="correction-label">✅ Correction</span>
        ${escapeHtml(q.correction)}
      </div>
    </div>
  `).join('');
  document.querySelectorAll('#epreuve-detail-content .reveal-btn').forEach(btn => {
    btn.onclick = () => toggleCorrection(btn);
  });
  go('epreuve-detail');
}

function toggleCorrection(btn) {
  const card = btn.parentElement;
  const corr = card.querySelector('.correction');
  if (corr.hidden) {
    corr.hidden = false;
    btn.textContent = '🔼 Masquer la correction';
  } else {
    corr.hidden = true;
    btn.textContent = '📥 Voir la correction';
  }
}

$('btn-reveal-all').addEventListener('click', () => {
  document.querySelectorAll('#epreuve-detail-content .question-card').forEach(card => {
    card.querySelector('.correction').hidden = false;
    card.querySelector('.reveal-btn').textContent = '🔼 Masquer la correction';
  });
});
$('btn-hide-all').addEventListener('click', () => {
  document.querySelectorAll('#epreuve-detail-content .question-card').forEach(card => {
    card.querySelector('.correction').hidden = true;
    card.querySelector('.reveal-btn').textContent = '📥 Voir la correction';
  });
});

// ============ RÉSUMÉ ============
function renderResume(m) {
  $('resume-titre').textContent = `📖 ${m.titre} — Notions clés`;
  $('resume-content').innerHTML = m.resume.map(r => `
    <div class="resume-item">
      <h3>${escapeHtml(r.titre)}</h3>
      <p>${formatInline(r.contenu)}</p>
    </div>
  `).join('');
  go('resume');
}

// ============ QUIZ ============
function startQuiz(m) {
  state.quiz = {
    questions: shuffle(m.qcm.slice()),
    index: 0,
    score: 0,
    answered: false,
    erreurs: []
  };
  renderQuizQuestion();
  go('quiz');
}

function renderQuizQuestion() {
  const q = state.quiz.questions[state.quiz.index];
  const total = state.quiz.questions.length;
  $('quiz-progress').textContent = `Question ${state.quiz.index + 1} / ${total}`;
  $('quiz-score').textContent = `Score : ${state.quiz.score}`;
  $('progress-fill').style.width = `${((state.quiz.index) / total) * 100}%`;

  $('quiz-question').textContent = q.q;
  $('quiz-options').innerHTML = q.options.map((opt, i) => `
    <button class="quiz-option" data-letter="${String.fromCharCode(65 + i)}">${escapeHtml(opt)}</button>
  `).join('');
  $('quiz-explication').hidden = true;
  $('btn-next').hidden = true;
  state.quiz.answered = false;

  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.onclick = () => handleAnswer(btn.dataset.letter, btn);
  });
}

function handleAnswer(letter, clickedBtn) {
  if (state.quiz.answered) return;
  state.quiz.answered = true;
  const q = state.quiz.questions[state.quiz.index];
  const correct = q.reponse;
  const isCorrect = letter === correct;

  document.querySelectorAll('.quiz-option').forEach(b => {
    b.disabled = true;
    if (b.dataset.letter === correct) b.classList.add('correct');
    else if (b === clickedBtn) b.classList.add('wrong');
  });

  if (isCorrect) {
    state.quiz.score++;
  } else {
    state.quiz.erreurs.push({...q, tonChoix: letter});
  }

  $('quiz-score').textContent = `Score : ${state.quiz.score}`;
  $('quiz-explication').innerHTML = `<strong>${isCorrect ? '✅ Bonne réponse' : '❌ Mauvaise réponse'}</strong> — ${formatInline(q.explication)}`;
  $('quiz-explication').hidden = false;
  $('btn-next').hidden = false;
  $('btn-next').textContent = (state.quiz.index === state.quiz.questions.length - 1) ? 'Voir le résultat 🏁' : 'Suivant →';
}

$('btn-next').addEventListener('click', () => {
  state.quiz.index++;
  if (state.quiz.index >= state.quiz.questions.length) {
    showResult();
  } else {
    renderQuizQuestion();
  }
});

// ============ RÉSULTAT QUIZ ============
function showResult() {
  const total = state.quiz.questions.length;
  const score = state.quiz.score;
  const pct = Math.round((score / total) * 100);

  let emoji, title, msg;
  if (pct >= 85) { emoji = '🏆'; title = 'Excellent !'; msg = 'Tu maîtrises bien cette matière. Continue.'; }
  else if (pct >= 65) { emoji = '👏'; title = 'Bien joué !'; msg = 'Bon niveau. Révise les erreurs pour briller demain.'; }
  else if (pct >= 50) { emoji = '🙂'; title = 'Pas mal !'; msg = 'Tu es sur la bonne voie. Une dernière passe sur les notions ?'; }
  else { emoji = '🔄'; title = 'À retravailler'; msg = 'Pas de panique. Relis le résumé puis recommence le quiz.'; }

  $('result-emoji').textContent = emoji;
  $('result-title').textContent = title;
  $('result-score').textContent = `${score} / ${total}  (${pct}%)`;
  $('result-message').textContent = msg;

  saveBestScore(state.matiere.id, score, total);
  if (typeof logEvent === 'function') logEvent('quiz_done', state.matiere.id);
  $('btn-review').hidden = state.quiz.erreurs.length === 0;
  go('result');
}

$('btn-retry').addEventListener('click', () => {
  startQuiz(state.matiere);
});
$('btn-review').addEventListener('click', () => {
  renderReview();
});
$('btn-home-from-result').addEventListener('click', () => {
  renderHome();
});

// ============ REVIEW (ERREURS) ============
function renderReview() {
  const erreurs = state.quiz.erreurs;
  if (!erreurs.length) {
    $('review-content').innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:30px;">🎉 Aucune erreur ! Bravo.</p>';
  } else {
    $('review-content').innerHTML = erreurs.map(e => {
      const tonChoixTxt = e.options.find(o => o.startsWith(e.tonChoix + ')')) || e.tonChoix;
      const bonneTxt = e.options.find(o => o.startsWith(e.reponse + ')')) || e.reponse;
      return `
        <div class="review-item">
          <div class="q">${escapeHtml(e.q)}</div>
          <div class="ta">❌ Ton choix : ${escapeHtml(tonChoixTxt)}</div>
          <div class="ok">✅ Bonne réponse : ${escapeHtml(bonneTxt)}</div>
          <div class="exp">${formatInline(e.explication)}</div>
        </div>
      `;
    }).join('');
  }
  go('review');
}

// ============ SUJETS OUVERTS ============
function renderSujets(m) {
  $('sujets-titre').textContent = `📝 ${m.titre} — Sujets type examen`;
  $('sujets-content').innerHTML = m.questionsOuvertes.map((s, i) => `
    <div class="sujet-item">
      <div class="num">Sujet ${i + 1}</div>
      <div class="q">${escapeHtml(s.q)}</div>
      <button class="reveal-btn" data-idx="${i}">📥 Voir la réponse attendue</button>
      <div class="reponse" id="rep-${i}" hidden></div>
    </div>
  `).join('');
  document.querySelectorAll('.reveal-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = btn.dataset.idx;
      const rep = $(`rep-${idx}`);
      const isHidden = rep.hidden;
      if (isHidden) {
        rep.textContent = m.questionsOuvertes[idx].reponseAttendue;
        rep.hidden = false;
        btn.textContent = '🔼 Masquer la réponse';
      } else {
        rep.hidden = true;
        btn.textContent = '📥 Voir la réponse attendue';
      }
    };
  });
  go('sujets');
}

// ============ HELPERS ============
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Format inline: échappe puis transforme `code` en <code>
function formatInline(str) {
  const escaped = escapeHtml(str);
  return escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
}

function getBestScore(matiereId) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_BEST) || '{}');
    return all[matiereId] || null;
  } catch { return null; }
}

function saveBestScore(matiereId, score, total) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_BEST) || '{}');
    const prev = all[matiereId];
    if (!prev || score > prev.score) {
      all[matiereId] = {score, total, date: Date.now()};
      localStorage.setItem(STORAGE_BEST, JSON.stringify(all));
    }
  } catch {}
}

// ============ THÈME ============
function initTheme() {
  const saved = localStorage.getItem(STORAGE_THEME);
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    $('btnTheme').textContent = '☀️';
  }
}
$('btnTheme').addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  if (cur === 'light') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem(STORAGE_THEME, 'dark');
    $('btnTheme').textContent = '🌙';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem(STORAGE_THEME, 'light');
    $('btnTheme').textContent = '☀️';
  }
});

$('btnBack').addEventListener('click', goBack);

// ============ MODALE BIENVENUE ============
function showWelcomeIfFirstVisit() {
  try {
    if (localStorage.getItem(STORAGE_WELCOME) === '1') return;
  } catch {}
  const modal = $('welcome-modal');
  if (!modal) return;
  modal.hidden = false;
  $('welcome-close').addEventListener('click', () => {
    modal.hidden = true;
    try { localStorage.setItem(STORAGE_WELCOME, '1'); } catch {}
  });
  // Fermer aussi en cliquant à l'extérieur de la carte
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.hidden = true;
      try { localStorage.setItem(STORAGE_WELCOME, '1'); } catch {}
    }
  });
}

// ============ INIT ============
initTheme();
// Lire la route sauvegardée AVANT que renderHome n'écrase le sessionStorage
let _savedRoute = null;
try { _savedRoute = JSON.parse(sessionStorage.getItem('gl3a_route') || 'null'); } catch {}
// L'accueil est la base de l'historique
try { history.replaceState({ screen: 'home', m: null }, ''); } catch {}
renderHome();
// Restaure l'écran où l'utilisateur était avant un rafraîchissement
if (_savedRoute && _savedRoute.screen && _savedRoute.screen !== 'home') {
  dispatchRoute(_savedRoute);   // empile une entrée → le retour ramène à l'accueil
}
showWelcomeIfFirstVisit();
// Compteur de visiteurs (Supabase) — au plus une visite/appareil/jour
if (typeof cloudTrackVisit === 'function') cloudTrackVisit();

// ============ MISE À JOUR AUTO DES STATUTS D'ÉPREUVE ============
// Pendant que l'utilisateur reste sur l'accueil ou le planning, les badges
// (passé / en cours / à venir) doivent évoluer avec l'heure sans rechargement.
// On ne re-render QUE si un statut a réellement changé (évite de perturber
// l'accordéon ou le repli des « déjà passées » à chaque tick).
function _statusSignature() {
  if (typeof getAllMatieres !== 'function' || typeof programmeStatus !== 'function') return '';
  const now = new Date();
  return getAllMatieres().map(m => programmeStatus(m.id, now) || '-').join('');
}
let _lastStatusSig = _statusSignature();
setInterval(() => {
  const sig = _statusSignature();
  if (sig === _lastStatusSig) return;
  _lastStatusSig = sig;
  if (state.currentScreen === 'home') renderHome(true);
  else if (state.currentScreen === 'planning') renderPlanning();
}, 30000);
