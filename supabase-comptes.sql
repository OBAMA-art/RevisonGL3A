-- ============================================================================
-- Révisions GL3A — COMPTES ÉTUDIANTS + SAUVEGARDE DES NOTES (optionnel)
-- L'étudiant peut créer un compte pour retrouver ses notes sur n'importe quel
-- appareil. Le délégué voit les PROFILS (pour redonner un matricule) mais
-- JAMAIS les notes (privées) ni les mots de passe (hachés par Supabase Auth).
-- À coller dans : Supabase → SQL Editor → New query → Run
-- (Nécessite public.is_admin() créé par supabase-schema.sql)
-- ============================================================================

-- 1) PROFILS ÉTUDIANTS (1 ligne par compte)
create table if not exists public.etudiants (
  user_id         uuid primary key references auth.users(id) on delete cascade,
  nom             text not null,
  prenoms         text not null,
  email           text not null,
  date_naissance  date,
  lieu_naissance  text default '',
  classe          text default '',
  matricule       text not null,
  annee_academique text default '',
  created_at      timestamptz not null default now()
);

-- Matricule unique (insensible à la casse)
create unique index if not exists etudiants_matricule_uniq
  on public.etudiants (upper(matricule));

alter table public.etudiants enable row level security;

-- Chacun voit SON profil ; le délégué voit tous les profils.
drop policy if exists "etudiants_select_own_or_admin" on public.etudiants;
create policy "etudiants_select_own_or_admin"
  on public.etudiants for select
  using ( auth.uid() = user_id or public.is_admin() );

-- Création : uniquement SON propre profil (compte connecté).
drop policy if exists "etudiants_insert_own" on public.etudiants;
create policy "etudiants_insert_own"
  on public.etudiants for insert
  with check ( auth.uid() = user_id );

-- Modification/suppression : UNIQUEMENT le propriétaire (moindre privilège :
-- le délégué consulte les profils mais ne les modifie pas).
drop policy if exists "etudiants_update_own_or_admin" on public.etudiants;
drop policy if exists "etudiants_update_own" on public.etudiants;
create policy "etudiants_update_own"
  on public.etudiants for update
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

drop policy if exists "etudiants_delete_own_or_admin" on public.etudiants;
drop policy if exists "etudiants_delete_own" on public.etudiants;
create policy "etudiants_delete_own"
  on public.etudiants for delete
  using ( auth.uid() = user_id );

-- 2) NOTES SYNCHRONISÉES (strictement privées — l'admin n'y a PAS accès)
create table if not exists public.notes_sync (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  store       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.notes_sync enable row level security;

drop policy if exists "notes_select_own" on public.notes_sync;
create policy "notes_select_own"
  on public.notes_sync for select using ( auth.uid() = user_id );

drop policy if exists "notes_insert_own" on public.notes_sync;
create policy "notes_insert_own"
  on public.notes_sync for insert with check ( auth.uid() = user_id );

drop policy if exists "notes_update_own" on public.notes_sync;
create policy "notes_update_own"
  on public.notes_sync for update
  using ( auth.uid() = user_id ) with check ( auth.uid() = user_id );

drop policy if exists "notes_delete_own" on public.notes_sync;
create policy "notes_delete_own"
  on public.notes_sync for delete using ( auth.uid() = user_id );

-- 3) RPC : CONNEXION PAR MATRICULE (matricule → email pour signInWithPassword)
--    Le mot de passe reste vérifié par Supabase Auth derrière.
create or replace function public.email_for_matricule(p_matricule text)
returns text
language sql stable security definer set search_path = public
as $$
  select email from public.etudiants
  where upper(matricule) = upper(trim(p_matricule))
  limit 1;
$$;

-- 4) RPC : MOT DE PASSE OUBLIÉ (matricule + date de naissance → email)
--    Double vérification pour qu'un camarade ne puisse pas déclencher un
--    reset avec un simple matricule connu de tous.
create or replace function public.email_for_reset(p_matricule text, p_date_naissance date)
returns text
language sql stable security definer set search_path = public
as $$
  select email from public.etudiants
  where upper(matricule) = upper(trim(p_matricule))
    and date_naissance = p_date_naissance
  limit 1;
$$;

-- Les RPC sont appelables par tous (anon) — nécessaire pour l'écran de
-- connexion ; elles ne révèlent que l'email, jamais les notes ni le profil.
-- RISQUE ASSUMÉ (design validé) : qui connaît un matricule peut retrouver
-- l'email associé (la connexion par matricule l'exige) ; le mot de passe
-- reste vérifié par Supabase Auth et le mail de reset ne part que vers
-- l'email du compte. Dans le cadre d'une promo, ce compromis est accepté.
grant execute on function public.email_for_matricule(text) to anon, authenticated;
grant execute on function public.email_for_reset(text, date) to anon, authenticated;

-- ============================================================================
-- FIN. Vérifie aussi dans le Dashboard :
--   1. Authentication → Providers → Email : activé (déjà fait pour l'admin).
--   2. (Conseillé) Authentication → Providers → Email → "Confirm email" :
--      - ON  = l'étudiant doit cliquer le lien reçu par mail avant de se
--              connecter (plus sûr, recommandé) ;
--      - OFF = inscription immédiate sans confirmation.
--   3. Authentication → URL Configuration → Site URL :
--      https://revisions-gl3a-production.up.railway.app
--      (pour que le lien de réinitialisation ramène vers l'app)
-- ============================================================================
