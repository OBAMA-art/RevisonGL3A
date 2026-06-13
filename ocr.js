/* =========================================================================
   ocr.js — Scanner une épreuve (OCR 100% navigateur, Tesseract.js)
   PWA Révisions GL3A. Aucune dépendance bundler, aucun backend, aucune clé.
   Réutilise les helpers globaux d'app.js : $, escapeHtml, go, normalizeTitle,
   getUserEpreuves, renderAddEpreuve, addFormState, renderQuestionsForm,
   renderEpreuves, et les globales EPREUVES_DATA, MATIERES, MATIERES_JEUDI.
   ========================================================================= */

/* ---------------------------------------------------------------------------
   1) CHARGEMENT PARESSEUX DE TESSERACT.JS (UMD, sans bundler)
   --------------------------------------------------------------------------- */
const TESSERACT_VERSION = '5.1.1';
const TESSERACT_CDN = `https://cdn.jsdelivr.net/npm/tesseract.js@${TESSERACT_VERSION}/dist/tesseract.min.js`;
let _tesseractLoading = null;

function loadTesseract() {
  if (typeof window.Tesseract !== 'undefined') return Promise.resolve(window.Tesseract);
  if (_tesseractLoading) return _tesseractLoading;
  _tesseractLoading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = TESSERACT_CDN;
    s.async = true;
    s.onload = () => {
      if (typeof window.Tesseract !== 'undefined') resolve(window.Tesseract);
      else { _tesseractLoading = null; reject(new Error('Tesseract chargé mais introuvable.')); }
    };
    s.onerror = () => {
      _tesseractLoading = null; // autorise un nouvel essai
      reject(new Error('Impossible de charger l\'OCR (connexion Internet requise au 1er usage).'));
    };
    document.head.appendChild(s);
  });
  return _tesseractLoading;
}

/* ---------------------------------------------------------------------------
   2) PRÉ-TRAITEMENT IMAGE (canvas) : downscale + gris + contraste + Otsu
   --------------------------------------------------------------------------- */
const OCR_TARGET_WIDTH = 1500;

function loadImageElement(fileOrDataURL) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (typeof fileOrDataURL === 'string') {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Image illisible ou format non supporté.'));
      img.src = fileOrDataURL;
    } else {
      const url = URL.createObjectURL(fileOrDataURL);
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image illisible.')); };
      img.src = url;
    }
  });
}

function otsuThreshold(histogram, totalPixels) {
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * histogram[i];
  let sumB = 0, wB = 0, maxVar = 0, threshold = 127;
  for (let t = 0; t < 256; t++) {
    wB += histogram[t];
    if (wB === 0) continue;
    const wF = totalPixels - wB;
    if (wF === 0) break;
    sumB += t * histogram[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > maxVar) { maxVar = between; threshold = t; }
  }
  return threshold;
}

