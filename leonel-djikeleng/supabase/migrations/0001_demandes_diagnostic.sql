-- Demandes d'appel diagnostic du site de Léonel Djikeleng.
-- Les visiteurs n'écrivent JAMAIS directement dans la table :
-- seule la fonction « demande-diagnostic » (clé service_role, côté serveur) insère.

create table if not exists public.demandes_diagnostic (
  id               uuid primary key default gen_random_uuid(),
  cree_le          timestamptz not null default now(),
  prenom           text not null check (char_length(btrim(prenom)) between 1 and 80),
  entreprise       text not null check (char_length(btrim(entreprise)) between 1 and 120),
  type_entreprise  text not null check (type_entreprise in ('Garage','Plomberie','Construction','Commerce','Services','Autre')),
  courriel         text not null check (char_length(courriel) between 3 and 255 and position('@' in courriel) > 1),
  telephone        text check (telephone is null or char_length(btrim(telephone)) between 7 and 40),
  tache_principale text not null check (char_length(btrim(tache_principale)) between 5 and 600),
  offre            text check (offre is null or offre in ('Essentiel','Signature','Vidéo publicitaire','Pilote automatique','Entretien mensuel')),
  consentement     boolean not null check (consentement = true),
  statut           text not null default 'nouvelle' check (statut in ('nouvelle','contactée','appel fixé','soumission envoyée','gagnée','perdue'))
);

-- RLS active, aucune politique pour anon/authenticated : aucun accès public (ni lecture, ni écriture).
alter table public.demandes_diagnostic enable row level security;
revoke all on table public.demandes_diagnostic from anon, authenticated;

create index if not exists demandes_diagnostic_cree_le_idx on public.demandes_diagnostic (cree_le desc);

-- Conservation de 12 mois (politique de confidentialité).
-- À activer une fois l'extension pg_cron disponible dans le projet :
-- select cron.schedule('purge-demandes-12-mois', '17 3 * * *',
--   $$delete from public.demandes_diagnostic where cree_le < now() - interval '12 months' and statut not in ('gagnée')$$);
