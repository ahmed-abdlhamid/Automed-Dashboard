-- Automed Dashboard: assign each n8n workflow to one Automed project.
-- Run once in Supabase Dashboard > SQL Editor.

create table if not exists public.project_workflows (
  workflow_id text primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  workflow_name text not null,
  updated_at timestamptz not null default now()
);

create index if not exists project_workflows_project_id_idx
  on public.project_workflows(project_id);

alter table public.project_workflows enable row level security;

drop policy if exists "Admins can view assigned project workflows" on public.project_workflows;
create policy "Admins can view assigned project workflows"
  on public.project_workflows for select to authenticated
  using (exists (
    select 1 from public.project_members pm
    where pm.user_id = auth.uid()
      and pm.project_id = project_workflows.project_id
      and pm.role = 'admin'
  ));

drop policy if exists "Admins can insert assigned project workflows" on public.project_workflows;
create policy "Admins can insert assigned project workflows"
  on public.project_workflows for insert to authenticated
  with check (exists (
    select 1 from public.project_members pm
    where pm.user_id = auth.uid()
      and pm.project_id = project_workflows.project_id
      and pm.role = 'admin'
  ));

drop policy if exists "Admins can update assigned project workflows" on public.project_workflows;
create policy "Admins can update assigned project workflows"
  on public.project_workflows for update to authenticated
  using (exists (
    select 1 from public.project_members pm
    where pm.user_id = auth.uid()
      and pm.project_id = project_workflows.project_id
      and pm.role = 'admin'
  ))
  with check (exists (
    select 1 from public.project_members pm
    where pm.user_id = auth.uid()
      and pm.project_id = project_workflows.project_id
      and pm.role = 'admin'
  ));

drop policy if exists "Admins can delete assigned project workflows" on public.project_workflows;
create policy "Admins can delete assigned project workflows"
  on public.project_workflows for delete to authenticated
  using (exists (
    select 1 from public.project_members pm
    where pm.user_id = auth.uid()
      and pm.project_id = project_workflows.project_id
      and pm.role = 'admin'
  ));
