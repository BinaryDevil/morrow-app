create table if not exists public.experience_blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  experience_id uuid not null references public.experiences(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, experience_id)
);

alter table public.experience_blocks enable row level security;

create policy "People can read their experience blocks"
  on public.experience_blocks for select to authenticated
  using ((select auth.uid()) = blocker_id);

create policy "People can block experiences for themselves"
  on public.experience_blocks for insert to authenticated
  with check (
    (select auth.uid()) = blocker_id
    and exists (
      select 1 from public.experiences
      where id = experience_id
        and author_id <> (select auth.uid())
    )
  );

create policy "People can unblock experiences for themselves"
  on public.experience_blocks for delete to authenticated
  using ((select auth.uid()) = blocker_id);

drop policy "People can read unblocked experiences shared with them" on public.experiences;
create policy "People can read unblocked experiences shared with them"
  on public.experiences for select to authenticated
  using (
    not public.are_people_blocked((select auth.uid()), author_id)
    and not exists (
      select 1 from public.experience_blocks
      where blocker_id = (select auth.uid())
        and experience_id = experiences.id
    )
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
