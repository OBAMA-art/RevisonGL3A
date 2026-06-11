// ============================================================================
// Programme officiel des RATTRAPAGES — session du 10 au 13 juin 2026
// IAI Cameroun · GL3A. Source de vérité EMBARQUÉE (fonctionne hors-ligne).
// Sert à : afficher l'horaire, classer chronologiquement, et SIGNALER
// automatiquement les matières déjà passées (selon l'horloge de l'appareil).
// ============================================================================
'use strict';

const PROGRAMME_OFFICIEL = {
  // ----- Mercredi 10 juin -----
  j2e:            { ordre: 1,  jour: 'Mercredi 10 juin', debut: '2026-06-10T08:00', fin: '2026-06-10T09:00', creneau: '08h00–09h00' },
  mobile:         { ordre: 2,  jour: 'Mercredi 10 juin', debut: '2026-06-10T09:10', fin: '2026-06-10T10:10', creneau: '09h10–10h10' },
  bigdata:        { ordre: 3,  jour: 'Mercredi 10 juin', debut: '2026-06-10T10:20', fin: '2026-06-10T11:20', creneau: '10h20–11h20' },
  web:            { ordre: 4,  jour: 'Mercredi 10 juin', debut: '2026-06-10T11:50', fin: '2026-06-10T12:50', creneau: '11h50–12h50' },
  sig:            { ordre: 5,  jour: 'Mercredi 10 juin', debut: '2026-06-10T13:00', fin: '2026-06-10T14:00', creneau: '13h00–14h00' },
  // ----- Jeudi 11 juin -----
  python:         { ordre: 6,  jour: 'Jeudi 11 juin',    debut: '2026-06-11T08:00', fin: '2026-06-11T09:00', creneau: '08h00–09h00' },
  techcom:        { ordre: 7,  jour: 'Jeudi 11 juin',    debut: '2026-06-11T09:10', fin: '2026-06-11T10:10', creneau: '09h10–10h10' },
  multimedia:     { ordre: 8,  jour: 'Jeudi 11 juin',    debut: '2026-06-11T10:20', fin: '2026-06-11T11:20', creneau: '10h20–11h20' },
  english:        { ordre: 9,  jour: 'Jeudi 11 juin',    debut: '2026-06-11T11:50', fin: '2026-06-11T12:50', creneau: '11h50–12h50' },
  entreprenariat: { ordre: 10, jour: 'Jeudi 11 juin',    debut: '2026-06-11T13:00', fin: '2026-06-11T14:00', creneau: '13h00–14h00' },
  droittravail:   { ordre: 11, jour: 'Jeudi 11 juin',    debut: '2026-06-11T14:10', fin: '2026-06-11T15:10', creneau: '14h10–15h10' },
  // ----- Vendredi 12 juin -----
  sqlserver:      { ordre: 12, jour: 'Vendredi 12 juin', debut: '2026-06-12T08:00', fin: '2026-06-12T09:00', creneau: '08h00–09h00' },
  ia:             { ordre: 13, jour: 'Vendredi 12 juin', debut: '2026-06-12T09:10', fin: '2026-06-12T10:10', creneau: '09h10–10h10' },
  poo:            { ordre: 14, jour: 'Vendredi 12 juin', debut: '2026-06-12T10:20', fin: '2026-06-12T11:20', creneau: '10h20–11h20' },
  siad:           { ordre: 15, jour: 'Vendredi 12 juin', debut: '2026-06-12T11:50', fin: '2026-06-12T12:50', creneau: '11h50–12h50' },
  secubd:         { ordre: 16, jour: 'Vendredi 12 juin', debut: '2026-06-12T13:00', fin: '2026-06-12T14:00', creneau: '13h00–14h00' },
  oracle:         { ordre: 17, jour: 'Vendredi 12 juin', debut: '2026-06-12T14:10', fin: '2026-06-12T15:10', creneau: '14h10–15h10' },
  // ----- Samedi 13 juin -----
  data:           { ordre: 18, jour: 'Samedi 13 juin',   debut: '2026-06-13T08:00', fin: '2026-06-13T09:00', creneau: '08h00–09h00' }
  // Remarque : « Chinois » n'est pas au programme de rattrapage → aucune date.
};

// Abréviation du jour pour les badges compacts.
const _JOUR_COURT = {
  'Mercredi 10 juin': 'Mer. 10 juin',
  'Jeudi 11 juin':    'Jeu. 11 juin',
  'Vendredi 12 juin': 'Ven. 12 juin',
  'Samedi 13 juin':   'Sam. 13 juin'
};

// Infos brutes du programme pour une matière (ou null si pas au programme).
function programmeInfo(matiereId) {
  return PROGRAMME_OFFICIEL[matiereId] || null;
}

// Libellé court par défaut, ex. « Jeu. 11 juin · 14h10–15h10 ».
function programmeLabel(matiereId) {
  const p = programmeInfo(matiereId);
  if (!p) return '';
  return (_JOUR_COURT[p.jour] || p.jour) + ' · ' + p.creneau;
}

// Les heures du programme sont exprimées en HEURE DU CAMEROUN (WAT = UTC+1,
// sans heure d'été). On les convertit en INSTANT ABSOLU (pas en heure locale à
// l'appareil) : le statut reste donc correct même si le téléphone est réglé sur
// un autre fuseau, tant que son heure (l'instant) est juste. WAT = UTC+1 → on
// retranche 1 h pour obtenir l'UTC correspondant.
const _WAT_OFFSET_H = 1;
function _programmeInstant(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(s || '');
  if (!m) return null;
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4] - _WAT_OFFSET_H, +m[5], 0));
}

// Statut d'une matière à l'instant 'now' :
//   'passe'   → l'épreuve est terminée (now > fin)
//   'encours' → l'épreuve se déroule maintenant (debut <= now <= fin)
//   'avenir'  → l'épreuve n'a pas encore eu lieu (now < debut)
//   null      → la matière n'a pas de date au programme (ex. Chinois)
function programmeStatus(matiereId, now) {
  const p = programmeInfo(matiereId);
  if (!p) return null;
  now = now || new Date();
  const debut = _programmeInstant(p.debut);
  const fin = _programmeInstant(p.fin);
  if (!debut || !fin) return null;
  if (now > fin) return 'passe';        // intervalle [debut, fin] : l'épreuve reste « en cours » jusqu'à la fin pile
  if (now >= debut) return 'encours';
  return 'avenir';
}

// L'horloge de l'appareil semble-t-elle implausible (réglée bien avant la
// session) ? Dans ce cas TOUTES les épreuves apparaîtraient à tort « à venir ».
// On ne signale que le cas « trop tôt » : après les rattrapages, un appareil à
// la bonne heure dépasse légitimement le 13 juin.
function horlogeImplausible(now) {
  now = now || new Date();
  return now.getTime() < Date.UTC(2026, 5, 1, 0, 0, 0); // avant le 1er juin 2026 UTC
}

// Export pour usage hors navigateur (tests Node) — sans effet dans le navigateur.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PROGRAMME_OFFICIEL, programmeInfo, programmeLabel, programmeStatus, horlogeImplausible };
}
