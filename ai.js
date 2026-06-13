/* =========================================================================
   ai.js — IA de la GL3A (Gemini via Edge Function Supabase)
   -------------------------------------------------------------------------
   Deux usages :
   1) Scan IA : OCR (ocr.js) → texte brut → aiCorrectExam() → épreuve corrigée
      + QCM quiz → aperçu → enregistrement local + envoi cloud (pending).
   2) Quiz : aiExplainError() → « pourquoi j'ai faux ? » expliqué à l'étudiant.

   La clé Gemini reste un secret CÔTÉ SERVEUR (Edge Function gl3a-ia) ;
   le navigateur n'envoie que la clé anon Supabase. Quota : ~10 appels
   IA / appareil / jour (appliqué par la fonction).

   Dépend de :
     - SUPABASE_URL, SUPABASE_ANON_KEY (cloud-config.js)
     - cloudConfigured, cloudSubmitEpreuve, getVisitorId (cloud.js)
     - getUserEpreuves, saveUserEpreuves, normalizeTitle,
       renderEpreuves, escapeHtml, $ (app.js)
     - _ocrLastText, _ocrChosenMatiereId, MATIERE_LABEL, findMatiereById (ocr.js)
   ========================================================================= */

function aiEndpoint() {
  if (typeof SUPABASE_URL === 'undefined' || !SUPABASE_URL) return null;
  return SUPABASE_URL.replace(/\/+$/, '') + '/functions/v1/gl3a-ia';
}

function aiAvailable() {
  return !!aiEndpoint() && typeof SUPABASE_ANON_KEY !== 'undefined' && !!SUPABASE_ANON_KEY;
}

// Appel générique de l'Edge Function IA.
async function aiCall(action, payload) {
  const url = aiEndpoint();
  if (!url) throw new Error('Service IA non configuré.');
  const visitorId = (typeof getVisitorId === 'function') ? getVisitorId() : '';

  // Timeout : jamais de bouton bloqué indéfiniment si le réseau pend.
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 60000);
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ action, visitorId, ...payload }),
      signal: ctrl.signal,
    });
  } catch (e) {
    throw new Error(e && e.name === 'AbortError'
      ? 'L\'IA met trop de temps à répondre — réessaie dans un instant.'
      : 'IA injoignable : vérifie ta connexion (ou le service n\'est pas encore activé par le délégué).');
  } finally {
    clearTimeout(timer);
  }

  let data;
  try { data = await res.json(); } catch { throw new Error('Réponse IA illisible.'); }
  if (!res.ok || data.error) {
    throw new Error(data && data.error ? data.error : 'Échec IA (HTTP ' + res.status + ').');
  }
  return data;
}

// OCR -> épreuve corrigée. Renvoie { titre, source, questions[], quiz[] }.
async function aiCorrectExam(ocrText, matiereLabel) {
  const data = await aiCall('correct_exam', { ocrText, matiereLabel: matiereLabel || '' });
  if (!Array.isArray(data.questions) || !data.questions.length) {
    throw new Error('L\'IA n\'a extrait aucune question. Reprends une photo plus nette.');
  }
  data.quiz = Array.isArray(data.quiz) ? data.quiz : [];
  return data;
}

// Prof IA (chat) -> réponse ancrée sur les fiches de cours de la matière.
// history : [{role:'user'|'ia', text}]. Renvoie { reponse, sources[] }.
async function aiProfChat(matiereId, matiereLabel, question, history) {
  const data = await aiCall('prof_chat', {
    matiereId, matiereLabel: matiereLabel || '', question, history: history || [],
  });
  return {
    reponse: (data.reponse || '').trim(),
    sources: Array.isArray(data.sources) ? data.sources : [],
  };
}

// Quiz -> explication personnalisée d'une erreur. Renvoie une string.
async function aiExplainError(p) {
  const data = await aiCall('explain_error', {
    question: p.question,
    options: p.options || [],
    reponse: p.reponse,
    choix: p.choix,
    matiereLabel: p.matiereLabel || '',
  });
  const txt = (data.explication || '').trim();
  if (!txt) throw new Error('Le Prof IA n\'a pas su expliquer cette question.');
  return txt;
}

/* ----------------------- INTÉGRATION DANS LE SCAN ------------------------ */

let _aiLastResult = null;   // { matiereId, epreuve }

