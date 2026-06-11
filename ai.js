/* =========================================================================
   ai.js — Correction d'une épreuve scannée par l'IA (Claude via Edge Function)
   -------------------------------------------------------------------------
   Flux : OCR (ocr.js) → texte brut → aiCorrectExam() → épreuve corrigée + quiz
   → aperçu → enregistrement local (visible tout de suite) + envoi cloud (pending,
   partagé après validation du délégué).

   Dépend de :
     - SUPABASE_URL, SUPABASE_ANON_KEY (cloud-config.js)
     - cloudConfigured, cloudSubmitEpreuve (cloud.js)
     - getUserEpreuves, saveUserEpreuves, normalizeTitle, MATIERES…,
       renderEpreuves, renderEpreuveDetail, escapeHtml, $ (app.js)
     - _ocrLastText, _ocrChosenMatiereId, MATIERE_LABEL, findMatiereById (ocr.js)
   ========================================================================= */

function aiEndpoint() {
  if (typeof SUPABASE_URL === 'undefined' || !SUPABASE_URL) return null;
  return SUPABASE_URL.replace(/\/+$/, '') + '/functions/v1/correct-exam';
}

function aiAvailable() {
  return !!aiEndpoint() && typeof SUPABASE_ANON_KEY !== 'undefined' && !!SUPABASE_ANON_KEY;
}

// Appelle l'Edge Function. Renvoie { titre, source, questions[], quiz[] }.
async function aiCorrectExam(ocrText, matiereLabel) {
  const url = aiEndpoint();
  if (!url) throw new Error('Service IA non configuré.');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ ocrText, matiereLabel: matiereLabel || '' }),
  });

  let data;
  try { data = await res.json(); } catch { throw new Error('Réponse IA illisible.'); }
  if (!res.ok || data.error) {
    throw new Error(data && data.error ? data.error : 'Échec de la correction IA (HTTP ' + res.status + ').');
  }
  if (!Array.isArray(data.questions) || !data.questions.length) {
    throw new Error('L\'IA n\'a extrait aucune question. Reprends une photo plus nette.');
  }
  data.quiz = Array.isArray(data.quiz) ? data.quiz : [];
  return data;
}

/* ----------------------- INTÉGRATION DANS LE SCAN ------------------------ */

let _aiLastResult = null;   // { matiereId, epreuve }

// Lance la correction IA depuis l'écran de résultat OCR.
async function runAICorrection(m) {
  const matiereId = _ocrChosenMatiereId || m.id;
  const label = (typeof MATIERE_LABEL !== 'undefined' && MATIERE_LABEL[matiereId]) || m.titre;
  const statusEl = $('scan-status');
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
    `<li><strong>Q${escapeHtml(q.numero || '')}.</strong> ${escapeHtml((q.enonce || '').slice(0, 160))}${(q.enonce || '').length > 160 ? '…' : ''}</li>`
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
      <button id="btn-ai-discard" class="btn-secondary">↩️ Annuler</button>
    </div>
    <details class="scan-raw"><summary>📄 Texte OCR brut</summary><pre>${escapeHtml(_ocrLastText)}</pre></details>
  `;
  $('scan-status').textContent = '✅ Correction prête. Vérifie puis ajoute.';
  $('btn-ai-save').onclick = () => saveAIEpreuve(m);
  $('btn-ai-discard').onclick = () => { _aiLastResult = null; renderEpreuves(m); };
}

// Enregistre : visible localement tout de suite + envoyé au cloud (pending).
async function saveAIEpreuve(m) {
  if (!_aiLastResult) return;
  const { matiereId, epreuve } = _aiLastResult;
  const btn = $('btn-ai-save');
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
    epreuve.questions.length + ' question(s) corrigée(s) et ' +
    epreuve.quiz.length + ' QCM ajoutés au quiz.' + cloudMsg);

  _aiLastResult = null;
  const targetM = (typeof findMatiereById === 'function' && findMatiereById(matiereId)) || m;
  renderEpreuves(targetM);
}
