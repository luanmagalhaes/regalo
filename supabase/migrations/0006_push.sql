create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete set null,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

create table if not exists birthday_notices (
  target_id uuid not null references profiles(id) on delete cascade,
  year integer not null,
  sent_at timestamptz not null default now(),
  primary key (target_id, year)
);

alter table push_subscriptions enable row level security;
alter table birthday_notices enable row level security;
