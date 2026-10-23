# Dashboard performance review — 23 October 2026

Local changes are on `improve/dashboard-performance`, created from clean local `main`.
No commits, pushes, merges, deployments, package installations, environment changes, or remote database writes were performed.

The supplied H1–H4/M1–M10 scope was the audit reference; no separate prior audit artifact was found in the repository search. This is a completed local implementation/review cycle with the live verification limitations below, not a claim that production performance or every authenticated flow is verified.

## Finding disposition

| Finding | Status | Implementation or decision |
|---|---|---|
| H1 Summary aggregation | Improved; SQL activation pending approval | Summaries select only id/customer_name/total_price/payment_status/date_time. Recent five full orders are fetched independently in parallel. Existing KPI rounding, customer-name uniqueness, payment normalization and Cairo dates are preserved. SQL aggregation proposal is prepared but not called by application code. |
| H2 API row caps | Fixed for summary/chart, directory and catalogue reads | Explicit pages advance by actual returned length, with exact counts and stable ordering. Unexpected empty incomplete responses fail rather than return partial totals. Verified using 1,205 rows with a 137-row simulated server cap. Existing RLS and project filters remain. |
| H3 n8n amplification | Improved | Consolidated execution metadata read, server-side tenant filtering, per-workflow fallback with <=4 concurrent requests, all assigned workflows included instead of first 25. Workflow catalogue follows nextCursor. Upstream errors/429 produce an explicit failure rather than zero counts. Existing 15-second per-request timeout remains; no shared user cache or automatic rate-limit retries. |
| H4 Refetch/races | Fixed in code; authenticated browser check unavailable | Fetch callback no longer depends on language. Superseded/unmounted GETs are aborted; aborted results cannot update data/errors/loading. Switching automation projects clears old data. Assignment completions check selected project before refetch/message updates. |
| M1 Overview waterfall | Improved | Summary fetch starts immediately when project resolves, without waiting for display-name/profile lookup. Membership and project reads run in parallel. |
| M2 Duplicate authentication | Improved | React cache deduplicates server client creation and user validation during a server render. Existing authorization checks remain. React cache is request/render scoped, not a persistent cross-user cache. Route handlers/proxy may still perform independent validation. |
| M3 Users directory | Improved | Parallel paginated profile/membership/project reads; Map lookups replace nested filtering/find. Existing full-directory client search remains unchanged. Server search/paginated UI deferred to avoid changing search/navigation semantics without scale evidence. |
| M4 Client boundaries | Verified acceptable | Pages/layout fetch on server; views need immediate bilingual interaction. No speculative component split or chart lazy loading. Browser SDK import moved out of shared metadata initialization. |
| M5 Browser client | Improved | Logout imports the SDK on demand. Legacy browser data functions also import it only when called, so importing statusMeta does not initialize Supabase. No measured per-route bundle delta is claimed. |
| M6 Project switching | Improved; refresh replacement deferred | Selecting the current project avoids a reload. Full reload remains for actual changes because it clears retained route/local state; authenticated cross-project behavior could not be verified. |
| M7 Fonts | Deferred: insufficient visual evidence | Retained exact approved families/weights and existing loading. next/font documentation reviewed. Migration and exact font appearance were not validated; the existing font lint warning remains unsuppressed. |
| M8 Language initialization | Improved | useSyncExternalStore reads the pre-paint HTML preference with Arabic/light SSR snapshots, replacing effect-driven setState. Saved English and dark mode were observed after reload. A hydration reconciliation render is still expected for saved non-default preferences; no zero-render claim. |
| M9 CSS | Deferred: insufficient evidence | Broad global cascade contains responsive, theme and shared overrides. No stylesheet removal/reordering without coverage evidence; route CSS remains as-is. |
| M10 Orders pagination | Improved | Added id tie-breaker after date_time. Existing limit+1 next-page detection, filters, numbered offsets and navigation retained. Keyset pagination deferred because it changes navigation contracts. |

## Low-priority findings

- Fixed/improved: order date/time formatter instances reused; greeting hour and header date supplied by server to avoid time boundary hydration discrepancies; login image uses Next.js 16 preload in place of deprecated priority; sidebar images use next/image with original intrinsic dimensions, unoptimized source URLs, existing CSS and theme classes.
- Verified acceptable: dashboard loading boundary already exists; working charts remain unchanged.
- Deferred: splitting preference context and broader formatter caching have no measured benefit justifying additional abstractions.
- Pending database approval/evidence: index plan review and SQL aggregate deployment. Existing index catalogue, query plans and RLS policies were not queried remotely.

## Verification

