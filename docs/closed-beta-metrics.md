# Closed-beta metrics

The invited cohort is the set of rows in `public.beta_cohort_members`. Add a tester after their account profile exists; their individual four-week window begins at `invited_at`.

The app records an authenticated `app_opened` event when a cohort member returns to Morrow. It also records these meaningful discovery actions: viewing an experience, saving a place, sharing an experience, and following a person. Events from people outside the cohort are ignored by `record_beta_event`.

Before evaluating the closed beta, the team should enter its agreed rates (as decimals from 0 to 1):

```sql
insert into public.beta_metric_thresholds (metric, minimum_rate)
values
  ('week_four_retention', 0.25),
  ('week_four_meaningful_discovery_engagement', 0.50)
on conflict (metric) do update set minimum_rate = excluded.minimum_rate;
```

The example rates are placeholders, not product targets. Replace them with the team's agreed thresholds.

Use `select * from public.beta_week_four_metrics;` after a tester completes their fourth week. It reports the completed-week cohort size, returned testers, meaningful-discovery testers, each rate, each configured threshold, and whether it was met. Use `select * from public.beta_weekly_activity order by cohort_week, user_id;` to inspect activity during the beta.
