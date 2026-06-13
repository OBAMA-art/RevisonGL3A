-- ============================================================================
-- Révisions GL3A — FONCTIONS IA (Gemini) : quiz des épreuves + quota partagé
-- À coller dans : Supabase → SQL Editor → New query → Run
-- (à exécuter AVANT de déployer l'Edge Function gl3a-ia)
-- ============================================================================

-- 1) QCM extraits par l'IA, rattachés aux épreuves partagées.
--    Une fois l'épreuve validée par le délégué, ses QCM rejoignent le quiz
--    de la matière chez tout le monde.
ALTER TABLE public.epreuves
  ADD COLUMN IF NOT EXISTS quiz jsonb NOT NULL DEFAULT '[]'::jsonb;

-- 2) QUOTA IA : compteur d'appels par appareil et par jour.
--    Protège le palier gratuit de Gemini (partagé par toute la promo).
create table if not exists public.ia_usage (
  visitor_id text not null,
  day        date not null default current_date,
  n          int  not null default 0,
  primary key (visitor_id, day)
);

alter table public.ia_usage enable row level security;
-- AUCUNE policy : ni lecture ni écriture pour anon/authenticated.
-- Seule l'Edge Function (clé service role, qui ignore la RLS) y accède.

-- Ceinture + bretelles : aucun privilège direct sur la table pour l'app.
revoke all on table public.ia_usage from public, anon, authenticated;

-- 3) Compteur ATOMIQUE : incrémente et renvoie le nombre d'appels du jour.
create or replace function public.ia_consume(p_visitor text)
returns int
language plpgsql security definer set search_path = public
as $$
declare v_n int;
begin
  if p_visitor is null or length(p_visitor) < 8 or length(p_visitor) > 80 then
    raise exception 'visitor invalide';
  end if;
  insert into public.ia_usage (visitor_id, day, n)
  values (p_visitor, current_date, 1)
  on conflict (visitor_id, day) do update set n = ia_usage.n + 1
  returning n into v_n;
  return v_n;
end;
$$;

-- 3bis) REMBOURSEMENT : si l'appel IA échoue côté serveur (Gemini saturé…),
-- on rend son crédit à l'étudiant.
create or replace function public.ia_refund(p_visitor text)
returns void
language sql security definer set search_path = public
as $$
  update public.ia_usage set n = greatest(n - 1, 0)
  where visitor_id = p_visitor and day = current_date;
$$;

-- Réservées au service role (l'Edge Function) — pas d'appel direct depuis l'app.
revoke execute on function public.ia_consume(text) from public, anon, authenticated;
revoke execute on function public.ia_refund(text)  from public, anon, authenticated;
grant execute on function public.ia_consume(text) to service_role;
grant execute on function public.ia_refund(text)  to service_role;

-- 4) Ménage automatique facultatif : les compteurs de plus de 7 jours ne
--    servent plus à rien — tu peux les purger de temps en temps avec :
--    delete from public.ia_usage where day < current_date - 7;
-- ============================================================================
