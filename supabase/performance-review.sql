-- REVIEW ONLY. Not applied. No application code depends on this function.
-- Supabase CLI is unavailable locally: generate a timestamped migration with
-- `supabase migration new dashboard_performance` before approved deployment.
-- Confirm orders column types, existing indexes, RLS and grants on staging first.
-- Run index statements separately, outside a transaction, after plan review.
-- create index concurrently if not exists orders_project_date_id_idx
--   on public.orders (project_id, date_time desc, id desc);
-- create index concurrently if not exists orders_project_id_idx
--   on public.orders (project_id, id);

-- SECURITY INVOKER deliberately preserves caller RLS. Never use service-role
-- credentials for dashboard reads. No changes to existing policies are proposed.
create or replace function public.dashboard_order_summary(p_project_id uuid)
returns jsonb
language sql stable security invoker set search_path = ''
as $function$
  with normalized as (
    select customer_name, total_price,
      (date_time at time zone 'Africa/Cairo')::date as day,
      case when lower(btrim(payment_status)) in ('paid','success','successful') then 'paid'
           when lower(btrim(payment_status)) in ('pending','waiting','unpaid') then 'pending'
           else 'failed' end as status
    from public.orders where project_id = p_project_id
  ), totals as (
    select count(*) as orders,
      coalesce(sum(total_price) filter (where status = 'paid'), 0) as revenue,
      count(distinct customer_name) + case when count(*) filter (where customer_name is null) > 0 then 1 else 0 end as customers,
      count(*) filter (where status = 'paid') as paid_orders,
      count(*) filter (where status = 'pending') as pending_orders,
      count(*) filter (where status = 'failed') as failed_orders
    from normalized
  ), weekly as (
    select day, sum(total_price) as revenue from normalized
    where status = 'paid'
      and day >= (current_timestamp at time zone 'Africa/Cairo')::date - 6
      and day <= (current_timestamp at time zone 'Africa/Cairo')::date
    group by day
  )
  select jsonb_build_object('totals', to_jsonb(totals), 'weekly',
    coalesce((select jsonb_agg(to_jsonb(weekly) order by day) from weekly), '[]'::jsonb))
  from totals;
$function$;
revoke all on function public.dashboard_order_summary(uuid) from public, anon;
grant execute on function public.dashboard_order_summary(uuid) to authenticated;
-- Before wiring the RPC into application code, compare its totals to the fallback
-- for every tenant, all status aliases, empty sets, Cairo DST transitions and >1000
-- rows. Fill missing weekly dates with zero and retain existing KPI rounding.
