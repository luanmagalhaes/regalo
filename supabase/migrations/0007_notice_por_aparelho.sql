drop table if exists birthday_notices;

create table birthday_notices (
  target_id uuid not null references profiles(id) on delete cascade,
  year integer not null,
  endpoint text not null,
  sent_at timestamptz not null default now(),
  primary key (target_id, year, endpoint)
);

alter table birthday_notices enable row level security;
