alter table public.experiences
  add column if not exists location_disclosure text not null default 'area'
  check (location_disclosure in ('area', 'exact'));

create table if not exists public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_profile_id uuid references public.profiles(id) on delete cascade,
  target_experience_id uuid references public.experiences(id) on delete cascade,
  reason text not null check (char_length(trim(reason)) between 1 and 1000),
  created_at timestamptz not null default now(),
  check ((target_profile_id is null) <> (target_experience_id is null))
);

alter table public.blocks enable row level security;
alter table public.reports enable row level security;

create policy "People can read blocks involving them"
  on public.blocks for select to authenticated
  using ((select auth.uid()) = blocker_id or (select auth.uid()) = blocked_id);

create policy "People can create their own blocks"
  on public.blocks for insert to authenticated
  with check ((select auth.uid()) = blocker_id);

create policy "People can submit their own reports"
  on public.reports for insert to authenticated
  with check ((select auth.uid()) = reporter_id);

create or replace function public.are_people_blocked(first_person_id uuid, second_person_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select first_person_id = auth.uid() and exists (
    select 1 from public.blocks
    where (blocker_id = first_person_id and blocked_id = second_person_id)
       or (blocker_id = second_person_id and blocked_id = first_person_id)
  );
$$;

create or replace function public.block_person(person_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'Authentication is required'; end if;
  if auth.uid() = person_id then raise exception 'You cannot block your own profile'; end if;

  insert into public.blocks (blocker_id, blocked_id)
  values (auth.uid(), person_id)
  on conflict do nothing;

  delete from public.follows
  where (follower_id = auth.uid() and followed_id = person_id)
     or (follower_id = person_id and followed_id = auth.uid());
end;
$$;

drop policy if exists "Users can read public profiles and their own profile" on public.profiles;
create policy "People can read visible unblocked profiles"
  on public.profiles for select to authenticated
  using (
    (is_public or (select auth.uid()) = id)
    and not public.are_people_blocked((select auth.uid()), id)
  );

drop policy if exists "Users can read follow relationships involving them" on public.follows;
create policy "People can read unblocked follow relationships involving them"
  on public.follows for select to authenticated
  using (
    ((select auth.uid()) = follower_id or (select auth.uid()) = followed_id)
    and not public.are_people_blocked((select auth.uid()), case when (select auth.uid()) = follower_id then followed_id else follower_id end)
  );

drop policy if exists "Users can follow accounts for themselves" on public.follows;
create policy "People can follow visible unblocked accounts"
  on public.follows for insert to authenticated
  with check (
    (select auth.uid()) = follower_id
    and exists (select 1 from public.profiles where id = followed_id and is_public)
    and not public.are_people_blocked((select auth.uid()), followed_id)
  );

drop policy if exists "Users can read experiences shared with them" on public.experiences;
create policy "People can read unblocked experiences shared with them"
  on public.experiences for select to authenticated
  using (
    not public.are_people_blocked((select auth.uid()), author_id)
    and (
      (select auth.uid()) = author_id
      or (
        visibility = 'followers'
        and exists (
          select 1 from public.profiles
          where id = experiences.author_id
            and is_public
        )
        and exists (
          select 1 from public.follows
          where follower_id = (select auth.uid())
            and followed_id = experiences.author_id
        )
      )
    )
  );

drop policy if exists "Users can read experience photos shared with them" on storage.objects;
create policy "People can read unblocked experience photos shared with them"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'experience-photos'
    and exists (
      select 1 from public.experiences
      where photo_path = name
        and (storage.foldername(name))[1] = experiences.author_id::text
    )
  );
