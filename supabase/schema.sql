-- ════════════════════════════════════════════════════════════════
-- Esquema de la base de datos — Boda Albert & Yuly
-- Ejecuta este archivo en Supabase → SQL Editor
-- ════════════════════════════════════════════════════════════════

-- Extensión para generar ids
create extension if not exists "pgcrypto";

-- ── Tabla única de invitados ────────────────────────────────────
create table if not exists public.guests (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  phone          text,
  email          text,
  "group"        text not null default 'otros'
                 check ("group" in ('familia','amigos','trabajo','otros')),
  allowed_guests smallint not null default 1 check (allowed_guests between 1 and 40),
  adults         smallint not null default 1 check (adults between 0 and 20),
  children       smallint not null default 0 check (children between 0 and 20),
  token          text not null unique,
  status         text not null default 'pending'
                 check (status in ('pending','confirmed','declined')),
  sent           boolean not null default false,
  companions     smallint,
  message        text,
  dietary        text,
  confirmed_at   timestamptz,
  arrived        boolean not null default false,
  created_at     timestamptz not null default now()
);

create index if not exists guests_token_idx  on public.guests (token);
create index if not exists guests_status_idx on public.guests (status);

-- ── Row Level Security ──────────────────────────────────────────
-- La app accede a `guests` SOLO desde el servidor con la SERVICE ROLE
-- (que bypassa RLS). Por eso bloqueamos todo acceso con la anon key:
-- ningún cliente puede leer ni escribir la tabla directamente.
alter table public.guests enable row level security;

-- (Sin políticas para anon/authenticated => acceso denegado por defecto.)
-- Si en el futuro quisieras lectura pública por token, se añadiría aquí
-- una policy específica. Por ahora, máxima privacidad.

-- ── Storage: bucket del álbum colaborativo ──────────────────────
-- Crea un bucket PÚBLICO llamado "album" (para poder mostrar las fotos).
-- Las subidas se hacen desde el servidor con service role.
insert into storage.buckets (id, name, public)
values ('album', 'album', true)
on conflict (id) do nothing;

-- Permitir lectura pública de las fotos del álbum
create policy if not exists "album lectura publica"
  on storage.objects for select
  using (bucket_id = 'album');
