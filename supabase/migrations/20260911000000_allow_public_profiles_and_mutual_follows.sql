drop policy "Users can read their own profile" on public.profiles;

create policy "Users can read public profiles and their own profile"
  on public.profiles for select to authenticated
  using (is_public or (select auth.uid()) = id);

drop policy "Users can read who they follow" on public.follows;

create policy "Users can read follow relationships involving them"
  on public.follows for select to authenticated
  using (
    (select auth.uid()) = follower_id
    or (select auth.uid()) = followed_id
  );