async function preprocessImage(fileOrDataURL) {
  const img = await loadImageElement(fileOrDataURL);
  const scale = img.width > OCR_TARGET_WIDTH ? OCR_TARGET_WIDTH / img.width : 1;
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);

  const imageData = ctx.getImageData(0, 0, w, h);
  const px = imageData.data;
  const n = w * h;

  const gray = new Uint8ClampedArray(n);
  const hist = new Uint32Array(256);
  for (let i = 0, j = 0; i < px.length; i += 4, j++) {
    const g = (px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114) | 0;
    gray[j] = g; hist[g]++;
  }

  // étirement de contraste (clip 2 %)
  const clip = Math.floor(n * 0.02);
  let lo = 0, hi = 255, acc = 0;
  for (let i = 0; i < 256; i++) { acc += hist[i]; if (acc > clip) { lo = i; break; } }
  acc = 0;
  for (let i = 255; i >= 0; i--) { acc += hist[i]; if (acc > clip) { hi = i; break; } }
  const range = Math.max(1, hi - lo);

  const thr = otsuThreshold(hist, n);
  for (let i = 0, j = 0; i < px.length; i += 4, j++) {
    let v = ((gray[j] - lo) * 255 / range);
    v = v < 0 ? 0 : v > 255 ? 255 : v;
    const bw = v < thr ? 0 : 255;
    px[i] = px[i + 1] = px[i + 2] = bw;
    px[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

/* ---------------------------------------------------------------------------
   3) OCR PRINCIPAL : worker fra+eng, progression, cleanup.
   --------------------------------------------------------------------------- */
async function runOCR(fileOrDataURL, onProgress) {
  const Tesseract = await loadTesseract();
  const cb = typeof onProgress === 'function' ? onProgress : () => {};
  let worker = null;
  try {
    worker = await Tesseract.createWorker(['fra', 'eng'], 1, {
      workerPath: `https://cdn.jsdelivr.net/npm/tesseract.js@${TESSERACT_VERSION}/dist/worker.min.js`,
      corePath:   `https://cdn.jsdelivr.net/npm/tesseract.js-core@${TESSERACT_VERSION}/`,
      langPath:   'https://tessdata.projectnaptha.com/4.0.0',
      logger: (m) => {
        if (m.status === 'recognizing text' && typeof m.progress === 'number') cb(m.progress);
      }
    });
    await worker.setParameters({
      tessedit_pageseg_mode: '1',        // AUTO_OSD
      preserve_interword_spaces: '1'
    });
    const { data } = await worker.recognize(fileOrDataURL);
    cb(1);
    return { text: (data && data.text) || '', confidence: (data && data.confidence) || 0 };
  } finally {
    if (worker) { try { await worker.terminate(); } catch (e) {} }
  }
}

/* ---------------------------------------------------------------------------
   4) MATCHING FLOU (doublon / nouvelle épreuve) — tolérant au bruit OCR.
   --------------------------------------------------------------------------- */
function levenshtein(a, b) {
  a = String(a || ''); b = String(b || '');
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  if (a.length > b.length) { const t = a; a = b; b = t; }
  const m = a.length;
  let prev = new Array(m + 1);
  for (let i = 0; i <= m; i++) prev[i] = i;
  for (let j = 1; j <= b.length; j++) {
    let diag = prev[0];
    prev[0] = j;
    const bj = b.charCodeAt(j - 1);
    for (let i = 1; i <= m; i++) {
      const tmp = prev[i];
      const cost = a.charCodeAt(i - 1) === bj ? 0 : 1;
      prev[i] = Math.min(prev[i] + 1, prev[i - 1] + 1, diag + cost);
      diag = tmp;
    }
  }
  return prev[m];
}

function similarityRatio(a, b) {
  a = normalizeTitle(a); b = normalizeTitle(b);
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

function tokenJaccard(a, b) {
  const tok = s => new Set(normalizeTitle(s).split(' ').filter(w => w.length > 1));
  const sa = tok(a), sb = tok(b);
  if (sa.size === 0 && sb.size === 0) return 1;
  if (sa.size === 0 || sb.size === 0) return 0;
  let inter = 0;
  sa.forEach(w => { if (sb.has(w)) inter++; });
  const union = sa.size + sb.size - inter;
  return union === 0 ? 1 : inter / union;
}

function combinedSimilarity(a, b) {
  const ratio = similarityRatio(a, b);
  const jac = tokenJaccard(a, b);
  const weighted = ratio * 0.6 + jac * 0.4;
  return Math.max(weighted, Math.max(ratio, jac) * 0.95);
}

function findSimilarEpreuve(candidate, existingList, opts) {
  opts = opts || {};
  const threshold = opts.threshold != null ? opts.threshold : 0.82;
  const gray = opts.gray != null ? opts.gray : 0.65;
  let best = null, bestScore = 0;
  (existingList || []).forEach(ep => {
    const s1 = combinedSimilarity(candidate, ep.titre || '');
    const s2 = ep.signature ? combinedSimilarity(candidate, ep.signature) : 0;
    const score = Math.max(s1, s2);
    if (score > bestScore) { bestScore = score; best = ep; }
  });
  return {
    match: bestScore >= gray ? best : null,
    score: Math.round(bestScore * 1000) / 1000,
    isDuplicate: bestScore >= threshold,
    isUncertain: bestScore >= gray && bestScore < threshold
  };
}

// Statut 3 états sur un simple titre/candidat (fuzzy pur). Ne bloque rien.
function checkEpreuveStatus(matiereId, candidate, opts) {
  const all = [
    ...((typeof EPREUVES_DATA !== 'undefined' && EPREUVES_DATA[matiereId]) || []),
    ...getUserEpreuves(matiereId)
  ];
  const r = findSimilarEpreuve(candidate, all, opts);
  let status = 'nouvelle';
  if (r.isDuplicate) status = 'doublon';
  else if (r.isUncertain) status = 'incertain';
  return { status, match: r.match, score: r.score };
}

// Extrait { type, year } du titre d'une épreuve existante (réutilise TYPE_PATTERNS).
function parseEpreuveMeta(titre) {
  const n = ocrNorm(titre || '');
  let type = null;
  for (const { type: t, re } of TYPE_PATTERNS) { if (re.test(n)) { type = t; break; } }
  let year = null;
  let m = n.match(/\b(20\d{2})\s*[-\/–]\s*(20\d{2})\b/);
  if (m) year = m[1] + '-' + m[2];
  else { m = n.match(/\b(20\d{2})\b/); if (m) year = m[1]; }
  return { type, year };
}

// Statut robuste pour le SCAN : combine signal STRUCTURÉ (type+année) et flou textuel.
// C'est ce qui détecte qu'une épreuve scannée existe déjà même si le libellé diffère.
function checkScanStatus(matiereId, header, opts) {
  opts = opts || {};
  const threshold = opts.threshold != null ? opts.threshold : 0.82;
  const gray = opts.gray != null ? opts.gray : 0.65;

  const all = [
    ...((typeof EPREUVES_DATA !== 'undefined' && EPREUVES_DATA[matiereId]) || []),
    ...getUserEpreuves(matiereId)
  ];

  const cType = header.type ? ocrNorm(header.type) : null;
  const cYear = header.annee || (header.session ? (header.session.match(/20\d{2}/) || [null])[0] : null);
  const cYearNorm = cYear ? ocrNorm(cYear) : null;
  // Candidat textuel pour le flou : titre proposé + nom matière + tête du texte OCR
  const fuzzyCand = [
    header.titrePropose || '',
    header.matiereDetectee || '',
    (header.rawText || '').split(/\r?\n/).slice(0, 12).join(' ')
  ].join(' ');

  let best = null, bestScore = 0;
  all.forEach(ep => {
    const meta = parseEpreuveMeta(ep.titre);
    const eYearNorm = meta.year ? ocrNorm(meta.year) : null;

    // 1) Signal structuré type+année (même matière garantie : on est dans sa liste)
    let structured = 0;
    const yearMatch = cYearNorm && eYearNorm && cYearNorm === eYearNorm;
    const typeMatch = cType && meta.type && ocrNorm(meta.type) === cType;
    if (yearMatch && typeMatch) structured = 0.9;
    else if (yearMatch) structured = 0.7;            // même année, type différent → suspect
    else if (typeMatch && !cYearNorm) structured = 0.45;

    // 2) Signal flou textuel
    const fuzzy = Math.max(
      combinedSimilarity(fuzzyCand, ep.titre || ''),
      tokenJaccard(fuzzyCand, (ep.titre || '') + ' ' + (ep.source || ''))
    );

    const score = Math.max(structured, fuzzy);
    if (score > bestScore) { bestScore = score; best = ep; }
  });

  bestScore = Math.round(bestScore * 1000) / 1000;
  let status = 'nouvelle';
  if (bestScore >= threshold) status = 'doublon';
  else if (bestScore >= gray) status = 'incertain';
  return { status, match: bestScore >= gray ? best : null, score: bestScore };
}

/* ---------------------------------------------------------------------------
   5) PARSING ENTÊTE IAI Cameroun (FR + EN) + détection matière pondérée
   --------------------------------------------------------------------------- */
function ocrNorm(s) {
  return (s || '').toString()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’'`´]/g, "'")
    .replace(/œ/g, 'oe')
    .replace(/[^a-z0-9'/+.\-\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

const MATIERE_KEYWORDS = {
  ia: [
    { kw: "introduction a l'intelligence artificielle", w: 7 },
    { kw: 'intelligence artificielle', w: 6 },
    { kw: 'machine learning', w: 4 }, { kw: 'apprentissage automatique', w: 4 },
    { kw: 'deep learning', w: 3 }, { kw: 'reseau de neurones', w: 3 },
    { kw: 'perceptron', w: 4 }, { kw: ' ia ', w: 3 }
  ],
  english: [
    { kw: 'expert english', w: 7 }, { kw: 'anglais expert', w: 7 },
    { kw: 'technical english', w: 5 }, { kw: 'business communication', w: 4 },
    { kw: 'anglais', w: 4 }, { kw: 'english', w: 4 }
  ],
  secubd: [
    { kw: 'securite des bases de donnees', w: 8 }, { kw: 'securite des bd', w: 6 },
    { kw: 'securite', w: 5 }, { kw: 'security', w: 4 },
    { kw: 'chiffrement', w: 2 }, { kw: 'injection sql', w: 2 }, { kw: 'oracle', w: 2 }
  ],
  bigdata: [
    { kw: 'big data', w: 7 }, { kw: 'bigdata', w: 7 }, { kw: 'nosql', w: 6 },
    { kw: 'no sql', w: 6 }, { kw: 'mongodb', w: 4 }, { kw: 'hadoop', w: 4 },
    { kw: 'mapreduce', w: 4 }, { kw: 'donnees massives', w: 4 }
  ],
  poo: [
    { kw: 'programmation orientee objet', w: 6 }, { kw: 'oriente objet', w: 5 },
    { kw: 'programmation objet', w: 5 }, { kw: 'poo', w: 5 },
    { kw: 'django', w: 6 }, { kw: 'flask', w: 6 }, { kw: 'python', w: 2 }
  ],
  mobile: [
    { kw: 'programmation mobile', w: 7 }, { kw: 'mobile', w: 5 },
    { kw: 'flutter', w: 7 }, { kw: 'dart', w: 5 }, { kw: 'android', w: 2 }
  ],
  data: [
    { kw: 'analyse des donnees', w: 7 }, { kw: 'analyse de donnees', w: 7 },
    { kw: 'acp', w: 5 }, { kw: 'analyse en composantes principales', w: 6 },
    { kw: 'afc', w: 4 }, { kw: 'classification ascendante', w: 4 },
    { kw: 'cah', w: 3 }, { kw: 'statistiques', w: 2 }
  ],
  web: [
    { kw: 'outils de programmation web', w: 7 }, { kw: 'outil de programmation web', w: 7 },
    { kw: 'programmation web', w: 6 }, { kw: 'laravel', w: 7 },
    { kw: 'php', w: 3 }, { kw: 'blade', w: 3 }, { kw: 'eloquent', w: 3 }, { kw: 'nodejs', w: 3 }, { kw: 'html', w: 1 }
  ],
  // Nouvelles matières (rattrapages SN1/SN2)
  sig: [
    { kw: "systeme d'information geographique", w: 8 }, { kw: 'information geographique', w: 6 },
    { kw: ' sig ', w: 5 }, { kw: 'geographique', w: 3 }, { kw: 'qgis', w: 4 }, { kw: 'arcgis', w: 4 }, { kw: 'cartographie', w: 3 }
  ],
  siad: [
    { kw: "systeme d'information d'aide a la decision", w: 9 }, { kw: 'aide a la decision', w: 7 },
    { kw: ' siad ', w: 6 }, { kw: 'business intelligence', w: 5 }, { kw: 'entrepot de donnees', w: 4 },
    { kw: 'data warehouse', w: 4 }, { kw: 'datamart', w: 4 }, { kw: 'olap', w: 4 }, { kw: 'etl', w: 3 }, { kw: 'tableau de bord', w: 2 }
  ],
  j2e: [
    { kw: 'programmation j2e', w: 8 }, { kw: ' j2e ', w: 6 }, { kw: ' jee ', w: 6 },
    { kw: 'java ee', w: 6 }, { kw: 'jakarta ee', w: 6 }, { kw: 'servlet', w: 4 }, { kw: 'jsp', w: 4 }, { kw: 'ejb', w: 4 }, { kw: 'spring', w: 3 }
  ],
  python: [
    { kw: 'python avancee', w: 8 }, { kw: 'programmation python', w: 7 }, { kw: 'python avance', w: 8 },
    { kw: ' python ', w: 4 }, { kw: 'numpy', w: 3 }, { kw: 'pandas', w: 3 }, { kw: 'decorateur', w: 2 }, { kw: 'generateur', w: 2 }
  ],
  oracle: [
    { kw: 'administration des bases de donnees oracle', w: 9 }, { kw: 'administration bd oracle', w: 8 },
    { kw: ' oracle ', w: 6 }, { kw: 'pl/sql', w: 5 }, { kw: 'plsql', w: 5 }, { kw: 'tablespace', w: 4 }, { kw: 'sqlplus', w: 4 }
  ],
  sqlserver: [
    { kw: 'administration des bases de donnees sql-server', w: 9 }, { kw: 'sql server', w: 7 }, { kw: 'sql-server', w: 8 },
    { kw: 'transact-sql', w: 5 }, { kw: 't-sql', w: 5 }, { kw: 'ssms', w: 4 }, { kw: 'ssis', w: 4 }
  ],
  chinois: [
    { kw: 'chinois', w: 8 }, { kw: 'mandarin', w: 7 }, { kw: 'hanyu', w: 5 }, { kw: 'pinyin', w: 5 }, { kw: 'hsk', w: 4 }
  ],
  techcom: [
    { kw: 'techniques de communication', w: 8 }, { kw: 'technique de communication', w: 8 },
    { kw: 'communication professionnelle', w: 5 }, { kw: 'prise de parole', w: 3 }, { kw: 'redaction', w: 2 }
  ],
  entreprenariat: [
    { kw: "entreprenariat et creation d'entreprise", w: 9 }, { kw: 'entreprenariat', w: 7 }, { kw: 'entrepreneuriat', w: 7 },
    { kw: "creation d'entreprise", w: 6 }, { kw: 'business plan', w: 5 }, { kw: 'startup', w: 3 }, { kw: 'business model', w: 4 }
  ],
  droittravail: [
    { kw: 'droit du travail', w: 8 }, { kw: 'legislation du travail', w: 6 }, { kw: 'contrat de travail', w: 5 },
    { kw: 'code du travail', w: 5 }, { kw: 'licenciement', w: 3 }, { kw: 'convention collective', w: 3 }
  ],
  multimedia: [
    { kw: 'techniques multimedias et infographie', w: 9 }, { kw: 'multimedia et infographie', w: 8 },
    { kw: 'infographie', w: 6 }, { kw: 'multimedia', w: 5 }, { kw: 'photoshop', w: 4 }, { kw: 'illustrator', w: 4 }, { kw: 'montage video', w: 3 }
  ]
};

// Libellés dérivés dynamiquement des vraies données (data.js + data-jeudi.js),
// avec fallback codé en dur si une matière manque.
const MATIERE_LABEL = (function () {
  const fallback = {
    poo: 'POO Avancée', mobile: 'Programmation Mobile', data: 'Analyse des Données',
    web: 'Outils de Prog. Web', ia: "Intro. à l'IA", english: 'English Expert',
    secubd: 'Sécurité des BD', bigdata: 'Big Data NoSQL'
  };
  try {
    const all = []
      .concat(typeof MATIERES !== 'undefined' ? MATIERES : [])
      .concat(typeof MATIERES_JEUDI !== 'undefined' ? MATIERES_JEUDI : [])
      .concat(typeof MATIERES_EXTRA !== 'undefined' ? MATIERES_EXTRA : []);
    all.forEach(m => { if (m && m.id && m.titre) fallback[m.id] = m.titre; });
  } catch (e) {}
  return fallback;
})();

const TYPE_PATTERNS = [
  { type: 'Rattrapage', re: /\brattrap|\bresit\b|session de rattrap|\bcu controle/ },
  { type: 'Examen de fin de semestre', re: /fin de semestre|end of semester|examen de fin|de fin de sem/ },
  { type: 'CC', re: /controle continu|\bcc\b|continuous assessment/ },
  { type: 'Examen', re: /\bexamen\b|\bexam\b|\bepreuve\b|\bsujet\b|\btest\b/ }
];

const DUREE_PATTERNS = [
  /(\d{1,2})\s*h\s*(\d{2})\b/,
  /(\d{1,2})\s*heures?\s*(\d{2})\b/,
  /(\d{1,2})\s*h(?!\d)/,
  /(\d{1,2})\s*heures?\b/,
  /\b(\d{1,3})\s*min(?:utes?)?\b/
];

const BAREME_PATTERNS = [
  /\/\s*(\d{1,3})\s*(?:pts?|points?|marks?)?/,
  /\bsur\s*(\d{1,3})\b/,
  /\b(\d{1,3})\s*(?:points?|pts?|marks?)\b/,
  /\bbar[eè]me\s*[:\-]?\s*\/?\s*(\d{1,3})/
];

const NIVEAU_PATTERNS = [/niveau\s*[:\-]?\s*(iii|3)\b/, /\blevel\s*[:\-]?\s*(3|iii)\b/, /\bgl\s*3\b/];
const FILIERE_PATTERNS = [
  { label: 'Génie Logiciel', re: /genie logiciel|\bgl\b|software eng/ },
  { label: 'Systèmes et Réseaux', re: /systemes? et reseaux|systems and networks/ }
];

const MONTHS = {
  janvier:'Janvier', january:'Janvier', fevrier:'Février', february:'Février',
  mars:'Mars', march:'Mars', avril:'Avril', april:'Avril', mai:'Mai', may:'Mai',
  juin:'Juin', june:'Juin', juillet:'Juillet', july:'Juillet', aout:'Août', august:'Août',
  septembre:'Septembre', september:'Septembre', octobre:'Octobre', october:'Octobre',
  novembre:'Novembre', november:'Novembre', decembre:'Décembre', december:'Décembre'
};
const MONTHS_RE = Object.keys(MONTHS).join('|');

function detectSessionAnnee(norm) {
  const out = { session: null, annee: null };
  let m = norm.match(/\b(20\d{2})\s*[-\/–]\s*(20\d{2})\b/);
  if (m) out.annee = m[1] + '-' + m[2];
  const reMonthYear = new RegExp('\\b(' + MONTHS_RE + ')\\s+(20\\d{2})');
  m = norm.match(reMonthYear);
  if (m) { out.session = MONTHS[m[1]] + ' ' + m[2]; if (!out.annee) out.annee = m[2]; }
  else {
    const reMonth = new RegExp('\\bsession\\s+(?:de\\s+|du\\s+)?(' + MONTHS_RE + ')');
    m = norm.match(reMonth);
    if (m) out.session = MONTHS[m[1]];
  }
  if (!out.annee) { m = norm.match(/\b(20\d{2})\b/); if (m) out.annee = m[1]; }
  return out;
}

function detectMatiere(norm) {
  const padded = ' ' + norm + ' ';
  const scores = {};
  for (const id in MATIERE_KEYWORDS) {
    let s = 0;
    for (const { kw, w } of MATIERE_KEYWORDS[id]) {
      if (padded.indexOf(kw) !== -1) {
        s += w;
        const esc = kw.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const ctx = new RegExp('(?:matiere|mati[eè]re|subject|epreuve)\\s*[:\\-]?\\s*' + esc);
        if (ctx.test(norm)) s += 3;
      }
    }
    scores[id] = s;
  }
  let bestId = null, best = 0, second = 0;
  for (const id in scores) {
    if (scores[id] > best) { second = best; best = scores[id]; bestId = id; }
    else if (scores[id] > second) { second = scores[id]; }
  }
  if (best > 0 && /securit/.test(norm) && scores.secubd >= best - 2) { bestId = 'secubd'; best = scores.secubd; }
  if (/analyse des donnees|analyse de donnees|\bacp\b/.test(norm) && scores.data >= scores.bigdata) { bestId = 'data'; }

  if (best >= 4 && (best - second >= 2 || best >= 6)) {
    return { matiereId: bestId, matiereDetectee: MATIERE_LABEL[bestId], score: best };
  }
  return { matiereId: null, matiereDetectee: null, score: best };
}

function parseExamHeader(rawText) {
  const raw = (rawText || '').toString();
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const headNorm = ocrNorm(lines.slice(0, 25).join('\n'));
  const norm = ocrNorm(raw);

  const r = {
    type: null, matiereDetectee: null, matiereId: null,
    session: null, annee: null, duree: null, bareme: null,
    niveau: null, filiere: null, titrePropose: '', sourceProposee: '',
    signature: '', confiance: 0, rawText: raw
  };

  for (const { type, re } of TYPE_PATTERNS) { if (re.test(headNorm)) { r.type = type; break; } }

  const det = detectMatiere(norm);
  r.matiereId = det.matiereId; r.matiereDetectee = det.matiereDetectee;

  const sa = detectSessionAnnee(headNorm);
  r.session = sa.session; r.annee = sa.annee;

  for (const re of DUREE_PATTERNS) {
    const m = headNorm.match(re);
    if (m) {
      if (m[2] !== undefined) r.duree = m[1] + 'h' + m[2];
      else if (/min/.test(m[0])) r.duree = m[1] + ' min';
      else r.duree = m[1] + 'h';
      break;
    }
  }
  for (const re of BAREME_PATTERNS) { const m = headNorm.match(re); if (m && m[1]) { r.bareme = '/' + m[1]; break; } }
  for (const re of NIVEAU_PATTERNS) { if (re.test(headNorm)) { r.niveau = '3'; break; } }
  for (const { label, re } of FILIERE_PATTERNS) { if (re.test(headNorm)) { r.filiere = label; break; } }

  const nomMat = r.matiereDetectee || 'Matière à préciser';
  let titre = (r.type ? r.type.toUpperCase() + ' — ' : '') + nomMat;
  const periode = r.session || r.annee;
  if (periode) titre += ' (' + periode + ')';
  r.titrePropose = titre;

  const src = ['IAI Cameroun'];
  if (r.niveau) src.push('Niveau ' + r.niveau);
  if (r.filiere) src.push(r.filiere);
  if (r.duree) src.push('durée ' + r.duree);
  if (r.bareme) src.push(r.bareme);
  r.sourceProposee = src.join(', ');

  const sig = s => ocrNorm(s).replace(/[^a-z0-9]/g, '');
  r.signature = [r.type ? sig(r.type) : '', r.matiereId || sig(nomMat), r.annee || '']
    .filter(Boolean).join('|');

  const champs = [r.type, r.matiereId, r.annee || r.session, r.duree, r.bareme, r.niveau];
  r.confiance = Math.round((champs.filter(Boolean).length / champs.length) * 100) / 100;
  return r;
}

/* ---------------------------------------------------------------------------
   6) GLUE UI : écran scanner, pipeline, pré-remplissage du formulaire existant
   --------------------------------------------------------------------------- */
let _ocrMatiere = null;
let _ocrLastText = '';
let _ocrChosenMatiereId = null;

function renderScanEpreuve(m) {
  _ocrMatiere = m;
  _ocrLastText = '';
  _ocrChosenMatiereId = m.id;
  $('scan-titre').textContent = `📷 Scanner une épreuve — ${m.titre}`;
  $('scan-status').textContent = '';
  $('scan-progress-wrap').hidden = true;
  $('scan-result').hidden = true;
  $('scan-preview-wrap').hidden = true;
  $('scan-progress-fill').style.width = '0%';

  $('btn-scan-camera').onclick   = () => $('ocr-file-camera').click();
  $('btn-scan-gallery').onclick  = () => $('ocr-file-gallery').click();
  $('ocr-file-camera').onchange  = (e) => handleOCRFile(e, m);
  $('ocr-file-gallery').onchange = (e) => handleOCRFile(e, m);
  $('btn-scan-cancel').onclick   = () => renderEpreuves(m);

  go('scan-epreuve');
}

async function handleOCRFile(event, m) {
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if (!file) return;

  if (file.size > 25 * 1024 * 1024) {
    $('scan-status').textContent = '❌ Image trop volumineuse (>25 Mo). Prends une photo plus légère.';
    return;
  }

  $('scan-result').hidden = true;
  $('scan-preview-wrap').hidden = false;
  $('scan-preview').src = URL.createObjectURL(file);
  $('scan-progress-wrap').hidden = false;
  $('scan-progress-fill').style.width = '0%';
  $('scan-status').textContent = '⏳ Préparation de l\'image…';

  try {
    const cleaned = await preprocessImage(file);

    $('scan-status').textContent = '🔎 Lecture du texte (français + anglais)… 10 à 30 s selon le téléphone.';
    const { text, confidence } = await runOCR(cleaned, (p) => {
      $('scan-progress-fill').style.width = Math.round(p * 100) + '%';
    });
    _ocrLastText = text || '';

    if (!_ocrLastText.trim() || _ocrLastText.replace(/\s/g, '').length < 8) {
      $('scan-progress-wrap').hidden = true;
      $('scan-status').textContent =
        '❌ Texte non détecté. Reprends la photo : bien éclairée, à plat, cadrée serrée, sans flou.';
      return;
    }

    const header = parseExamHeader(_ocrLastText);
    _ocrChosenMatiereId = header.matiereId || m.id;
    const status = checkScanStatus(_ocrChosenMatiereId, header);

    $('scan-progress-wrap').hidden = true;
    $('scan-status').textContent = `✅ OCR terminé (confiance ~${Math.round(confidence)}%).`;
    renderScanResult(m, header, status);
  } catch (err) {
    $('scan-progress-wrap').hidden = true;
    $('scan-status').textContent = '❌ ' + (err && err.message ? err.message : 'Échec de l\'OCR.');
  }
}

function renderScanResult(m, header, status) {
  let badge, dupLine = '';
  if (status.status === 'doublon') {
    badge = '<span class="scan-badge scan-badge-dup">♻️ Doublon probable</span>';
    dupLine = `<p>Ressemble à « ${escapeHtml(status.match ? status.match.titre : '?')} » (similarité ${status.score}). Tu peux quand même l'ajouter si c'est une autre session.</p>`;
  } else if (status.status === 'incertain') {
    badge = '<span class="scan-badge scan-badge-maybe">⚠️ À vérifier</span>';
    dupLine = `<p>Ressemble à « ${escapeHtml(status.match ? status.match.titre : '?')} » (similarité ${status.score}). Vérifie si c'est la même épreuve.</p>`;
  } else {
    badge = '<span class="scan-badge scan-badge-new">🆕 Nouvelle épreuve</span>';
  }

  let matiereBlock;
  if (header.matiereId) {
    const warn = header.matiereId !== m.id
      ? ` ⚠️ (tu es dans « ${escapeHtml(m.titre)} »)` : '';
    matiereBlock = `<p>📚 Matière détectée : <strong>${escapeHtml(MATIERE_LABEL[header.matiereId])}</strong>${warn}</p>`;
  } else {
    const opts = Object.keys(MATIERE_LABEL)
      .map(id => `<option value="${id}"${id === m.id ? ' selected' : ''}>${escapeHtml(MATIERE_LABEL[id])}</option>`)
      .join('');
    matiereBlock = `
      <div class="scan-matiere-pick">
        <p>📚 Matière non détectée — choisis-la :</p>
        <select id="scan-matiere-select">${opts}</select>
      </div>`;
  }

  $('scan-result').hidden = false;
  $('scan-result').innerHTML = `
    <div class="scan-diag">
      <p>${badge}</p>
      ${matiereBlock}
      <p>🏷️ Type : <strong>${escapeHtml(header.type || '—')}</strong> · Session : ${escapeHtml(header.session || header.annee || '—')}</p>
      <p>⏱️ Durée : ${escapeHtml(header.duree || '—')} · Barème : ${escapeHtml(header.bareme || '—')} · Niveau : ${escapeHtml(header.niveau || '—')}</p>
      ${dupLine}
      <p class="scan-titre-prop">Titre proposé : <strong>${escapeHtml(header.titrePropose)}</strong></p>
    </div>
    <details class="scan-raw">
      <summary>📄 Voir le texte OCR brut</summary>
      <pre>${escapeHtml(_ocrLastText)}</pre>
    </details>
    <div class="scan-ai-actions">
      ${(typeof aiAvailable === 'function' && aiAvailable())
        ? '<button id="btn-scan-ai" class="btn-primary">🤖 Corriger automatiquement (IA)</button>'
        : ''}
      <button id="btn-scan-fill" class="btn-secondary">✏️ Remplir le formulaire à la main</button>
    </div>
  `;

  const sel = $('scan-matiere-select');
  if (sel) {
    sel.onchange = () => {
      _ocrChosenMatiereId = sel.value;
      const st2 = checkScanStatus(_ocrChosenMatiereId, header);
      renderScanResult(m, { ...header, matiereId: null }, st2);
      const s2 = $('scan-matiere-select'); if (s2) s2.value = _ocrChosenMatiereId;
    };
  }

  $('btn-scan-fill').onclick = () => fillAddFormFromOCR(m, header, status);
  const aiBtn = $('btn-scan-ai');
  if (aiBtn) aiBtn.onclick = () => runAICorrection(m);
}

function fillAddFormFromOCR(m, header, status) {
  const targetId = _ocrChosenMatiereId || m.id;
  const targetM = findMatiereById(targetId) || m;

  renderAddEpreuve(targetM);   // rend déjà 1 carte question vide
  $('ep-titre').value  = header.titrePropose === 'Matière à préciser' ? '' : header.titrePropose;
  $('ep-source').value = header.sourceProposee;

  // Injecter le texte OCR dans la 1re question. On écrit DIRECTEMENT dans le DOM
  // de la carte déjà rendue (renderQuestionsForm resynchronise depuis le DOM et
  // écraserait une valeur posée uniquement dans l'état).
  const ocrText = _ocrLastText.trim();
  addFormState.questions = [{ enonce: ocrText, correction: '', bareme: header.bareme || '' }];
  const taEnonce = document.querySelector('#questions-list [data-field="enonce"]');
  const inBareme = document.querySelector('#questions-list [data-field="bareme"]');
  if (taEnonce) taEnonce.value = ocrText;
  if (inBareme) inBareme.value = header.bareme || '';

  if (status && (status.status === 'doublon' || status.status === 'incertain')) {
    const err = $('form-error');
    err.className = 'form-error';
    err.textContent = status.status === 'doublon'
      ? `⚠️ Doublon probable de « ${status.match ? status.match.titre : '?'} » (${status.score}). Vérifie avant d'enregistrer.`
      : `ℹ️ Ressemble à « ${status.match ? status.match.titre : '?'} » (${status.score}). Confirme que c'est bien une nouvelle épreuve.`;
    err.hidden = false;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function findMatiereById(id) {
  const a = (typeof MATIERES !== 'undefined' && MATIERES) || [];
  const b = (typeof MATIERES_JEUDI !== 'undefined' && MATIERES_JEUDI) || [];
  const c = (typeof MATIERES_EXTRA !== 'undefined' && MATIERES_EXTRA) || [];
  return a.concat(b).concat(c).find(x => x && x.id === id) || null;
}
