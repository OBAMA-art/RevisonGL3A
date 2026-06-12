/* =========================================================================
   notes.js — 🎓 Mes notes & moyennes (bordereau LMD GL3A 2025-2026)
   -------------------------------------------------------------------------
   L'étudiant saisit ses notes de CC et de Session Normale (SN) par matière.
   L'app calcule : note matière (CC×40% + SN×60%), moyenne de chaque UE
   (pondérée par coefficients, compensation), verdict ✅ Validé / ❌ + conseils
   de révision, crédits débloqués, moyennes S5/S6, moyenne de classe et
   moyenne finale (classe×40% + projet de stage×60%).

   Confidentialité : tout reste en localStorage — AUCUNE note n'est envoyée
   au cloud. 100% hors-ligne.
   ========================================================================= */

const STORAGE_NOTES = 'gl3a_mes_notes';

/* Maquette officielle 2023-2024 (S5+S6). `mid` = id de la matière dans
   l'app (pour le bouton "Réviser"), null si pas de contenu de révision. */
const NOTES_STRUCTURE = [
  {
    sem: 'S5', label: 'Semestre 5', ues: [
      { id: 'app_bd', label: 'Application des bases de données', credits: 6, mats: [
        { k: 'sig',      nom: 'Système d\'information géographique',          coef: 3, mid: 'sig' },
        { k: 'bigdata',  nom: 'BIG DATA (NoSQL, …)',                          coef: 3, mid: 'bigdata' },
        { k: 'siad',     nom: 'Système d\'information d\'aide à la décision', coef: 3, mid: 'siad' },
      ]},
      { id: 'prog1', label: 'Programmation avancée 1', credits: 9, mats: [
        { k: 'j2e',      nom: 'Programmation J2E',                            coef: 4, mid: 'j2e' },
        { k: 'mobile',   nom: 'Programmation mobile',                         coef: 4, mid: 'mobile' },
        { k: 'python',   nom: 'Programmation Python avancée',                 coef: 4, mid: 'python' },
      ]},
      { id: 'admin_bd', label: 'Administration des BD et sécurité', credits: 6, mats: [
        { k: 'oracle',   nom: 'Administration des BD Oracle',                 coef: 5, mid: 'oracle' },
        { k: 'secubd',   nom: 'Sécurité des bases de données',                coef: 3, mid: 'secubd' },
        { k: 'sqlserver',nom: 'Administration des BD SQL-Server',             coef: 5, mid: 'sqlserver' },
      ]},
      { id: 'ia_ue', label: 'Éléments d\'intelligence artificielle', credits: 6, mats: [
        { k: 'ia',       nom: 'Introduction à l\'IA',                         coef: 3, mid: 'ia' },
        { k: 'data',     nom: 'Analyse des données',                          coef: 3, mid: 'data' },
      ]},
      { id: 'langues', label: 'Langues et communication', credits: 3, mats: [
        { k: 'english',  nom: 'Anglais expert',                               coef: 3, mid: 'english' },
        { k: 'techcom',  nom: 'Techniques de communication',                  coef: 2, mid: 'techcom' },
      ]},
    ],
  },
  {
    sem: 'S6', label: 'Semestre 6', ues: [
      { id: 'droit', label: 'Droit et Entreprenariat', credits: 2, mats: [
        { k: 'entreprenariat', nom: 'Entreprenariat et Création d\'entreprise', coef: 3, mid: 'entreprenariat' },
        { k: 'droittravail',   nom: 'Droit du travail',                         coef: 3, mid: 'droittravail' },
      ]},
      { id: 'prog2', label: 'Programmation avancée et Multimédia 2', credits: 9, mats: [
        { k: 'poo',        nom: 'POO avancée (Django, Flask, …)',             coef: 3, mid: 'poo' },
        { k: 'web',        nom: 'Outils de programmation Web',                coef: 4, mid: 'web' },
        { k: 'multimedia', nom: 'Techniques Multimédias et Infographie',      coef: 3, mid: 'multimedia' },
      ]},
      { id: 'sport_projet', label: 'Sport et Discipline / Projet', credits: 9, mats: [
        { k: 'sport',     nom: 'Éducation Physique (Sport)',                  coef: 2, mid: null },
        { k: 'conduite',  nom: 'Conduite / Discipline',                       coef: 2, mid: null },
        { k: 'seminaire', nom: 'Séminaire / Workshop',                        coef: 2, mid: null },
        { k: 'projetgl',  nom: 'Projet Génie Logiciel Personnalisé',          coef: 4, mid: null },
      ]},
    ],
  },
];

