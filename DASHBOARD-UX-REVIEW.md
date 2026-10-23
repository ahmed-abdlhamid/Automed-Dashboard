# Automed operations-first dashboard

## Implemented

Overview now starts with payment follow-up, then a compact financial summary, activity-specific operational cards, paid revenue trend, complete payment breakdown and recent orders. Existing Automed colours, IBM Plex Sans Arabic / Readex Pro typography, shell, sidebar, login, theme and language controls remain in place. The user authorized the new Overview layout and category views. Work stayed on `improve/dashboard-performance`.

Design uses existing tokens: teal #0D5C56, orange #FD9238, background #F4F7F6, white #FFFFFF, ink #10201E. Teal marks navigation/context, orange and red mark payment states, and unconnected sources have restrained dashed cards rather than fabricated counters. Reading order follows RTL/LTR; the mobile priority section stacks and the table scrolls within its own container.

```
Project / category / customize
Payment follow-up: unsuccessful + awaiting payment
Compact financial summary (all records)
Three activity-specific operational cards
Seven-day revenue trend | all-record payment breakdown
Latest five orders
```

## Activity catalogue

| Category | Operational cards |
|---|---|
| General | Orders needing action, overdue tasks, enquiries |
| Restaurant / café | Confirmation, preparation, late handovers |
| Pharmacy | Review, out-of-stock items, dispensing |
| Dental | Appointment confirmation, waiting patients, follow-up sessions |
| Medical clinic | Appointment confirmation, visit queue, follow-ups; specialty variants |
| Company / B2B | Client requests, quotes, deliverables |
| Telecom / electronics | Activations, repairs, collection |
| Retail | Preparation, low stock, returns |
| Online store | Unshipped orders, delayed shipments, returns |
| Services / maintenance | Booking confirmation, unassigned jobs, overdue visits |
| Salon / beauty | Booking confirmation, sessions, client follow-ups |
| Education / training | Enrolments, classes, absence follow-up |
| Real estate | Enquiries, viewings, offers |
| Logistics | Assignment, late deliveries, failed delivery attempts |

Medical specialty choices: general medicine, internal medicine, paediatrics, dermatology, obstetrics/gynaecology, orthopaedics, ophthalmology, ENT, cardiology, neurology, physiotherapy, nutrition and other. Their cards concern administrative appointments/sessions/documents only; no clinical inference or medical recommendations are made.

## Data and persistence boundaries

- Complete paid/pending/failed counts are added to Overview using the existing complete summary read, with no additional database request. Payment states are no longer presented as fulfilment states or derived from the latest five orders.
- Existing orders, paid revenue, customer-name uniqueness, paid rate, weekly Cairo dates and recent order mapping are preserved. Financial counts are explicitly labelled all records; the trend is labelled last seven days.
- Operational sources such as stock, appointments, fulfilment and repairs are not present in the current app data model. Their cards explicitly say Unavailable and name the required source. They are UI templates awaiting real integrations, not working backend integrations or zero counts.
- Activity selection is a VIEW preference in localStorage, namespaced by project ID. Overview and Settings share it. It does not change project data, permissions or RLS. Storage failure displays an error. No activity is guessed from project name.
- `projectDashboardProfiles` in src/config/project-dashboard.ts supports explicit centrally configured defaults; it is initially empty, so unconfigured projects use General.
- Shared cross-device project configuration and connecting operational sources require a separate backend implementation. No schema, credentials, policies or remote data were changed in this task.

## Changed files

- src/app/(dashboard)/OverviewView.tsx — operations-first layout, honest data states, complete payment breakdown, recent table.
- src/app/(dashboard)/overview-workspace.css — scoped responsive layout and profile controls.
- src/components/ProjectDashboardProfile.tsx — project-scoped preference store and activity/specialty selectors.
- src/config/project-dashboard.ts — 14 bilingual category templates, 13 medical specialty options, source requirements and profile resolution.
- src/app/(dashboard)/settings/SettingsView.tsx — activity preference in Settings.
- src/lib/data.ts — additive payment totals in Overview type and legacy mapper.
- src/lib/data.server.ts — complete payment totals from existing summary records.
- scripts/performance-checks.mjs — payment-count parity, bilingual templates, invalid preferences and medical specialty checks.
- DASHBOARD-UX-REVIEW.md — this report.

## Verification

- TypeScript: passed (`npx --no-install tsc --noEmit`).
- ESLint: 0 errors, 1 existing Google Fonts warning; no rule suppressed.
- Regression checks: passed, including 1,205 orders under a simulated 137-row API cap, payment normalization/tenant filters, total payment count parity, category IDs and labels, specialty resolution and existing n8n security/concurrency tests. Expected n8n 429 output is intentional test coverage.
- Production build: passed; all routes compiled, types checked and static pages generated.
- Browser: actual Overview, Shell, Providers and Settings components rendered in a temporary isolated local Next preview using synthetic data only. Checked category switching, medical specialty persistence, Settings-to-Overview synchronization, independent preferences for two project IDs, Arabic/English, light/dark, empty orders/revenue and 390px/320px widths. At 320px document width was 314px; at 390px it was 384px, with no page-level horizontal overflow. Captured browser error log was empty.
- Initial automation interactions before hydration were retried after confirming rendered state; preference persistence was then verified successfully.
- Preview server and temporary preview app were removed. No development-only route or auth bypass remains in the application.
- Screenshots are outside the repository in the task visualization directory: automed-operations-desktop.png and automed-operations-mobile.png. All displayed figures in those screenshots are synthetic.
- Live authenticated Supabase reads, actual project switching through the header and operational integrations were not exercised without test accounts. Permission logic, project selection and backend integration endpoints were not changed.

No new packages, commits, pushes, deployments or database operations were performed. Changes remain local for review. No SESSION_HANDOFF.md exists, so none was created.
