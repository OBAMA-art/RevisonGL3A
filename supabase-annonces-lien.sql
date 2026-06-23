-- ============================================================================
-- Révisions GL3A — LIEN CLIQUABLE dans les annonces
-- Ajoute à une annonce un lien optionnel qui amène l'étudiant directement
-- vers tout un semestre, ou vers une matière précise.
--   lien_type   : 'url' | 'semestre' | 'matiere' (NULL = aucun lien)
--   lien_valeur : URL https:// (si url) | 'S5'/'S6' (si semestre) | id matière (si matiere)
-- À coller dans : Supabase → SQL Editor → New query → Run
-- (Sans danger : colonnes nullables, les annonces existantes restent valides.)
-- ============================================================================

alter table public.annonces add column if not exists lien_type   text;
alter table public.annonces add column if not exists lien_valeur text;

-- Rien d'autre à changer : les policies RLS existantes de la table annonces
-- (lecture publique, écriture admin) couvrent ces nouvelles colonnes.
-- ============================================================================
