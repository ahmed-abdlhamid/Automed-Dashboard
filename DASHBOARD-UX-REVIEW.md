# Automed dashboard — current implementation

## Project setup (23 October 2026)

Activity is now shared project data, not a browser preference. The temporary Overview “Customize view” menu, localStorage activity store, storage events and static project-default map have been removed. Existing browser values are ignored; they are not imported into shared configuration.

An administrator selects the current project, opens Settings → Project setup, chooses its category and (for medical clinics) specialty, then explicitly saves. Unconfigured projects display a setup link to their project administrator on Overview. Clients see neither this prompt nor activity controls in Overview or Settings. Project names continue to come from `public.projects`; no activity is inferred from a name. Existing projects have not been assigned speculative categories.

The supplied 14-category catalogue and 13 medical specialties remain available. A General category is a deliberate selectable option, while a missing row is an unconfigured project. Unconfigured/unavailable client views fall back to the existing financial dashboard without exposing setup controls. Theme and language remain personal browser preferences.

### Storage and authorization

- Added `public.project_dashboard_settings`, keyed by `project_id` with a foreign key to `projects`. Fields: `category`, `specialty`.
- SQL checks allow only catalogue categories and medical specialties; non-medical categories require a null specialty, and medical categories require a valid specialty.
- RLS lets project members read their own project configuration. Only an `admin` membership of the target project permits insert/update. Anonymous access and authenticated delete/truncate privileges are revoked. Existing project/membership policies were not changed.
- The Server Action checks authenticated identity, validates UUID/category/specialty and verifies the target project membership before upserting with the normal user-scoped Supabase client. No service key or SECURITY DEFINER function was added.
- Server reads explicitly filter by project ID and use request-scoped React cache, not a shared cross-user cache. Errors disable admin saving and show a retry message.
- Saving invalidates the dashboard layout through `revalidatePath`; Next.js returns refreshed server data with the mutation response. Other sessions read the shared value on their next navigation/reload; this is not a realtime subscription.

Applied via Supabase MCP to the matched `automed-dashboard` project (`ayynfehajilgwqwwwutj`), migration `20261023154435_add_project_dashboard_settings`. The repository migration contains the same DDL. Supabase CLI is unavailable, so the filename mirrors the version returned by Supabase rather than an invented local version. No pre-existing project, order, user, credential or membership was modified. Confirmed zero saved category rows after rolled-back tests. The unrelated `supabase/performance-review.sql` remains unapplied.

### Operational data boundary

Operational cards for stock, appointments, fulfilment, repairs and similar sources are hidden because no real source integration exists for them in this app. Their bilingual catalogue definitions remain as future specifications; category selection does not create those integrations or fabricated counters. Current visible metrics remain the connected order/payment metrics. The saved category and specialty drive project context and descriptive focus; changing category currently does not add live category-specific metrics.

Overview order: project/category context → admin setup notice when needed → payment follow-up → all-record financial summary → seven-day paid-revenue trend and full payment breakdown → latest five orders. Complete payment counts remain independent of fulfilment and the recent-five list. Cairo date handling, tenant filters and existing order mapping are preserved.

## Preserved design

Existing Automed teal/orange palette, logo, header, sidebar, Zain typography and approved login are preserved in this change. Zain is self-hosted with Regular 400, Bold 700 and ExtraBold 800 under its supplied OFL license. No dependency was installed. Setup selects have explicit theme-aware foreground/background and accessible labels. The form requires an intentional category choice and disables edits while saving.

## Changed code

- `src/config/project-dashboard.ts`: shared settings type/validation; removed static project defaults.
- `src/lib/project-dashboard.server.ts`: tenant-filtered shared profile read with availability state.
- `src/app/(dashboard)/settings/actions.ts`: validated, project-admin-only save and revalidation.
- `src/components/ProjectDashboardProfile.tsx`: explicit shared setup form; no local activity storage.
- Overview and Settings server/client components: server profile props, admin setup visibility, removed temporary customization and disconnected cards.
- `overview-workspace.css`: removed customization popover styling; setup prompt/save button/select contrast.
- `supabase/migrations/20261023154435_add_project_dashboard_settings.sql`: applied additive schema, constraints, grants and RLS.
- `supabase/tests/project-dashboard-settings.sql`: rollback-only database permission/constraint checks. Requires an unconfigured project with distinct existing admin/client memberships; fails clearly if no fixture is available.
- `scripts/performance-checks.mjs`: action validation/authorization/write failures, shared read/error states plus existing performance regressions.

## Verification

- TypeScript: passed; production build also includes TypeScript checking.
- ESLint: passed with zero errors/warnings.
- Regression script: passed. Includes valid/invalid categories and specialties, target membership checks, admin save, client/non-member/unauthenticated denial, failed writes without success/revalidation, tenant-filtered reads, missing settings and unavailable storage. Existing 1,205-row pagination/KPI and n8n checks passed; the mock n8n 429 log is intentional.
- Live database transaction: passed admin insert/update, client read and update/upsert denial, non-member read/upsert denial, anonymous read denial, authenticated delete denial and mismatched category/specialty rejection. Transaction rolled back; no test category persisted.
- Database metadata: RLS enabled, three policies, no anon SELECT and no authenticated DELETE.
- Browser: real Overview, Settings, Providers and setup form in an isolated temporary Next preview with synthetic props. Checked medical specialty visibility/selection, restaurant hiding the specialty control, Arabic/English, light/dark, disabled empty-category save, admin-only setup and client absence of setup/customization/operational placeholders. Shared saved profile props rendered Medical clinic / Paediatrics. At 390px/320px document widths were 384px/314px; no horizontal overflow. Browser error log empty.
- The isolated preview lacked the main app's PostCSS config and emitted a server-side `@theme` warning; the actual production build passed cleanly. Preview and server were removed. No app auth bypass or preview route remains.
- Full authenticated browser save/reload across real admin/client accounts was not exercised without test credentials. Server mutation behavior was tested with mocks; actual RLS/read/write behavior was tested separately in the database.
- Production build passed. No deployment, commit, push, branch creation/switch or main modification was performed in this task. Work remains local on `improve/dashboard-performance`; the additive database migration is already applied.

## Existing security advisories outside this change

Supabase's security advisor returned existing public EXECUTE warnings for `handle_new_user()` and `is_admin()` SECURITY DEFINER functions, and disabled leaked-password protection. None concerns the new settings table or a function added by this change. They were not modified as part of dashboard setup. Remediation references: [anonymous function execution](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable), [authenticated function execution](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable), [password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