// Projet final d'études (stage) : hors UE, décisif pour la moyenne finale.
const NOTES_STAGE = { coef: 10, credits: 10 };

/* ------------------------------- Stockage -------------------------------- */
function notesLoad() {
  try { return JSON.parse(localStorage.getItem(STORAGE_NOTES) || '{}'); }
  catch { return {}; }
}
function notesSave(store) {
  try { localStorage.setItem(STORAGE_NOTES, JSON.stringify(store)); }
  catch { alert('⚠️ Stockage plein : la note n\'a pas pu être enregistrée.'); }
}

/* -------------------------------- Calculs -------------------------------- */
function noteFinaleMatiere(entry) {
  if (!entry) return null;
  const cc = entry.cc, sn = entry.sn;
  if (typeof cc !== 'number' || typeof sn !== 'number') return null;
  return cc * 0.4 + sn * 0.6;
}

// Bilan d'une UE : moyenne pondérée, complétude, validation, points faibles.
function bilanUE(ue, store) {
  let sumPts = 0, sumCoef = 0, nSaisies = 0;
  const faibles = [];
  ue.mats.forEach(mat => {
    const note = noteFinaleMatiere(store[mat.k]);
    if (note !== null) {
      sumPts += note * mat.coef;
      sumCoef += mat.coef;
      nSaisies++;
      if (note < 10) faibles.push({ ...mat, note });
    }
  });
  const complete = nSaisies === ue.mats.length;
  const moyenne = sumCoef > 0 ? sumPts / sumCoef : null;
  return {
    moyenne, complete, faibles,
    manquantes: ue.mats.length - nSaisies,
    valide: complete && moyenne !== null && moyenne >= 10,
    sumPts, sumCoef,
  };
}

// Bilan global : moyennes par semestre, moyenne de classe, crédits, finale.
function bilanGlobal(store) {
  const parSem = {};
  let totPts = 0, totCoef = 0, totManquantes = 0, credits = 0;

  NOTES_STRUCTURE.forEach(s => {
    let pts = 0, coef = 0, manq = 0;
    s.ues.forEach(ue => {
      const b = bilanUE(ue, store);
      pts += b.sumPts; coef += b.sumCoef; manq += b.manquantes;
      if (b.valide) credits += ue.credits;
    });
    parSem[s.sem] = { moyenne: coef > 0 ? pts / coef : null, manquantes: manq };
    totPts += pts; totCoef += coef; totManquantes += manq;
  });

  const classe = totCoef > 0 ? totPts / totCoef : null;
  const stage = (typeof store._stage === 'number') ? store._stage : null;
  if (stage !== null && stage >= 10) credits += NOTES_STAGE.credits;
  const finale = (classe !== null && stage !== null) ? classe * 0.4 + stage * 0.6 : null;

  return { parSem, classe, stage, finale, credits, manquantes: totManquantes };
}

/* --------------------------------- Écran --------------------------------- */
function fmtNote(x) {
  if (x === null || x === undefined || isNaN(x)) return '—';
  return (Math.round(x * 100) / 100).toLocaleString('fr-FR');
}
function noteClass(x) {
  if (x === null) return '';
  return x >= 10 ? 'note-ok' : 'note-ko';
}

