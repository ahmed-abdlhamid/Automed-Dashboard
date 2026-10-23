-- Shared project activity. Apply once through a Supabase migration.
-- Existing project names stay in public.projects. No category is guessed or backfilled.
create table public.project_dashboard_settings (
  project_id uuid primary key references public.projects(id) on delete cascade,
  category text not null check (category in ('general','restaurant','pharmacy','dental','medical','company','telecom','retail','ecommerce','services','beauty','education','realestate','logistics')),
  specialty text,
  constraint valid_project_specialty check (
    (category = 'medical' and specialty is not null and specialty in ('general','internal','pediatrics','dermatology','gynecology','orthopedics','ophthalmology','ent','cardiology','neurology','physiotherapy','nutrition','other'))
    or (category <> 'medical' and specialty is null)
  )
);
alter table public.project_dashboard_settings enable row level security;
revoke all on public.project_dashboard_settings from public, anon, authenticated;
grant select, insert, update on public.project_dashboard_settings to authenticated;
grant all on public.project_dashboard_settings to service_role;
create policy dashboard_settings_member_read on public.project_dashboard_settings
for select to authenticated using (exists (
  select 1 from public.project_members pm
  where pm.project_id = project_dashboard_settings.project_id and pm.user_id = (select auth.uid())
));
create policy dashboard_settings_admin_insert on public.project_dashboard_settings
for insert to authenticated with check (exists (
  select 1 from public.project_members pm
  where pm.project_id = project_dashboard_settings.project_id and pm.user_id = (select auth.uid()) and pm.role = 'admin'
));
create policy dashboard_settings_admin_update on public.project_dashboard_settings
for update to authenticated using (exists (
  select 1 from public.project_members pm
  where pm.project_id = project_dashboard_settings.project_id and pm.user_id = (select auth.uid()) and pm.role = 'admin'
)) with check (exists (
  select 1 from public.project_members pm
  where pm.project_id = project_dashboard_settings.project_id and pm.user_id = (select auth.uid()) and pm.role = 'admin'
));
