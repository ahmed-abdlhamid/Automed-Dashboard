# Automed operations-first dashboard

## Implemented

Overview now starts with payment follow-up, then a compact financial summary, activity-specific operational cards, paid revenue trend, complete payment breakdown and recent orders. Automed colours and logo assets remain in place. Typography now uses the supplied Zain family throughout, including login; the login backdrop has been simplified to one frame. The user authorized the Overview/category views and subsequently the header/sidebar refinement described below. Work stayed on `improve/dashboard-performance`.

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

## Header and sidebar refinement

- Current project is shown to both Admin and Client. Admins with multiple accessible projects retain the project picker. Existing authorization and full-reload switching behavior are preserved.
- Header identity now receives the authenticated user's display name from the dashboard layout and shows the current project role. The identity opens Settings instead of being an inert button. The profile lookup is deduplicated with request-scoped React cache.
- Removed the notification icon that only redirected to orders, the repeated date and the unsupported System online assertion. Theme and language controls remain.
- Sidebar uses fixed Automed teal #0D5C56 and the existing logo asset for dark backgrounds. It opens expanded on desktop, folds through an explicit button, and no longer changes width on hover. Mobile retains a drawer with close button, Escape, focus containment/return and body-scroll restoration. A closed mobile drawer is hidden from keyboard/accessibility navigation. An open drawer is dismissed when crossing to desktop width.
- Changed files for this refinement: src/components/Shell.tsx, src/components/workspace-shell.css, src/app/(dashboard)/layout.tsx, src/lib/project.ts and this report. The header-only step did not modify login, fonts or shared styles; the separately authorized font/login update below supersedes that boundary.
- The later user instruction explicitly extended font replacement to login and allowed simplifying its stacked background. That work is complete below.
- Verification: TypeScript, existing regression checks and production build passed. ESLint has 0 errors and the single existing Google Fonts warning. Synthetic browser preview verified project-menu Escape dismissal, explicit desktop folding, RTL/LTR, light/dark, Admin/Client-specific navigation and identity props, 390px/320px layouts, mobile focus cycling and Escape return. At 320px page width was 314px, without page-level overflow. Captured browser error log was empty. Live profile loading, signout and actual multi-project navigation were not exercised without authenticated test accounts. The new breakpoint-close handler was statically checked/built but not separately exercised in the browser after its final addition.
- The isolated synthetic preview was removed. New screenshot evidence is outside the repository: automed-shell-desktop.png and automed-shell-mobile.png in the task visualization directory. No production data was used.
- All refinement changes are local on improve/dashboard-performance; no commit, push, deployment or database write was performed.

## Zain typography and single-frame login

The user supplied Zain.zip and explicitly authorized using it in both dashboard and login, with a quieter login backdrop. Only the three required original font files and OFL.txt were copied from the archive, without extracting arbitrary paths or executing archive contents. The copied bytes match the originals exactly.

- src/app/fonts.ts configures next/font/local for Zain Regular 400, Bold 700 and ExtraBold 800. Original TTF assets and SIL OFL license are in src/app/fonts/. They cover Arabic and Latin characters checked in metadata and displayed in browser previews.
- src/app/layout.tsx applies the shared font variable and removes Google Fonts stylesheet/preconnect links. `display: swap` and automatic fallback metrics are retained. Preloading all three TTF files is disabled; the browser requests the faces used by each route. Original font assets total 541,968 bytes. No network speed or Core Web Vitals improvement is claimed.
- src/app/globals.css and src/app/theme.css use Zain for body, headings, controls and numbers, including formerly forced Arial counters. Tailwind weight tokens and explicit 500/600 emphasis map to supplied Bold 700; body remains 400 and the login hero uses 800. Unsupported 900 requests map to 800. Font synthesis is disabled.
- src/app/(dashboard)/overview-workspace.css, src/app/(dashboard)/automation/automation-projects.css and src/components/workspace-shell.css align their explicit weights and families with those real font files.
- src/app/login/login.css removes both stacked frame pseudo-elements, uses a single soft frame/shadow and quieter teal-tinted backdrop, and applies Zain. Form structure, illustration, translations, input handling, password visibility, recovery help and authentication code remain unchanged.

Verification: TypeScript, regression checks and production build passed. ESLint now reports zero errors and zero warnings; the prior Google Fonts warning is resolved. The expected mock n8n 429 log remains intentional regression coverage.

Actual unauthenticated /login was inspected in the local app. Browser checks confirmed loaded Zain, body 400, subheading 700, hero 800, identical font family on inputs, zero Google Fonts link tags, and no ::before/::after content on the frame. Arabic/English, light/dark, password visibility and recovery help were exercised without sending credentials. At 390px and 320px there was no horizontal page overflow, and the expanded recovery message did not overlap the footer. The decorative illustration can shrink on short mobile screens to leave the form available, following the existing layout behavior.

The dashboard's real Shell, Providers and Overview components were checked in an isolated synthetic preview with the same local font configuration. Heading, numeric and navigation font families were confirmed as Zain; desktop Arabic and mobile English/dark layouts were inspected. At 390px its document width was 384px. Captured browser error logs for login and preview were empty. Live authenticated data and sign-in success were not tested without test credentials.

Both temporary servers were stopped and the synthetic preview app removed. Screenshots are outside the repository: automed-zain-login.png and automed-zain-dashboard.png in the task visualization directory. Dashboard figures are synthetic. No dependency was installed, no environment/database/deployment configuration was changed, and no commit or push was made. Work remains on improve/dashboard-performance with the preceding header/sidebar changes preserved.
