create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  followed_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followed_id),
  check (follower_id <> followed_id)
);

alter table public.follows enable row level security;

create policy "Users can read who they follow"
  on public.follows for select to authenticated
  using ((select auth.uid()) = follower_id);

create policy "Users can follow accounts for themselves"
  on public.follows for insert to authenticated
  with check ((select auth.uid()) = follower_id);

create policy "Users can unfollow accounts for themselves"
  on public.follows for delete to authenticated
  using ((select auth.uid()) = follower_id);

alter table public.experiences add column photo_path text;

alter table public.experiences add constraint experiences_require_photo_or_caption
  check (
    nullif(trim(photo_path), '') is not null
    or nullif(trim(photo_url), '') is not null
    or nullif(trim(caption), '') is not null
  );

drop policy "Users can read their own experiences" on public.experiences;

create policy "Users can read experiences shared with them"
  on public.experiences for select to authenticated
  using (
    (select auth.uid()) = author_id
    or (
      visibility = 'followers'
      and exists (
        select 1 from public.follows
        where follower_id = (select auth.uid())
          and followed_id = experiences.author_id
      )
    )
  );

drop policy "Users can read their own experience photos" on storage.objects;

create policy "Users can read experience photos shared with them"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'experience-photos'
    and exists (
      select 1 from public.experiences
      where photo_path = name
        and (storage.foldername(name))[1] = experiences.author_id::text
        and (
          author_id = (select auth.uid())
          or (
            visibility = 'followers'
            and exists (
              select 1 from public.follows
              where follower_id = (select auth.uid())
                and followed_id = experiences.author_id
            )
          )
        )
    )
  );
