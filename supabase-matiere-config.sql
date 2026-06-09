-- ============================================================================
-- Révisions GL3A — Table de configuration des matières (classement par l'admin)
-- Permet au délégué d'organiser les matières (UE + horaire d'examen) selon le
-- programme officiel de rattrapage. Lecture publique, écriture admin uniquement.
-- À coller dans : Supabase → SQL Editor → New query → Run
-- ============================================================================

create table if not exists public.matiere_config (
  matiere_id  text primary key,         -- ex: sig, poo, ia...
  ue          text,                      -- UE forcée (sinon UE par défaut de l'app)
  exam_label  text default '',           -- ex: "Lundi 15 juin · 08h-10h"
  ordre       int  default 0,            -- ordre d'affichage dans l'UE
  updated_at  timestamptz default now()
);

alter table public.matiere_config enable row level security;

-- Lecture : tout le monde (les étudiants voient le programme officiel)
drop policy if exists "config_read_all" on public.matiere_config;
create policy "config_read_all"
  on public.matiere_config for select using ( true );

-- Écriture : seul l'admin (upsert = insert + update)
drop policy if exists "config_insert_admin" on public.matiere_config;
create policy "config_insert_admin"
  on public.matiere_config for insert with check ( public.is_admin() );

drop policy if exists "config_update_admin" on public.matiere_config;
create policy "config_update_admin"
  on public.matiere_config for update using ( public.is_admin() ) with check ( public.is_admin() );

drop policy if exists "config_delete_admin" on public.matiere_config;
create policy "config_delete_admin"
  on public.matiere_config for delete using ( public.is_admin() );

-- ============================================================================
-- FIN. Après le Run, l'onglet « 📅 Programme » apparaîtra dans l'Espace délégué.
-- ============================================================================
