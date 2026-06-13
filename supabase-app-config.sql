-- ============================================================================
-- Révisions GL3A — CONFIG GÉNÉRALE DE L'APP (clé/valeur)
-- Clé 'home' = thème de l'accueil : { titre, sous_titre, planning_label }.
-- Permet au délégué de changer le contexte affiché à tous (ex. après les
-- rattrapages : « Préparation projet personnel ») depuis l'espace délégué.
-- À coller dans : Supabase → SQL Editor → New query → Run
-- (Nécessite public.is_admin() créé par supabase-schema.sql)
-- ============================================================================

create table if not exists public.app_config (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_config enable row level security;

-- Lecture : tout le monde (le thème d'accueil est public par nature).
drop policy if exists "app_config_lecture_tous" on public.app_config;
create policy "app_config_lecture_tous"
  on public.app_config for select using ( true );

-- Écriture : uniquement le délégué (admin).
drop policy if exists "app_config_insert_admin" on public.app_config;
create policy "app_config_insert_admin"
  on public.app_config for insert with check ( public.is_admin() );

drop policy if exists "app_config_update_admin" on public.app_config;
create policy "app_config_update_admin"
  on public.app_config for update using ( public.is_admin() ) with check ( public.is_admin() );

-- ============================================================================
-- FIN. L'upsert (clé 'home') depuis l'app utilise insert + update : les deux
-- policies admin ci-dessus sont nécessaires.
-- ============================================================================
