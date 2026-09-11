create table if not exists public.beta_cohort_members (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  invited_at timestamptz not null default now()
);

create table if not exists public.beta_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null check (event_type in (
    'app_opened',
    'experience_viewed',
    'place_saved',
    'experience_shared',
    'person_followed'
  )),
  occurred_at timestamptz not null default now()
);

create index if not exists beta_events_user_occurred_at_index
  on public.beta_events (user_id, occurred_at);

alter table public.beta_cohort_members enable row level security;
alter table public.beta_events enable row level security;

create or replace function public.record_beta_event(event_type text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication is required';
  end if;

  if event_type not in (
    'app_opened',
    'experience_viewed',
    'place_saved',
    'experience_shared',
    'person_followed'
  ) then
    raise exception 'Unknown beta event type';
  end if;

  if not exists (
    select 1 from public.beta_cohort_members
    where user_id = auth.uid()
  ) then
    return;
  end if;

  insert into public.beta_events (user_id, event_type)
  values (auth.uid(), event_type);
end;
$$;

revoke execute on function public.record_beta_event(text) from public;
grant execute on function public.record_beta_event(text) to authenticated;

create table if not exists public.beta_metric_thresholds (
  metric text primary key check (metric in (
    'week_four_retention',
    'week_four_meaningful_discovery_engagement'
  )),
  minimum_rate numeric not null check (minimum_rate >= 0 and minimum_rate <= 1)
);

alter table public.beta_metric_thresholds enable row level security;

create or replace view public.beta_weekly_activity as
select
  cohort.user_id,
  floor(extract(epoch from (event.occurred_at - cohort.invited_at)) / 604800)::integer + 1 as cohort_week,
  count(*) filter (where event.event_type = 'app_opened') as opens,
  count(*) filter (where event.event_type <> 'app_opened') as meaningful_discovery_actions,
  count(distinct event.event_type) filter (where event.event_type <> 'app_opened') as meaningful_discovery_action_types
from public.beta_cohort_members cohort
left join public.beta_events event
  on event.user_id = cohort.user_id
  and event.occurred_at >= cohort.invited_at
group by cohort.user_id, cohort.invited_at, floor(extract(epoch from (event.occurred_at - cohort.invited_at)) / 604800)::integer + 1;

create or replace view public.beta_week_four_metrics as
with eligible_members as (
  select user_id, invited_at
  from public.beta_cohort_members
  where invited_at <= now() - interval '28 days'
),
week_four_activity as (
  select
    member.user_id,
    bool_or(event.event_type = 'app_opened') as returned,
    bool_or(event.event_type <> 'app_opened') as took_meaningful_discovery_action
  from eligible_members member
  left join public.beta_events event
    on event.user_id = member.user_id
    and event.occurred_at >= member.invited_at + interval '21 days'
    and event.occurred_at < member.invited_at + interval '28 days'
  group by member.user_id
),
rates as (
  select
    count(*) as eligible_tester_count,
    count(*) filter (where returned) as week_four_returner_count,
    count(*) filter (where took_meaningful_discovery_action) as meaningful_discovery_tester_count
  from week_four_activity
)
select
  rates.eligible_tester_count,
  rates.week_four_returner_count,
  case when rates.eligible_tester_count = 0 then null
    else rates.week_four_returner_count::numeric / rates.eligible_tester_count end as week_four_retention_rate,
  rates.meaningful_discovery_tester_count,
  case when rates.eligible_tester_count = 0 then null
    else rates.meaningful_discovery_tester_count::numeric / rates.eligible_tester_count end as week_four_meaningful_discovery_engagement_rate,
  retention.minimum_rate as week_four_retention_threshold,
  engagement.minimum_rate as week_four_meaningful_discovery_engagement_threshold,
  case when retention.minimum_rate is null or rates.eligible_tester_count = 0 then null
    else rates.week_four_returner_count::numeric / rates.eligible_tester_count >= retention.minimum_rate end as week_four_retention_threshold_met,
  case when engagement.minimum_rate is null or rates.eligible_tester_count = 0 then null
    else rates.meaningful_discovery_tester_count::numeric / rates.eligible_tester_count >= engagement.minimum_rate end as week_four_meaningful_discovery_engagement_threshold_met
from rates
left join public.beta_metric_thresholds retention on retention.metric = 'week_four_retention'
left join public.beta_metric_thresholds engagement on engagement.metric = 'week_four_meaningful_discovery_engagement';

revoke all on public.beta_weekly_activity from anon, authenticated;
revoke all on public.beta_week_four_metrics from anon, authenticated;