// Lance la correction IA depuis l'écran de résultat OCR.
async function runAICorrection(m) {
  const matiereId = _ocrChosenMatiereId || m.id;
  const label = (typeof MATIERE_LABEL !== 'undefined' && MATIERE_LABEL[matiereId]) || m.titre;
  const statusEl = $('scan-status');
  if (!navigator.onLine) {
    if (statusEl) statusEl.textContent = '🔌 Hors-ligne : la correction IA nécessite une connexion. Tu peux remplir le formulaire à la main.';
    return;
  }
  const btn = $('btn-scan-ai');
  if (btn) { btn.disabled = true; btn.textContent = '🤖 Correction en cours… (10–30 s)'; }
  if (statusEl) statusEl.textContent = '🤖 L\'IA lit et corrige l\'épreuve…';

  try {
    const result = await aiCorrectExam(_ocrLastText, label);
    const epreuve = {
      titre: (result.titre || '').trim() || 'Épreuve scannée',
      source: (result.source || '').trim(),
      questions: result.questions || [],
      quiz: result.quiz || [],
      signature: normalizeTitle(result.titre || ''),
      _ai: true,
    };
    _aiLastResult = { matiereId, epreuve };
    renderAIPreview(m, matiereId, epreuve);
  } catch (e) {
    if (statusEl) statusEl.textContent = '❌ ' + (e.message || e);
    if (btn) { btn.disabled = false; btn.textContent = '🤖 Corriger automatiquement (IA)'; }
  }
}

// Aperçu avant enregistrement.
function renderAIPreview(m, matiereId, epreuve) {
  const matLabel = (typeof MATIERE_LABEL !== 'undefined' && MATIERE_LABEL[matiereId]) || matiereId;
  const qHtml = epreuve.questions.slice(0, 3).map(q =>
    `<li><strong>Q${escapeHtml(String(q.numero || ''))}.</strong> ${escapeHtml((q.enonce || '').slice(0, 160))}${(q.enonce || '').length > 160 ? '…' : ''}</li>`
  ).join('');
  const more = epreuve.questions.length > 3 ? `<li>… +${epreuve.questions.length - 3} autres</li>` : '';

  $('scan-result').hidden = false;
  $('scan-result').innerHTML = `
    <div class="scan-diag">
      <p><span class="scan-badge scan-badge-new">🤖 Corrigé par l'IA</span></p>
      <p>📚 Matière : <strong>${escapeHtml(matLabel)}</strong></p>
      <p class="scan-titre-prop">Titre : <strong>${escapeHtml(epreuve.titre)}</strong></p>
      <p>📝 <strong>${epreuve.questions.length}</strong> question(s) corrigée(s) · 🎯 <strong>${epreuve.quiz.length}</strong> QCM pour le quiz</p>
      <ul class="scan-ai-preview">${qHtml}${more}</ul>
    </div>
    <div class="scan-ai-actions">
      <button id="btn-ai-save" class="btn-primary">✅ Ajouter aux épreuves + quiz</button>
      <button id="btn-ai-edit" class="btn-secondary">✏️ Modifier / compléter</button>
      <button id="btn-ai-discard" class="btn-secondary">↩️ Annuler</button>
    </div>
    <details class="scan-raw"><summary>📄 Texte OCR brut</summary><pre>${escapeHtml(_ocrLastText)}</pre></details>
  `;
  $('scan-status').textContent = '✅ Correction prête. Vérifie, complète si besoin, puis ajoute.';
  $('btn-ai-save').onclick = () => saveAIEpreuve(m);
  $('btn-ai-edit').onclick = () => renderAIEditForm(m, matiereId, epreuve);
  $('btn-ai-discard').onclick = () => { _aiLastResult = null; renderEpreuves(m); };
}