function renderMesNotes() {
  const store = notesLoad();

  const semBlocks = NOTES_STRUCTURE.map(s => {
    const ueBlocks = s.ues.map(ue => {
      const rows = ue.mats.map(mat => {
        const e = store[mat.k] || {};
        const note = noteFinaleMatiere(e);
        return `
          <div class="notes-row">
            <div class="notes-mat">${escapeHtml(mat.nom)} <span class="notes-coef">coef ${mat.coef}</span></div>
            <input class="notes-in" data-k="${mat.k}" data-f="cc" inputmode="decimal"
                   placeholder="CC" value="${typeof e.cc === 'number' ? String(e.cc).replace('.', ',') : ''}">
            <input class="notes-in" data-k="${mat.k}" data-f="sn" inputmode="decimal"
                   placeholder="SN" value="${typeof e.sn === 'number' ? String(e.sn).replace('.', ',') : ''}">
            <div class="notes-note ${noteClass(note)}" id="note-${mat.k}">${fmtNote(note)}</div>
          </div>`;
      }).join('');
      return `
        <div class="notes-ue" id="ue-card-${ue.id}">
          <div class="notes-ue-head">
            <div class="notes-ue-title">
              <strong>${escapeHtml(ue.label)}</strong>
              <span class="notes-credits">💎 ${ue.credits} crédits</span>
            </div>
            <span class="notes-ue-status" id="ue-status-${ue.id}">⏳</span>
          </div>
          <div class="notes-ue-bar"><div class="notes-ue-fill" id="ue-fill-${ue.id}"></div></div>
          <div class="notes-row notes-row-head">
            <div class="notes-mat">Matière</div><div>CC /20</div><div>SN /20</div><div>Note</div>
          </div>
          ${rows}
          <div class="notes-ue-foot" id="ue-foot-${ue.id}"></div>
        </div>`;
    }).join('');
    return `
      <div class="notes-sem">
        <h3 class="notes-sem-title"><span class="notes-sem-badge">${s.sem}</span> ${escapeHtml(s.label)}
          <span id="sem-moy-${s.sem}" class="notes-sem-moy"></span></h3>
        ${ueBlocks}
      </div>`;
  }).join('');

  $('notes-content').innerHTML = `
    <div class="nh">
      <div class="nh-ring" id="nh-ring">
        <div class="nh-ring-in">
          <strong id="nh-credits">0</strong>
          <em>/ 60 crédits</em>
        </div>
      </div>
      <div class="nh-main">
        <span class="nh-label">Moyenne de classe</span>
        <span class="nh-value" id="nh-classe">—</span>
        <div class="nh-chips">
          <span class="nh-chip">S5 <strong id="nh-s5">—</strong></span>
          <span class="nh-chip">S6 <strong id="nh-s6">—</strong></span>
          <span class="nh-chip">Stage <strong id="nh-stage">—</strong></span>
          <span class="nh-chip nh-chip-final">🎓 Finale <strong id="nh-finale">—</strong></span>
        </div>
        <span class="nh-hint" id="nh-hint"></span>
      </div>
    </div>
    <p class="notes-privacy">🔒 Tes notes restent <strong>uniquement sur ton téléphone</strong> — rien n'est envoyé en ligne.
    Note matière = CC×40% + SN×60% · UE validée si moyenne ≥ 10 (compensation) → crédits débloqués.</p>
    ${semBlocks}
    <div class="notes-ue notes-stage" id="ue-card-stage">
      <div class="notes-ue-head">
        <div class="notes-ue-title">
          <strong>🎯 Projet final d'études (stage)</strong>
          <span class="notes-credits">coef ${NOTES_STAGE.coef} · 💎 ${NOTES_STAGE.credits} crédits</span>
        </div>
      </div>
      <div class="notes-row">
        <div class="notes-mat">Note du projet de stage <span class="notes-coef">hors UE — 60% de la moyenne finale</span></div>
        <input class="notes-in" data-k="_stage" data-f="solo" inputmode="decimal" placeholder="/20"
               value="${typeof store._stage === 'number' ? String(store._stage).replace('.', ',') : ''}">
        <div></div>
        <div class="notes-note ${noteClass(typeof store._stage === 'number' ? store._stage : null)}" id="note-_stage">${fmtNote(typeof store._stage === 'number' ? store._stage : null)}</div>
      </div>
    </div>
    <button id="btn-notes-reset" class="btn-secondary notes-reset">🗑️ Effacer toutes mes notes</button>
  `;

  // Saisie : parse (virgule acceptée), borne 0–20, sauvegarde, recalcul live.
  $('notes-content').querySelectorAll('.notes-in').forEach(inp => {
    inp.addEventListener('input', () => {
      const raw = inp.value.trim().replace(',', '.');
      const v = raw === '' ? null : parseFloat(raw);
      const valid = v === null || (!isNaN(v) && v >= 0 && v <= 20);
      inp.classList.toggle('notes-in-bad', !valid);
      if (!valid) return;
      const st = notesLoad();
      if (inp.dataset.k === '_stage') {
        if (v === null) delete st._stage; else st._stage = v;
      } else {
        st[inp.dataset.k] = st[inp.dataset.k] || {};
        if (v === null) delete st[inp.dataset.k][inp.dataset.f];
        else st[inp.dataset.k][inp.dataset.f] = v;
        if (!Object.keys(st[inp.dataset.k]).length) delete st[inp.dataset.k];
      }
      notesSave(st);
      refreshNotesComputed();
    });
  });

  // Bouton "Réviser" (délégation : le pied d'UE est re-rendu à chaque saisie).
  $('notes-content').onclick = (ev) => {
    const btn = ev.target.closest('[data-revise]');
    if (btn) {
      const m = findMatiereById(btn.dataset.revise);
      if (m) renderMatiere(m);
      return;
    }
    if (ev.target.id === 'btn-notes-reset') {
      if (confirm('Effacer toutes tes notes saisies ? (irréversible)')) {
        try { localStorage.removeItem(STORAGE_NOTES); } catch {}
        renderMesNotes();
      }
    }
  };

  refreshNotesComputed();
  go('mes-notes');
}

