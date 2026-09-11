alter table public.experiences
  add column if not exists contextual_heart_count integer not null default 0
  check (contextual_heart_count >= 0);
