import { readAllRows } from "@/lib/supabase/pagination";
import { NextRequest, NextResponse } from "next/server";
import { getAccessibleProjects, getCurrentProjectRole } from "@/lib/project";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type N8nWorkflow = {
  id: string;
  name: string;
  active?: boolean;
  nodes?: unknown[];
  updatedAt?: string;
  createdAt?: string;
};

type N8nExecution = {
  id: string;
  workflowId?: string;
  status?: string;
  startedAt?: string;
  stoppedAt?: string;
  mode?: string;
  retryOf?: string | null;
};

async function n8nGet<T>(baseUrl: string, apiKey: string, path: string): Promise<T> {
  const url = new URL(path, baseUrl.endsWith("/") ? baseUrl : baseUrl + "/");
  const response = await fetch(url, {
    method: "GET",
    headers: { "X-N8N-API-KEY": apiKey, Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error("n8n API returned " + response.status);
  }

  return response.json() as Promise<T>;
}

async function getWorkflows(baseUrl: string, apiKey: string) {
  const workflows: N8nWorkflow[] = [];
  const seen = new Set<string>();
  let cursor: string | undefined;
  do {
    const page = await n8nGet<{ data?: N8nWorkflow[]; nextCursor?: string | null }>(baseUrl, apiKey,
      "/api/v1/workflows?limit=100" + (cursor ? "&cursor=" + encodeURIComponent(cursor) : ""));
    workflows.push(...(page.data ?? []));
    cursor = page.nextCursor || undefined;
    if (cursor && seen.has(cursor)) throw new Error("n8n returned a repeated workflow cursor");
    if (cursor) seen.add(cursor);
  } while (cursor);
  return { data: workflows };
}

async function isAdminForProject(projectId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("user_id", user.id)
    .eq("project_id", projectId)
    .eq("role", "admin")
    .maybeSingle();

  return !error && Boolean(data);
}

async function getContext(projectId: string) {
  const role = await getCurrentProjectRole();
  if (role !== "admin") {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 403 }) };
  }

  const projects = await getAccessibleProjects();
  const selectedProject = projects.find((project) => project.id === projectId);
  if (!selectedProject || !(await isAdminForProject(projectId))) {
    return { response: NextResponse.json({ error: "You do not have admin access to this project." }, { status: 403 }) };
  }

  const baseUrl = process.env.N8N_BASE_URL?.trim();
  const apiKey = process.env.N8N_API_KEY?.trim();

  if (!baseUrl || !apiKey) {
    return {
      response: NextResponse.json({
        error: "n8n is not configured yet. Add N8N_BASE_URL and N8N_API_KEY to the server environment.",
        code: "N8N_NOT_CONFIGURED",
      }, { status: 503 }),
    };
  }

  let parsedBaseUrl: URL;
  try {
    parsedBaseUrl = new URL(baseUrl);
  } catch {
    return { response: NextResponse.json({ error: "N8N_BASE_URL must be a valid URL.", code: "N8N_INVALID_URL" }, { status: 500 }) };
  }

  if (parsedBaseUrl.protocol !== "https:" && parsedBaseUrl.hostname !== "localhost" && parsedBaseUrl.hostname !== "127.0.0.1") {
    return { response: NextResponse.json({ error: "Use an HTTPS URL for the n8n tunnel.", code: "N8N_HTTPS_REQUIRED" }, { status: 500 }) };
  }

  return { baseUrl, apiKey, projects };
}

