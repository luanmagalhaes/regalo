alter table profiles add column if not exists pin_hash text;
alter table profiles add column if not exists pin_fails integer not null default 0;
alter table profiles add column if not exists pin_locked_until timestamptz;
