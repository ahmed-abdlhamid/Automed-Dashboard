# Automed Dashboard UI v2

Replace the matching files in your Automed Dashboard project with these files.

This batch keeps the existing Supabase/RLS architecture and adds:
- Compact expandable sidebar
- Admin-only project selector
- Project-aware admin/client greeting
- New Analytics, Automation and Activity routes
- New SaaS-style visual system
- Cleaner KPI cards, charts, system health and recent activity
- Responsive sidebar/mobile behavior
- Light/dark visual refresh

After replacing the files:

1. Run `npm run build`
2. If the build succeeds, run `npm run dev`
3. Test once as Admin and once as Client
4. Check Krokett project selection as Admin
5. Check that Client does not see the project selector

Important: keep your existing `src/lib/data.ts`, `src/lib/data.server.ts`, Supabase files, OrdersView, SettingsView and UsersView unless explicitly included in this package.
