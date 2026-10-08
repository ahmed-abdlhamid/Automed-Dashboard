Automed Dashboard UI v2 - Polish Patch

This patch is based on the Automed-Dashboard-UI-v2 folder previously supplied.

Replace these files in the project:

src/components/Shell.tsx
src/app/globals.css
src/app/(dashboard)/analytics/page.tsx
src/app/(dashboard)/analytics/AnalyticsView.tsx
src/app/(dashboard)/analytics/AnalyticsChart.tsx
src/app/(dashboard)/automation/page.tsx
src/app/(dashboard)/automation/AutomationView.tsx
src/app/(dashboard)/orders/OrdersView.tsx
src/app/(dashboard)/settings/SettingsView.tsx

Notes:
- Sidebar is now floating with rounded corners, shadow and cleaner branding when collapsed.
- Analytics is fully bilingual and follows the selected language, including chart day labels.
- Automation is fully bilingual.
- Settings translates project information and maps Active -> نشط in Arabic.
- Powered by is displayed as مقدم الخدمة in Arabic while Automed stays fixed as the brand name.
- Orders now show Chat ID and phone as separate fields, clearer date/time formatting, and total amount on one line.
- No Supabase schema, auth, RLS, project-selection logic, or environment variables are changed.

After replacing the files:
1. npm run build
2. npm run dev
3. Check the dashboard in Arabic and English, then test Admin and Client accounts.
