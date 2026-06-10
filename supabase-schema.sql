-- ============================================================================
-- Révisions GL3A — Schéma Supabase (base partagée d'épreuves + modération)
-- À coller dans : Supabase → SQL Editor → New query → Run
-- ============================================================================

-- 1) TABLE DES ÉPREUVES PARTAGÉES
create table if not exists public.epreuves (
  id           uuid primary key default gen_random_uuid(),
  matiere_id   text not null,                 -- poo, mobile, data, web, ia, english, secubd, bigdata
  titre        text not null,
  source       text default '',
  questions    jsonb not null default '[]'::jsonb,  -- [{numero, enonce, correction, bareme}]
  signature    text default '',               -- pour la détection de doublon
  status       text not null default 'pending'    -- 'pending' | 'approved' | 'rejected'
                 check (status in ('pending','approved','rejected')),
  submitted_by text default '',               -- pseudo/email facultatif du contributeur
  created_at   timestamptz not null default now(),
  reviewed_at  timestamptz
);

create index if not exists epreuves_matiere_status_idx
  on public.epreuves (matiere_id, status);

-- 2) LISTE DES ADMINS (toi seul pour l'instant)
--    Remplace 'admin@example.com' par l'email du compte admin (Authentication → Users).
create table if not exists public.admins (
  email text primary key
);

insert into public.admins (email) values ('admin@example.com')
  on conflict (email) do nothing;

-- Helper : l'utilisateur courant est-il admin ?
create or replace function public.is_admin()
returns boolean
language sql stable
as $$
  select exists (
    select 1 from public.admins a
    where a.email = (auth.jwt() ->> 'email')
  );
$$;

-- 3) ROW LEVEL SECURITY
alter table public.epreuves enable row level security;

-- Lecture : tout le monde voit les épreuves VALIDÉES ; l'admin voit tout.
drop policy if exists "lecture_approved_ou_admin" on public.epreuves;
create policy "lecture_approved_ou_admin"
  on public.epreuves for select
  using ( status = 'approved' or public.is_admin() );

-- Proposition : n'importe qui (même anonyme) peut INSÉRER, mais en 'pending' uniquement.
drop policy if exists "insert_pending_pour_tous" on public.epreuves;
create policy "insert_pending_pour_tous"
  on public.epreuves for insert
  with check ( status = 'pending' );

-- Modération : seul l'admin peut MODIFIER (valider/rejeter).
drop policy if exists "update_admin_only" on public.epreuves;
create policy "update_admin_only"
  on public.epreuves for update
  using ( public.is_admin() )
  with check ( public.is_admin() );

-- Suppression : seul l'admin.
drop policy if exists "delete_admin_only" on public.epreuves;
create policy "delete_admin_only"
  on public.epreuves for delete
  using ( public.is_admin() );

-- 4) (FACULTATIF) Sécurité renforcée : empêcher un contributeur de s'auto-valider
--    en forçant tout INSERT à rester 'pending' même si le payload triche.
create or replace function public.force_pending()
returns trigger language plpgsql as $$
begin
  if not public.is_admin() then
    new.status := 'pending';
    new.reviewed_at := null;
  end if;
  return new;
end; $$;

drop trigger if exists trg_force_pending on public.epreuves;
create trigger trg_force_pending
  before insert on public.epreuves
  for each row execute function public.force_pending();

-- ============================================================================
-- FIN. Après le Run :
--   1. Active l'auth Email/Password : Authentication → Providers → Email (ON).
--   2. Crée TON compte admin : Authentication → Users → Add user → ton email + mdp
--      (le MÊME email que dans la table admins ci-dessus).
--   3. Donne-moi : Project URL + clé "anon public" (Settings → API).
-- ============================================================================