// Ouvre le formulaire d'ajout PRÉ-REMPLI avec la correction de l'IA, pour
// que l'utilisateur complète ce qui manque (type, session, durée, niveau →
// champ Source) ou corrige une question, sans tout retaper. Les QCM extraits
// par l'IA sont préservés.
function renderAIEditForm(m, matiereId, epreuve) {
  const targetM = (typeof findMatiereById === 'function' && findMatiereById(matiereId)) || m;
  addFormState.matiere = targetM;
  addFormState.questions = (epreuve.questions && epreuve.questions.length ? epreuve.questions : [{}])
    .map(q => ({ enonce: q.enonce || '', correction: q.correction || '', bareme: q.bareme || '' }));

  $('add-titre').textContent = `✏️ Vérifier / compléter — ${targetM.titre}`;
  const intro = document.querySelector('#screen-add-epreuve .form-intro');
  if (intro) intro.innerHTML = '🤖 L\'IA a déjà rempli ce formulaire. <strong>Complète ce qui manque</strong> — mets le type, la session/année, la durée et le niveau dans le champ <strong>Source</strong> — puis enregistre. Tu n\'as rien à retaper.';
  $('ep-titre').value = epreuve.titre || '';
  $('ep-source').value = epreuve.source || '';
  $('form-error').hidden = true; $('form-error').className = 'form-error';
  const saveBtn = $('btn-save-epreuve'); saveBtn.disabled = false; saveBtn.textContent = "💾 Enregistrer l'épreuve";
  renderQuestionsForm();

  $('btn-add-question').onclick = () => {
    addFormState.questions.push({ enonce: '', correction: '', bareme: '' });
    renderQuestionsForm();
  };
  $('btn-cancel-epreuve').onclick = () => renderAIPreview(m, matiereId, epreuve);
  $('btn-save-epreuve').onclick = () => {
    document.querySelectorAll('.question-form-card').forEach((card, i) => {
      if (!addFormState.questions[i]) return;
      addFormState.questions[i].enonce = card.querySelector('[data-field="enonce"]').value;
      addFormState.questions[i].correction = card.querySelector('[data-field="correction"]').value;
      addFormState.questions[i].bareme = card.querySelector('[data-field="bareme"]').value;
    });
    const titre = $('ep-titre').value.trim();
    const source = $('ep-source').value.trim();
    const questions = addFormState.questions
      .map((q, i) => ({ numero: String(i + 1), enonce: (q.enonce || '').trim(), correction: (q.correction || '').trim(), bareme: (q.bareme || '').trim() }))
      .filter(q => q.enonce && q.correction);
    const err = $('form-error'); err.className = 'form-error';
    if (!titre) { err.textContent = '⚠️ Le titre est obligatoire.'; err.hidden = false; window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (!questions.length) { err.textContent = '⚠️ Garde au moins une question (énoncé + correction).'; err.hidden = false; return; }
    const edited = {
      titre, source, questions,
      quiz: Array.isArray(epreuve.quiz) ? epreuve.quiz : [],   // QCM IA préservés
      signature: (typeof normalizeTitle === 'function') ? normalizeTitle(titre) : titre,
      _ai: true,
    };
    _aiPersist(m, matiereId, edited, $('btn-save-epreuve'));
  };
  go('add-epreuve');
}

// Enregistre : visible localement tout de suite + envoyé au cloud (pending).
async function saveAIEpreuve(m) {
  if (!_aiLastResult) return;
  await _aiPersist(m, _aiLastResult.matiereId, _aiLastResult.epreuve, $('btn-ai-save'));
}

// Logique de persistance partagée par « ✅ Ajouter » (saveAIEpreuve) et par
// le formulaire d'édition (renderAIEditForm) : cache local immédiat + envoi
// cloud (pending), avec préservation des QCM (epreuve.quiz).
async function _aiPersist(m, matiereId, epreuve, btn) {
  if (btn) { btn.disabled = true; btn.textContent = '💾 Enregistrement…'; }

  // 1) Cache local → l'auteur voit l'épreuve et ses QCM immédiatement.
  try {
    const list = getUserEpreuves(matiereId);
    if (!list.some(e => normalizeTitle(e.titre) === normalizeTitle(epreuve.titre))) {
      list.push(epreuve);
      saveUserEpreuves(matiereId, list);
    }
  } catch {}

  // 2) Envoi cloud (pending) → partagé à tous après validation du délégué.
  let cloudMsg = '';
  if (typeof cloudConfigured === 'function' && cloudConfigured()) {
    try {
      await cloudSubmitEpreuve(matiereId, epreuve, '');
      cloudMsg = '\n📨 Envoyée pour validation : elle sera partagée à tous une fois approuvée.';
    } catch (e) {
      cloudMsg = '\n⚠️ Enregistrée chez toi, mais l\'envoi en ligne a échoué (' + (e.message || e) + ').';
    }
  }

  alert('✅ Épreuve ajoutée !\n\n' +
    (epreuve.questions || []).length + ' question(s) et ' +
    (epreuve.quiz || []).length + ' QCM ajoutés au quiz.' + cloudMsg);

  _aiLastResult = null;
  const targetM = (typeof findMatiereById === 'function' && findMatiereById(matiereId)) || m;
  renderEpreuves(targetM);
}
