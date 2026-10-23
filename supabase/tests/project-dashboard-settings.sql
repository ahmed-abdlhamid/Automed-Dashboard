-- Transactional integration checks against existing admin/client memberships.
-- No customer data or saved project settings are retained by this test.
begin;
do $$
declare
  target uuid;
  admin_id uuid;
  client_id uuid;
  affected integer;
begin
  select a.project_id, a.user_id, c.user_id into target, admin_id, client_id
  from public.project_members a join public.project_members c on c.project_id=a.project_id
  where a.role='admin' and c.role='client' and a.user_id<>c.user_id
    and not exists(select 1 from public.project_dashboard_settings s where s.project_id=a.project_id)
  limit 1;
  if target is null then raise exception 'Need an unconfigured project with distinct admin/client members'; end if;
  perform set_config('request.jwt.claim.sub', admin_id::text, true);
  set local role authenticated;
  insert into public.project_dashboard_settings(project_id,category,specialty) values(target,'restaurant',null);
  update public.project_dashboard_settings set category='medical',specialty='pediatrics' where project_id=target;
  get diagnostics affected=row_count;
  if affected<>1 then raise exception 'Admin update failed'; end if;
  begin
    update public.project_dashboard_settings set category='restaurant' where project_id=target;
    raise exception 'Invalid category/specialty pair was accepted';
  exception when check_violation then null; end;
  begin
    delete from public.project_dashboard_settings where project_id=target;
    raise exception 'Authenticated delete was accepted';
  exception when insufficient_privilege then null; end;
  perform set_config('request.jwt.claim.sub', client_id::text, true);
  if (select count(*) from public.project_dashboard_settings where project_id=target and category='medical' and specialty='pediatrics')<>1
    then raise exception 'Client could not read shared configuration'; end if;
  update public.project_dashboard_settings set specialty='general' where project_id=target;
  get diagnostics affected=row_count;
  if affected<>0 then raise exception 'Client updated configuration'; end if;
  begin
    insert into public.project_dashboard_settings(project_id,category,specialty) values(target,'restaurant',null)
      on conflict(project_id) do update set category=excluded.category,specialty=excluded.specialty;
    raise exception 'Client upsert was accepted';
  exception when insufficient_privilege then null; end;
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000000', true);
  if (select count(*) from public.project_dashboard_settings where project_id=target)<>0
    then raise exception 'Non-member could read configuration'; end if;
  begin
    insert into public.project_dashboard_settings(project_id,category,specialty) values(target,'restaurant',null)
      on conflict(project_id) do update set category=excluded.category,specialty=excluded.specialty;
    raise exception 'Non-member upsert was accepted';
  exception when insufficient_privilege then null; end;
  reset role;
  set local role anon;
  begin
    perform 1 from public.project_dashboard_settings;
    raise exception 'Anonymous read was accepted';
  exception when insufficient_privilege then null; end;
  reset role;
end $$;
rollback;
select 'PASS: admin insert/update; client read and write denial; non-member isolation; anon denial; constraints; no retained changes' as result;
