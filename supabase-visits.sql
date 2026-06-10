-- ============================================================================
-- Révisions GL3A — Compteur de visiteurs (remplace Vercel Analytics)
-- Confidentialité : on ne stocke qu'un identifiant anonyme d'appareil + le jour.
-- Insertion ouverte à tous, lecture des lignes réservée à l'admin, et une
-- fonction agrégée (visit_stats) renvoie uniquement des NOMBRES, visible par tous.
-- À coller dans : Supabase → SQL Editor → New query → Run
-- ============================================================================

create table if not exists public.visits (
  id          bigint generated always as identity primary key,
  visitor_id  text,                         -- id anonyme stocké côté navigateur
  day         date not null default current_date,
  created_at  timestamptz not null default now()
);
create index if not exists visits_visitor_day_idx on public.visits (visitor_id, day);
create index if not exists visits_day_idx on public.visits (day);

alter table public.visits enable row level security;

-- N'importe qui peut enregistrer une visite
drop policy if exists "visits_insert_all" on public.visits;
create policy "visits_insert_all" on public.visits for insert with check ( true );

-- Lecture des lignes brutes : admin uniquement (le grand public ne voit pas les détails)
drop policy if exists "visits_select_admin" on public.visits;
create policy "visits_select_admin" on public.visits for select using ( public.is_admin() );

-- Fonction agrégée : ne renvoie que des compteurs (aucune donnée perso)
create or replace function public.visit_stats()
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'total',        (select count(*) from public.visits),
    'unique',       (select count(distinct visitor_id) from public.visits),
    'today',        (select count(*) from public.visits where day = current_date),
    'today_unique', (select count(distinct visitor_id) from public.visits where day = current_date)
  );
$$;

grant execute on function public.visit_stats() to anon, authenticated;

-- ============================================================================
-- FIN. Le compteur apparaîtra en haut de l'Espace délégué.
-- ============================================================================