- `npx --no-install tsc --noEmit`: passed on final source.
- `npm run lint`: passed with 0 errors / 1 warning (existing Google Fonts link in root layout). Baseline: 4 errors / 7 warnings. No rules disabled.
- `npm run build`: passed on final source; all 11 pages generated and route compilation/type validation completed.
- `git diff --check`: passed.
- `node scripts/performance-checks.mjs`: passed. Covers capped multi-page summaries, tenant query filtering, status aliases, KPI parity, Cairo midnight, empty projects, narrow projection, id order clause, consolidated n8n call count, all 30 fallback workflows, concurrency <=4, foreign execution filtering, Client rejection and explicit 429 failure. The printed n8n 429 error is intentional test coverage. These are mocked integration checks, not proof of remote RLS/query performance.
- Python Playwright attempt: could not run because playwright is absent in bundled Python. No dependency was installed. Reusable script remains in scripts/browser-performance-checks.py.
- Browser fallback through available in-app browser: login form rendered at the supplied narrow viewport; Arabic/English switched immediately; dark mode and saved English observed after reload; navigating to /orders without a session redirected to /login. Screenshot: performance-login-mobile.png. No authenticated login or signout was attempted without supplied credentials.
- Browser console: SyntaxError Unexpected token '<' at /_vercel/insights/script.js and /_vercel/speed-insights/script.js on local production server. These existing hosted analytics paths are not served as JavaScript locally. Deployment configuration and analytics integration were left unchanged. No hydration exception appeared in the captured error log, but this is not exhaustive coverage.
- Unverified live flows: Admin/Client dashboard pages, logout, actual project switching, overview/analytics against live orders, orders navigation, users directory, n8n assignments/executions, and authenticated responsive layouts. No disposable accounts or test database were provided. No production data was mutated.

## Performance evidence

- Summary projection: 5 selected columns rather than 13 full-order columns; recent full records capped at five. More than one page now produces correct totals rather than truncated results; complete large datasets can therefore require more requests than the old incorrect single-page implementation.
- Mock n8n dense history: 1 execution lookup, versus up to 25 per-workflow lookups previously. Sparse 30-workflow fixture: 31 calls (one consolidated probe + 30 fallback), <=4 concurrent, instead of silently excluding five workflows. Sparse instances may incur one extra request; no universal request reduction claim.
- Final emitted static assets: 21 JavaScript chunks totaling 976,202 bytes; 3 CSS chunks totaling 213,616 bytes (raw bytes, all chunks, not per-page transferred/gzipped sizes).
- No reliable pre-change build/network baseline, database timings, Lighthouse or Core Web Vitals measurements were collected. No percentage speedup is claimed.

## SQL/manual requirements

`supabase/performance-review.sql` is an UNAPPLIED review proposal, not an active timestamped migration. Supabase CLI is unavailable locally. Before deployment, inspect actual column types (proposal assumes uuid project_id and timestamptz date_time), existing indexes, RLS and grants. Generate a migration using `supabase migration new dashboard_performance`, review SECURITY INVOKER grants, compare SQL and fallback results for every tenant/status/DST edge, and obtain approval before applying remotely. Index examples are commented out and require EXPLAIN review. Only after verified application should an RPC adapter replace the fallback. Current application works without this SQL.

Remaining scaling limits: fallback and directory pagination are not a database snapshot under concurrent writes; exact counts repeat per page; summary fallback remains O(order count) and directory search still loads accessible users. A database aggregate is the preferred follow-up after approval. Project, membership and workflow-mapping catalogues also use complete pagination. n8n live version/permissions and global execution ordering were not verified against the actual instance.

## Complete changed-file list

- src/lib/data.server.ts — narrow complete summary reads, parallel recent orders, formatter reuse, deterministic orders.
- src/lib/data.ts — defer legacy browser SDK imports.
- src/lib/project.ts — deduplicate user lookup and parallelize independent reads.
- src/lib/supabase/server.ts — render-scoped client/user cache.
- src/lib/supabase/pagination.ts — shared capped-response pagination.
- src/lib/supabase/proxy.ts — const lint correction.
- src/lib/users.server.ts — complete paginated directory reads and linear joins.
- src/components/Providers.tsx — external preference store hydration.
- src/components/Shell.tsx — deferred logout SDK, unchanged-project guard, image props, server date.
- src/app/(dashboard)/layout.tsx — pass server render timestamp.
- src/app/(dashboard)/page.tsx — early summary promise and server greeting hour.
- src/app/(dashboard)/OverviewView.tsx — consume server hour and remove unused language binding.
- src/app/(dashboard)/automation/page.tsx — complete admin membership pagination and shared user lookup.
- src/app/(dashboard)/automation/AutomationView.tsx — cancellation and project identity guards, language-independent fetching.
- src/app/api/automation/n8n/route.ts — consolidated/bounded execution retrieval, workflow catalogue pagination, sanitized upstream errors.
- src/app/login/page.tsx — preload prop.
- scripts/performance-checks.mjs — mocked regression checks using existing TypeScript dependency.
- scripts/browser-performance-checks.py — optional browser check script; unavailable runtime reported above.
- supabase/performance-review.sql — unapplied SQL aggregate/index review proposal.
- performance-login-mobile.png — browser evidence.
- PERFORMANCE-REVIEW.md — this report.

## Skills and references

Skills used: vercel:react-best-practices, vercel:verification, webapp-testing, supabase:supabase, supabase:supabase-postgres-best-practices. Bundled Next.js guides reviewed for client/server boundaries, fonts, router refresh and image props. Supabase range behavior checked against https://supabase.com/docs/reference/javascript/range. Supabase changelog fetch was unavailable to the web tool. The n8n API reference was consulted but did not establish the installed instance version or ordering contract.

## Git review state

Branch: improve/dashboard-performance. Fifteen tracked source files modified; new scripts, SQL proposal, screenshot and this report are untracked. All changes are unstaged and uncommitted. main was not modified. Awaiting user review before any further Git write operation.