// Met à jour toutes les valeurs calculées sans re-rendre les champs (focus conservé).
function refreshNotesComputed() {
  const store = notesLoad();
  const g = bilanGlobal(store);   // calculé une seule fois (boucle semestres + héro)

  NOTES_STRUCTURE.forEach(s => {
    s.ues.forEach(ue => {
      ue.mats.forEach(mat => {
        const cell = $(`note-${mat.k}`);
        if (!cell) return;
        const note = noteFinaleMatiere(store[mat.k]);
        cell.textContent = fmtNote(note);
        cell.className = 'notes-note ' + noteClass(note);
      });

      const foot = $(`ue-foot-${ue.id}`);
      if (!foot) return;
      const b = bilanUE(ue, store);

      // Chip de statut + barre de progression de l'UE (moyenne /20)
      const chip = $(`ue-status-${ue.id}`);
      const fill = $(`ue-fill-${ue.id}`);
      const card = $(`ue-card-${ue.id}`);
      const stateCls = b.moyenne === null ? 'wait' : (!b.complete ? 'part' : (b.valide ? 'ok' : 'ko'));
      if (chip) {
        chip.textContent = b.moyenne === null ? '⏳ à saisir'
          : !b.complete ? `⏳ ${fmtNote(b.moyenne)}/20`
          : b.valide ? `✅ ${fmtNote(b.moyenne)}/20`
          : `❌ ${fmtNote(b.moyenne)}/20`;
        chip.className = 'notes-ue-status ue-st-' + stateCls;
      }
      if (fill) {
        fill.style.width = b.moyenne === null ? '0%' : Math.min(100, Math.max(0, b.moyenne / 20 * 100)) + '%';
        fill.className = 'notes-ue-fill ue-fill-' + stateCls;
      }
      if (card) {
        card.classList.toggle('notes-ue-ok', stateCls === 'ok');
        card.classList.toggle('notes-ue-ko', stateCls === 'ko');
      }

      const conseils = b.faibles.map(f => `
        <span class="notes-conseil">📌 ${escapeHtml(f.nom)} : <strong>${fmtNote(f.note)}</strong>/20
          ${f.mid ? `<button class="notes-revise" data-revise="${escapeHtml(f.mid)}">📚 Réviser</button>` : ''}
        </span>`).join('');

      if (b.moyenne === null) {
        foot.innerHTML = '<span class="notes-attente">⏳ Saisis tes notes pour calculer ce module.</span>';
      } else if (!b.complete) {
        foot.innerHTML = `<span class="notes-attente">⏳ Moyenne provisoire : <strong>${fmtNote(b.moyenne)}</strong>/20
          (${b.manquantes} note${b.manquantes > 1 ? 's' : ''} manquante${b.manquantes > 1 ? 's' : ''})</span>${conseils}`;
      } else if (b.valide) {
        const compense = b.faibles.length
          ? `<br><span class="notes-compense">Validé par compensation — point${b.faibles.length > 1 ? 's' : ''} faible${b.faibles.length > 1 ? 's' : ''} à surveiller :</span>${conseils}`
          : '';
        foot.innerHTML = `<span class="notes-valide">✅ VALIDÉ — moyenne <strong>${fmtNote(b.moyenne)}</strong>/20 · +${ue.credits} crédits</span>${compense}`;
      } else {
        foot.innerHTML = `<span class="notes-nonvalide">❌ Non validé — moyenne <strong>${fmtNote(b.moyenne)}</strong>/20.
          Conseil : concentre tes révisions sur :</span>${conseils}`;
      }
    });

    const semEl = $(`sem-moy-${s.sem}`);
    if (semEl) {
      const sg = g.parSem[s.sem];
      semEl.textContent = sg.moyenne !== null
        ? `moyenne : ${fmtNote(sg.moyenne)}/20${sg.manquantes ? ' (provisoire)' : ''}` : '';
    }
  });

  const cellStage = $('note-_stage');
  if (cellStage) {
    const v = (typeof store._stage === 'number') ? store._stage : null;
    cellStage.textContent = fmtNote(v);
    cellStage.className = 'notes-note ' + noteClass(v);
  }

  // ----- Héro : anneau de crédits + moyennes clés -----
  const set = (id, v, withClass) => {
    const el = $(id);
    if (!el) return;
    el.textContent = fmtNote(v);
    if (withClass) {
      el.classList.remove('note-ok', 'note-ko');
      if (v !== null) el.classList.add(v >= 10 ? 'note-ok' : 'note-ko');
    }
  };
  set('nh-classe', g.classe, true);
  set('nh-s5', g.parSem.S5.moyenne, true);
  set('nh-s6', g.parSem.S6.moyenne, true);
  set('nh-stage', g.stage, true);
  set('nh-finale', g.finale, true);
  const cred = $('nh-credits');
  if (cred) cred.textContent = String(g.credits);
  const ring = $('nh-ring');
  if (ring) ring.style.setProperty('--p', Math.min(100, g.credits / 60 * 100) + '%');
  const hint = $('nh-hint');
  if (hint) {
    hint.textContent = g.finale !== null
      ? '🎓 Moyenne finale = classe×40% + stage×60%'
      : g.manquantes
        ? `⏳ Provisoire — ${g.manquantes} note${g.manquantes > 1 ? 's' : ''} manquante${g.manquantes > 1 ? 's' : ''}${g.stage === null ? ' · note de stage à saisir' : ''}`
        : (g.stage === null ? '🎯 Saisis ta note de stage pour la moyenne finale' : '');
  }
}

// Bouton d'accès depuis l'accueil (HTML statique → on branche une fois).
document.addEventListener('DOMContentLoaded', () => {
  const b = document.getElementById('btn-mes-notes');
  if (b) b.onclick = () => renderMesNotes();
});
