// Application Révisions GL3A - Logique
'use strict';

const $ = (id) => document.getElementById(id);
const STORAGE_BEST = 'gl3a_best_scores';
const STORAGE_THEME = 'gl3a_theme';

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

// ============ NAVIGATION ============
function go(screenId, addToHistory = true) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = $(`screen-${screenId}`);
  if (!target) return;
  target.classList.add('active');
  window.scrollTo({top: 0, behavior: 'instant'});

  if (addToHistory && state.currentScreen !== screenId) {
    state.history.push(state.currentScreen);
  }
  state.currentScreen = screenId;
  $('btnBack').hidden = (screenId === 'home');
}

function goBack() {
  const prev = state.history.pop();
  if (!prev) {
    go('home', false);
    return;
  }
  // Re-render selon écran cible
  if (prev === 'matiere' && state.matiere) renderMatiere(state.matiere);
  else go(prev, false);
}

// ============ ACCUEIL ============
function renderHome() {
  const list = $('matieres-list');
  list.innerHTML = MATIERES.map(m => `
    <button class="matiere-card" data-id="${m.id}" style="--accent: ${m.couleur}">
      <span class="icon">${m.icone}</span>
      <span class="info">
        <h3>${m.titre}</h3>
        <p>${m.sousTitre}</p>
        <span class="time">⏰ ${m.horaire}</span>
      </span>
      <span class="arrow">›</span>
    </button>
  `).join('');
  list.querySelectorAll('.matiere-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const m = MATIERES.find(x => x.id === btn.dataset.id);
      renderMatiere(m);
    });
  });
  $('appTitle').textContent = 'Révisions GL3A';
  $('appSubtitle').textContent = 'Examen — 26 mai 2026';
  go('home', false);
  state.history = [];
}

// ============ ÉCRAN MATIÈRE ============
function renderMatiere(m) {
  state.matiere = m;
  document.documentElement.style.setProperty('--accent', m.couleur);
  $('appTitle').textContent = m.titre;
  $('appSubtitle').textContent = m.sousTitre;
  $('matiere-header').innerHTML = `
    <div class="big-icon">${m.icone}</div>
    <h2>${m.titre}</h2>
    <p>${m.sousTitre} · ${m.horaire}</p>
  `;
  $('matiere-header').style.setProperty('--accent', m.couleur);
  $('quiz-count').textContent = `${m.qcm.length} questions à choix multiples`;

  const ep = (typeof EPREUVES_DATA !== 'undefined' && EPREUVES_DATA[m.id]) || [];
  const totalQuestions = ep.reduce((acc, e) => acc + e.questions.length, 0);
  $('epreuves-count').textContent = ep.length
    ? `${ep.length} épreuves · ${totalQuestions} questions corrigées`
    : 'Aucune épreuve disponible';

  const best = getBestScore(m.id);
  $('best-score').innerHTML = best ? `🏆 Meilleur score : <strong>${best.score}/${best.total}</strong>` : '';

  document.querySelectorAll('.mode-card').forEach(c => {
    c.onclick = () => {
      const mode = c.dataset.mode;
      if (mode === 'resume') renderResume(m);
      else if (mode === 'quiz') startQuiz(m);
      else if (mode === 'sujets') renderSujets(m);
      else if (mode === 'epreuves') renderEpreuves(m);
    };
  });
  go('matiere');
}

// ============ ÉPREUVES CORRIGÉES ============
function renderEpreuves(m) {
  const ep = (typeof EPREUVES_DATA !== 'undefined' && EPREUVES_DATA[m.id]) || [];
  $('epreuves-titre').textContent = `📋 ${m.titre} — Épreuves corrigées`;
  if (!ep.length) {
    $('epreuves-list').innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:30px;">Aucune épreuve disponible pour cette matière.</p>';
  } else {
    $('epreuves-list').innerHTML = ep.map((e, i) => `
      <button class="epreuve-card" data-idx="${i}">
        <div class="ep-num">Épreuve ${i + 1}</div>
        <div class="ep-titre">${escapeHtml(e.titre)}</div>
        <div class="ep-source">${escapeHtml(e.source || '')}</div>
        <div class="ep-meta">${e.questions.length} questions corrigées →</div>
      </button>
    `).join('');
    document.querySelectorAll('.epreuve-card').forEach(btn => {
      btn.onclick = () => renderEpreuveDetail(m, ep[btn.dataset.idx]);
    });
  }
  go('epreuves');
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

// ============ INIT ============
initTheme();
renderHome();
