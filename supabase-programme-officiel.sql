-- ============================================================================
-- Révisions GL3A — PROGRAMME OFFICIEL DES RATTRAPAGES (session 10–13 juin 2026)
-- Renseigne la date/horaire d'examen de chaque matière. Visible par tous.
-- Auto-suffisant : crée la table + les règles si besoin, puis insère le programme.
-- À coller dans : Supabase → SQL Editor → New query → Run
-- ============================================================================

-- 1) Table de config (au cas où pas encore créée)
create table if not exists public.matiere_config (
  matiere_id  text primary key,
  ue          text,
  exam_label  text default '',
  ordre       int  default 0,
  updated_at  timestamptz default now()
);
alter table public.matiere_config enable row level security;

drop policy if exists "config_read_all" on public.matiere_config;
create policy "config_read_all" on public.matiere_config for select using ( true );
drop policy if exists "config_insert_admin" on public.matiere_config;
create policy "config_insert_admin" on public.matiere_config for insert with check ( public.is_admin() );
drop policy if exists "config_update_admin" on public.matiere_config;
create policy "config_update_admin" on public.matiere_config for update using ( public.is_admin() ) with check ( public.is_admin() );

-- 2) Programme officiel (ordre = chronologie de passage)
insert into public.matiere_config (matiere_id, exam_label, ordre) values
  -- Mercredi 10 juin
  ('j2e',            'Mer. 10 juin · 08h00-09h00', 1),
  ('mobile',         'Mer. 10 juin · 09h10-10h10', 2),
  ('bigdata',        'Mer. 10 juin · 10h20-11h20', 3),
  ('web',            'Mer. 10 juin · 11h50-12h50', 4),
  ('sig',            'Mer. 10 juin · 13h00-14h00', 5),
  -- Jeudi 11 juin
  ('python',         'Jeu. 11 juin · 08h00-09h00', 6),
  ('techcom',        'Jeu. 11 juin · 09h10-10h10', 7),
  ('multimedia',     'Jeu. 11 juin · 10h20-11h20', 8),
  ('english',        'Jeu. 11 juin · 11h50-12h50', 9),
  ('entreprenariat', 'Jeu. 11 juin · 13h00-14h00', 10),
  ('droittravail',   'Jeu. 11 juin · 14h10-15h10', 11),
  -- Vendredi 12 juin
  ('sqlserver',      'Ven. 12 juin · 08h00-09h00', 12),
  ('ia',             'Ven. 12 juin · 09h10-10h10', 13),
  ('poo',            'Ven. 12 juin · 10h20-11h20', 14),
  ('siad',           'Ven. 12 juin · 11h50-12h50', 15),
  ('secubd',         'Ven. 12 juin · 13h00-14h00', 16),
  ('oracle',         'Ven. 12 juin · 14h10-15h10', 17),
  -- Samedi 13 juin
  ('data',           'Sam. 13 juin · 08h00-09h00', 18)
on conflict (matiere_id) do update
  set exam_label = excluded.exam_label,
      ordre      = excluded.ordre,
      updated_at = now();

-- Remarque : "Chinois" n'apparaît pas dans le planning de rattrapage → pas de date.
-- ============================================================================
