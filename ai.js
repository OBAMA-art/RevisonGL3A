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
