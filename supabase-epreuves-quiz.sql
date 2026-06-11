-- Ajout du quiz extrait par l'IA aux épreuves.
-- À exécuter une fois dans l'éditeur SQL Supabase.
--
-- La colonne `quiz` stocke les QCM générés à partir de l'épreuve scannée
-- (format { q, options[], reponse, explication }), qui viennent compléter
-- le quiz interactif de la matière une fois l'épreuve validée.

ALTER TABLE epreuves
  ADD COLUMN IF NOT EXISTS quiz jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Rien d'autre à changer : les règles RLS existantes (lecture des lignes
-- 'approved' par tous, insertion 'pending' par les anonymes, modération par
-- l'admin authentifié) s'appliquent telles quelles à cette nouvelle colonne.
