-- ============================================================================
-- Révisions GL3A — ANNONCES D'EXAMEN (templates du délégué)
-- Le délégué choisit un type d'examen du planning annuel (SN1, SN2,
-- Rattrapage CC, Rattrapage SN1&SN2 ou annonce libre), renseigne les dates
-- et publie : l'annonce s'affiche sur l'accueil de tous les étudiants.
-- À coller dans : Supabase → SQL Editor → New query → Run
-- (Nécessite public.is_admin() créé par supabase-schema.sql)
-- ============================================================================

create table if not exists public.annonces (
  id          uuid primary key default gen_random_uuid(),
  type        text not null default 'libre'
              check (type in ('sn1','sn2','rattrapage_cc','rattrapage_sn','libre')),
  titre       text not null,
  message     text default '',
  date_debut  date,
  date_fin    date,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists annonces_active_idx on public.annonces (active, created_at desc);

alter table public.annonces enable row level security;

-- Lecture : tout le monde (l'annonce est publique par nature).
drop policy if exists "annonces_lecture_tous" on public.annonces;
create policy "annonces_lecture_tous"
  on public.annonces for select using ( true );

-- Écriture : uniquement le délégué (admin).
drop policy if exists "annonces_insert_admin" on public.annonces;
create policy "annonces_insert_admin"
  on public.annonces for insert with check ( public.is_admin() );

drop policy if exists "annonces_update_admin" on public.annonces;
create policy "annonces_update_admin"
  on public.annonces for update using ( public.is_admin() ) with check ( public.is_admin() );

drop policy if exists "annonces_delete_admin" on public.annonces;
create policy "annonces_delete_admin"
  on public.annonces for delete using ( public.is_admin() );

-- ============================================================================
-- FIN. L'app gère « une seule annonce active à la fois » : publier une
-- nouvelle annonce désactive automatiquement la précédente.
-- ============================================================================
