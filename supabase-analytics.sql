-- ============================================================================
-- Révisions GL3A — Analytics détaillées (évolution, matières, appareils, quiz)
-- Étend le compteur de visiteurs. Données anonymes uniquement (id d'appareil,
-- type d'appareil, matière consultée). Aucune donnée personnelle.
-- À coller dans : Supabase → SQL Editor → New query → Run
-- (suppose que la table public.visits et public.is_admin() existent déjà)
-- ============================================================================

-- 1) Colonne "appareil" sur les visites (mobile / desktop)
alter table public.visits add column if not exists ua text;

-- 2) Table d'événements (matière ouverte, quiz terminé…)
create table if not exists public.events (
  id          bigint generated always as identity primary key,
  visitor_id  text,
  type        text not null,         -- 'matiere' | 'quiz_done'
  label       text,                  -- id de matière (ex: 'sig')
  created_at  timestamptz not null default now()
);
create index if not exists events_type_idx  on public.events (type);
create index if not exists events_label_idx on public.events (label);

alter table public.events enable row level security;
drop policy if exists "events_insert_all" on public.events;
create policy "events_insert_all" on public.events for insert with check ( true );
drop policy if exists "events_select_admin" on public.events;
create policy "events_select_admin" on public.events for select using ( public.is_admin() );

-- 3) Fonction d'agrégats : renvoie tout le tableau de bord en un seul appel
create or replace function public.analytics_overview()
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'total',        (select count(*) from visits),
    'unique',       (select count(distinct visitor_id) from visits),
    'today',        (select count(*) from visits where day = current_date),
    'today_unique', (select count(distinct visitor_id) from visits where day = current_date),
    'by_day', (
      select coalesce(json_agg(t order by t.day), '[]'::json) from (
        select day, count(*) as visits, count(distinct visitor_id) as uniques
        from visits where day >= current_date - 13 group by day
      ) t
    ),
    'top_matieres', (
      select coalesce(json_agg(m), '[]'::json) from (
        select label, count(*) as n from events
        where type = 'matiere' and label is not null
        group by label order by n desc limit 8
      ) m
    ),
    'devices', (
      select json_build_object(
        'mobile',  count(*) filter (where ua ~* 'mobile|android|iphone|ipad|ipod'),
        'desktop', count(*) filter (where ua is not null and ua !~* 'mobile|android|iphone|ipad|ipod')
      ) from visits
    ),
    'quiz_done', (select count(*) from events where type = 'quiz_done')
  );
$$;

grant execute on function public.analytics_overview() to anon, authenticated;

-- ============================================================================
-- FIN. Le tableau de bord enrichi apparaîtra dans l'Espace délégué.
-- ============================================================================
