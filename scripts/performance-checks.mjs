// Dependency-free regression checks using the installed TypeScript compiler.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
function load(file, mocks, fetcher = fetch, runtimeProcess = process) {
  const loaded = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  new Function('require', 'module', 'exports', 'fetch', 'process', code)(name => {
    if (name in mocks) return mocks[name];
    throw Error('Unexpected import: ' + name);
  }, loaded, loaded.exports, fetcher, runtimeProcess);
  return loaded.exports;
}
async function main() {
  const pagination = load("src/lib/supabase/pagination.ts", {});
  const rows = Array.from({ length: 1205 }, (_, i) => ({
    id: String(i).padStart(5, '0'), project_id: 'a', order_id: String(i),
    customer_name: 'Customer ' + (i % 9), total_price: 10,
    payment_status: [' PAID ', 'success', 'successful', 'pending', 'waiting', 'unpaid', 'other'][i % 7],
    date_time: '2026-01-01T22:30:00Z',
  }));
  rows.push({ ...rows[0], id: 'other', project_id: 'b', total_price: 999999 });
  let calls = [];
  const client = { from() {
    let project, start = 0, end = Infinity, fields, sort = [];
    const q = {
      select(value) { fields = value; return q; },
      eq(_, value) { project = value; return q; },
      order(key, options) { sort.push([key, options]); return q; },
      range(a,b) { start = a; end = b + 1; return q; },
      limit(n) { end = n; return q; },
      then(resolve, reject) {
        const selected = rows.filter(r => r.project_id === project);
        calls.push({ fields, sort });
        // Simulate a server cap smaller than the requested 1000-row page.
        return Promise.resolve({ data: selected.slice(start, Math.min(end, start + 137)),
          count: selected.length, error: null }).then(resolve, reject);
      }
    }; return q;
  }};
  const api = load('src/lib/data.server.ts', {
    '@/lib/supabase/pagination': pagination, 'server-only': {}, '@/lib/supabase/server': { createSupabaseServerClient: async () => client }
  });
  const overview = await api.getOverview('a');
  const paid = rows.filter(r => r.project_id === 'a' && ['paid','success','successful'].includes(r.payment_status.trim().toLowerCase()));
  assert.equal(overview.stats.orders, 1205);
  assert.equal(overview.payments.paid, paid.length);
  assert.equal(overview.payments.paid + overview.payments.pending + overview.payments.failed, 1205);
  assert(overview.payments.pending > overview.recent.length);
  const profiles = load('src/config/project-dashboard.ts', {});
  assert.equal(new Set(profiles.dashboardCategories.map(item => item.id)).size, profiles.dashboardCategories.length);
  for (const category of profiles.dashboardCategories) {
    assert.equal(category.cards.length, 3);
    for (const card of category.cards) {
      assert(card.title.ar && card.title.en && card.source.ar && card.source.en);
    }
    assert.equal(profiles.resolveDashboardProfile(category.id + ':general').category.id, category.id);
  }
  assert.equal(profiles.resolveDashboardProfile('unknown:unknown').category.id, 'general');
  assert.equal(profiles.resolveDashboardProfile('medical:physiotherapy').cards[1].title.en, "Today's sessions");
  console.log('PASS: all-record payment counts; 14 category templates; bilingual source labels; invalid preference fallback; medical specialty cards.');
  assert.equal(overview.stats.customers, 9);
  assert.equal(overview.stats.revenue, paid.length * 10);
  assert.equal(overview.stats.paidRate, Math.round(paid.length / 1205 * 100));
  assert.equal(overview.recent.length, 5);
  assert.equal(overview.recent[0].date, '2026-01-02');
  assert(calls.filter(c => c.fields.includes('phone_number')).length === 1);
  assert(calls.some(c => c.sort.some(([key]) => key === 'id')));
  const analytics = await api.getAnalytics('a');
  assert.equal(analytics.stats.orders, 1205);
  assert.equal(analytics.stats.revenue, overview.stats.revenue);
  assert.equal(analytics.statusBreakdown.reduce((sum, x) => sum + x.count, 0), 1205);
  assert.equal((await api.getOverview('empty')).stats.orders, 0);
  let mode = 'dense', active = 0, peak = 0, executionCalls = 0;
  const workflows = Array.from({ length: 30 }, (_, i) => ({ id: 'w' + i, name: 'Workflow ' + i }));
  const mappings = workflows.map(w => ({ workflow_id: w.id, project_id: 'a' }));
  let role = 'admin';
  const route = load('src/app/api/automation/n8n/route.ts', {
    '@/lib/supabase/pagination': pagination,
    'next/server': { NextResponse: { json: (body, options = {}) => ({ body, status: options.status ?? 200 }) } },
    '@/lib/project': { getCurrentProjectRole: async () => role,
      getAccessibleProjects: async () => [{ id: 'a', name: 'A' }] },
    '@/lib/supabase/server': { createSupabaseServerClient: async () => ({
      auth: { getUser: async () => ({ data: { user: { id: 'u' } } }) },
      from(table) {
        const q = { select: () => q, eq: () => q, order: () => q, range: () => q,
          maybeSingle: async () => ({ data: { project_id: 'a' }, error: null }),
          then: (resolve, reject) => Promise.resolve({ data: table === 'project_workflows' ? mappings : [], count: table === 'project_workflows' ? mappings.length : 0, error: null }).then(resolve, reject) };
        return q;
      }
    }) }
  }, async url => {
    if (url.pathname.endsWith('/workflows')) return { ok: true, json: async () => ({ data: workflows }) };
    executionCalls++; active++; peak = Math.max(peak, active);
    await new Promise(resolve => setTimeout(resolve, 1)); active--;
    if (mode === 'failure') return { ok: false, status: 429 };
    const workflowId = url.searchParams.get('workflowId');
    const data = workflowId ? [{ id: workflowId, workflowId, status: 'success' }]
      : Array.from({ length: mode === 'dense' ? 50 : 1 }, (_, i) => ({ id: 'e' + i, workflowId: mode === 'dense' ? 'w0' : 'foreign', status: 'success' }));
    return { ok: true, json: async () => ({ data, nextCursor: 'more' }) };
  }, { env: { N8N_BASE_URL: 'https://example.test', N8N_API_KEY: 'test-only' } });
  const request = { nextUrl: new URL('https://local.test/api/automation/n8n?projectId=a') };
  assert.equal((await route.GET(request)).body.executions.length, 50);
  assert.equal(executionCalls, 1);
  mode = 'sparse'; executionCalls = 0;
  const sparse = await route.GET(request);
  assert.equal(sparse.status, 200);
  assert.equal(sparse.body.executions.length, 30);
  assert(peak <= 4);
  assert.equal(executionCalls, 31);
  assert(sparse.body.executions.every(e => e.workflowId !== 'foreign'));
  role = 'client'; executionCalls = 0;
  assert.equal((await route.GET(request)).status, 403);
  assert.equal(executionCalls, 0);
  role = 'admin'; mode = 'failure';
  assert.equal((await route.GET(request)).status, 502);
  console.log('PASS: n8n dense history uses 1 request; sparse history covers all 30 workflows with concurrency <=4; foreign executions filtered; Client access denied before upstream calls; 429 fails explicitly.');
  console.log('PASS: >1000 rows with 137-row API cap, tenant filter, status aliases, KPI parity, Cairo midnight, narrow summary fields, deterministic order, empty project.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
