-- ============================================================================
-- Révisions GL3A — BIBLIOTHÈQUE DE COURS (le « cerveau » du Prof IA, RAG)
-- Stocke des fiches de cours par matière, avec recherche plein-texte FR.
-- Le Prof IA retrouve les fiches pertinentes et répond EN S'APPUYANT dessus.
-- À coller dans : Supabase → SQL Editor → New query → Run
-- (puis exécuter supabase-cours-seed.sql pour pré-remplir avec les 18 matières)
-- ============================================================================

create table if not exists public.cours (
  id          uuid primary key default gen_random_uuid(),
  matiere_id  text not null,
  titre       text not null,
  contenu     text not null,
  source      text default '',
  ordre       int  default 0,
  created_at  timestamptz not null default now(),
  -- index plein-texte français généré automatiquement (titre + contenu)
  search      tsvector generated always as
                (to_tsvector('french', coalesce(titre,'') || ' ' || coalesce(contenu,''))) stored
);

create index if not exists cours_matiere_idx on public.cours (matiere_id);
create index if not exists cours_search_idx  on public.cours using gin (search);

alter table public.cours enable row level security;

-- Lecture : ouverte (le contenu de cours n'est pas secret).
drop policy if exists "cours_read_all" on public.cours;
create policy "cours_read_all" on public.cours for select using ( true );

-- Écriture : réservée au délégué (admin) — il valide ce qui entre.
drop policy if exists "cours_insert_admin" on public.cours;
create policy "cours_insert_admin" on public.cours for insert with check ( public.is_admin() );
drop policy if exists "cours_update_admin" on public.cours;
create policy "cours_update_admin" on public.cours for update using ( public.is_admin() ) with check ( public.is_admin() );
drop policy if exists "cours_delete_admin" on public.cours;
create policy "cours_delete_admin" on public.cours for delete using ( public.is_admin() );

-- Recherche classée : renvoie les fiches d'une matière les plus pertinentes
-- pour une question (ts_rank), pour nourrir le Prof IA.
-- IMPORTANT : on transforme la requête en OU (| ) plutôt qu'en ET (&) — une
-- vraie question (« explique-moi ce qu'est un tablespace ») ne doit pas exiger
-- que TOUS les mots soient dans la même fiche ; ts_rank classe ensuite par
-- pertinence (la fiche qui contient « tablespace » remonte en tête).
create or replace function public.cours_search(p_matiere text, p_query text, p_limit int default 4)
returns table(id uuid, titre text, contenu text, source text)
language sql stable security definer set search_path = public
as $$
  with q as (
    select nullif(
             replace(websearch_to_tsquery('french', coalesce(p_query, ''))::text, '&', '|'),
             ''
           )::tsquery as tsq
  )
  select c.id, c.titre, c.contenu, c.source
  from public.cours c, q
  where c.matiere_id = p_matiere
    and q.tsq is not null
    and c.search @@ q.tsq
  order by ts_rank(c.search, q.tsq) desc, c.ordre asc
  limit greatest(1, least(coalesce(p_limit, 4), 8));
$$;

grant execute on function public.cours_search(text, text, int) to anon, authenticated, service_role;

-- ============================================================================
-- FIN. Ensuite : exécuter supabase-cours-seed.sql (pré-remplit la bibliothèque
-- avec les notions des 18 matières déjà dans l'app). Le délégué peut enrichir
-- via l'espace admin (« 📚 Bibliothèque de cours »).
-- ============================================================================
