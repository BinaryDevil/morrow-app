create table public.beta_event_types (
  event_type text primary key,
  is_meaningful_discovery_action boolean not null
);

insert into public.beta_event_types (event_type, is_meaningful_discovery_action)
values
  ('app_opened', false),
  ('experience_viewed', true),
  ('place_saved', true),
  ('experience_shared', true),
  ('person_followed', true);

alter table public.beta_event_types enable row level security;

alter table public.beta_events
  drop constraint if exists beta_events_event_type_check,
  add constraint beta_events_event_type_fkey
    foreign key (event_type) references public.beta_event_types(event_type);

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

create or replace view public.beta_weekly_activity as
select
  cohort.user_id,
  floor(extract(epoch from (event.occurred_at - cohort.invited_at)) / 604800)::integer + 1 as cohort_week,
  count(*) filter (where event_type.event_type = 'app_opened') as opens,
  count(*) filter (where event_type.is_meaningful_discovery_action) as meaningful_discovery_actions,
  count(distinct event.event_type) filter (where event_type.is_meaningful_discovery_action) as meaningful_discovery_action_types
from public.beta_cohort_members cohort
left join public.beta_events event
  on event.user_id = cohort.user_id
  and event.occurred_at >= cohort.invited_at
left join public.beta_event_types event_type on event_type.event_type = event.event_type
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
    bool_or(event_type.event_type = 'app_opened') as returned,
    bool_or(event_type.is_meaningful_discovery_action) as took_meaningful_discovery_action
  from eligible_members member
  left join public.beta_events event
    on event.user_id = member.user_id
    and event.occurred_at >= member.invited_at + interval '21 days'
    and event.occurred_at < member.invited_at + interval '28 days'
  left join public.beta_event_types event_type on event_type.event_type = event.event_type
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