export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get("projectId")?.trim();
    if (!projectId) {
      return NextResponse.json({ error: "Select a project to load its automation data." }, { status: 400 });
    }

    const context = await getContext(projectId);
    if ("response" in context) return context.response;

    const supabase = await createSupabaseServerClient();
    const [workflowResponse, mappingResponse] = await Promise.all([
      getWorkflows(context.baseUrl, context.apiKey),
      readAllRows(offset => supabase.from("project_workflows")
        .select("workflow_id, project_id, workflow_name, updated_at", { count: "exact" })
        .order("workflow_id").range(offset, offset + 999)),
    ]);

    if (mappingResponse.error) {
      console.error("Automed project workflow mappings error:", mappingResponse.error);
      return NextResponse.json({
        error: "The project_workflows table is not ready. Run the Automed workflow-mapping SQL setup in Supabase, then refresh.",
        code: "PROJECT_WORKFLOWS_TABLE_MISSING",
      }, { status: 503 });
    }

    const mappings = mappingResponse.data ?? [];
    const mappingByWorkflow = new Map(mappings.map((mapping) => [mapping.workflow_id, mapping]));
    const workflows = (workflowResponse.data ?? []).map((workflow) => {
      const mapping = mappingByWorkflow.get(workflow.id);
      return {
        id: workflow.id,
        name: workflow.name || "Unnamed workflow",
        active: Boolean(workflow.active),
        nodeCount: Array.isArray(workflow.nodes) ? workflow.nodes.length : 0,
        updatedAt: workflow.updatedAt ?? null,
        createdAt: workflow.createdAt ?? null,
        projectId: mapping?.project_id ?? null,
        mappedProjectName: context.projects.find((project) => project.id === mapping?.project_id)?.name ?? null,
      };
    });

    const selectedWorkflowIds = workflows
      .filter((workflow) => workflow.projectId === projectId)
      .map((workflow) => workflow.id);

    // A global metadata page often contains the project's latest 50 executions.
    // Filter on the server; never serialize another project's executions.
    const selectedIds = new Set(selectedWorkflowIds);
    let selectedExecutions: N8nExecution[] = [];
    if (selectedIds.size) {
      const latest = await n8nGet<{ data?: N8nExecution[]; nextCursor?: string | null }>(
        context.baseUrl, context.apiKey, "/api/v1/executions?limit=100&includeData=false"
      );
      selectedExecutions = (latest.data ?? []).filter(item => selectedIds.has(item.workflowId ?? ""));
      if (latest.nextCursor && selectedExecutions.length < 50) {
        // Sparse projects need per-workflow history. Bound upstream concurrency,
        // include every assigned workflow, and fail rather than report false zeroes.
        selectedExecutions = [];
        let next = 0;
        await Promise.all(Array.from({ length: Math.min(4, selectedWorkflowIds.length) }, async () => {
          while (next < selectedWorkflowIds.length) {
            const workflowId = selectedWorkflowIds[next++];
            const result = await n8nGet<{ data?: N8nExecution[] }>(context.baseUrl, context.apiKey,
              "/api/v1/executions?workflowId=" + encodeURIComponent(workflowId) + "&limit=50&includeData=false");
            selectedExecutions.push(...(result.data ?? []).filter(item => item.workflowId === workflowId));
          }
        }));
      }
    }

    const workflowNames = new Map(workflows.map((workflow) => [workflow.id, workflow.name]));
    const executions = selectedExecutions.map((execution) => ({
      id: execution.id,
      workflowId: execution.workflowId ?? "",
      workflowName: workflowNames.get(execution.workflowId ?? "") ?? "Workflow",
      status: execution.status ?? "unknown",
      startedAt: execution.startedAt ?? null,
      stoppedAt: execution.stoppedAt ?? null,
      mode: execution.mode ?? "unknown",
    })).sort((a, b) => {
      const aTime = a.startedAt ? new Date(a.startedAt).getTime() : 0;
      const bTime = b.startedAt ? new Date(b.startedAt).getTime() : 0;
      return bTime - aTime;
    }).slice(0, 50);

    return NextResponse.json({
      connected: true,
      fetchedAt: new Date().toISOString(),
      projects: context.projects.map((project) => ({ id: project.id, name: project.name })),
      selectedProjectId: projectId,
      workflows,
      executions,
      stats: {
        workflows: selectedWorkflowIds.length,
        activeWorkflows: workflows.filter((workflow) => workflow.projectId === projectId && workflow.active).length,
        executions: executions.length,
        successfulExecutions: executions.filter((execution) => execution.status === "success").length,
        failedExecutions: executions.filter((execution) => execution.status === "error").length,
        runningExecutions: executions.filter((execution) => execution.status === "running" || execution.status === "waiting").length,
      },
    }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error) {
    console.error("Automed n8n integration error:", error);
    const message = error instanceof Error ? error.message : "Could not reach n8n.";
    return NextResponse.json({
      error: message.includes("n8n API returned") ? message : "Could not connect to n8n. Check the tunnel URL, API key, and that n8n is running.",
      code: "N8N_CONNECTION_FAILED",
    }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null) as {
      workflowId?: string;
      workflowName?: string;
      projectId?: string | null;
    } | null;

    const workflowId = body?.workflowId?.trim();
    const workflowName = body?.workflowName?.trim() || workflowId;
    const projectId = body?.projectId ?? null;

    if (!workflowId || (projectId !== null && typeof projectId !== "string")) {
      return NextResponse.json({ error: "A valid workflow ID and project selection are required." }, { status: 400 });
    }

    const role = await getCurrentProjectRole();
    if (role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: existingMapping, error: lookupError } = await supabase
      .from("project_workflows")
      .select("workflow_id, project_id")
      .eq("workflow_id", workflowId)
      .maybeSingle();

    if (lookupError) {
      return NextResponse.json({
        error: "The project_workflows table is not ready. Run the Automed workflow-mapping SQL setup in Supabase, then refresh.",
        code: "PROJECT_WORKFLOWS_TABLE_MISSING",
      }, { status: 503 });
    }

    if (existingMapping?.project_id && !(await isAdminForProject(existingMapping.project_id))) {
      return NextResponse.json({ error: "You do not have admin access to the currently assigned project." }, { status: 403 });
    }

    if (projectId === null) {
      const { error } = await supabase.from("project_workflows").delete().eq("workflow_id", workflowId);
      if (error) throw error;
      return NextResponse.json({ ok: true, workflowId, projectId: null });
    }

    const projects = await getAccessibleProjects();
    if (!projects.some((project) => project.id === projectId) || !(await isAdminForProject(projectId))) {
      return NextResponse.json({ error: "You do not have admin access to the target project." }, { status: 403 });
    }

    const baseUrl = process.env.N8N_BASE_URL?.trim();
    const apiKey = process.env.N8N_API_KEY?.trim();
    if (!baseUrl || !apiKey) {
      return NextResponse.json({ error: "n8n is not configured." }, { status: 503 });
    }

    const workflowResponse = await getWorkflows(baseUrl, apiKey);
    if (!(workflowResponse.data ?? []).some((workflow) => workflow.id === workflowId)) {
      return NextResponse.json({ error: "That workflow was not found in the connected n8n instance." }, { status: 404 });
    }

    const { error } = await supabase.from("project_workflows").upsert({
      workflow_id: workflowId,
      project_id: projectId,
      workflow_name: workflowName || workflowId,
      updated_at: new Date().toISOString(),
    }, { onConflict: "workflow_id" });

    if (error) throw error;

    return NextResponse.json({ ok: true, workflowId, projectId });
  } catch (error) {
    console.error("Automed workflow assignment error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Could not save workflow assignment.",
    }, { status: 500 });
  }
}
