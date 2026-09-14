create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  emoji text not null default '🎁',
  birthday date,
  palette text not null default 'morango',
  stickers jsonb not null default '[]'::jsonb,
  loves text[] not null default '{}',
  dislikes text[] not null default '{}',
  plenty text[] not null default '{}',
  care text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists profile_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  icon text not null default 'gift',
  label text not null,
  value text not null default '',
  hint text not null default '',
  pending boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists profile_items_profile_idx on profile_items (profile_id, position);
create unique index if not exists profiles_name_idx on profiles (lower(name));

alter table profiles enable row level security;
alter table profile_items enable row level security;
