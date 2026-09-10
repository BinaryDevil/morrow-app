create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  place_id text not null check (char_length(trim(place_id)) > 0),
  photo_url text,
  caption text check (caption is null or char_length(caption) <= 500),
  tags text[] not null default '{}',
  visibility text not null check (visibility in ('followers', 'private')),
  created_at timestamptz not null default now()
);

alter table public.experiences enable row level security;

create policy "Users can read their own experiences"
  on public.experiences for select to authenticated
  using ((select auth.uid()) = author_id);

create policy "Users can create their own experiences"
  on public.experiences for insert to authenticated
  with check ((select auth.uid()) = author_id);

insert into storage.buckets (id, name, public)
values ('experience-photos', 'experience-photos', false)
on conflict (id) do nothing;

create policy "Users can upload their own experience photos"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'experience-photos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "Users can read their own experience photos"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'experience-photos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
