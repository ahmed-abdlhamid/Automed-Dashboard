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
    const details = await response.text().catch(() => "");
    throw new Error("n8n API returned " + response.status + (details ? ": " + details.slice(0, 180) : ""));
  }

  return response.json() as Promise<T>;
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
      n8nGet<{ data?: N8nWorkflow[] }>(context.baseUrl, context.apiKey, "/api/v1/workflows?limit=100"),
      supabase.from("project_workflows").select("workflow_id, project_id, workflow_name, updated_at"),
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

    const executionResponses = await Promise.all(
      selectedWorkflowIds.slice(0, 25).map(async (workflowId) => {
        try {
          const result = await n8nGet<{ data?: N8nExecution[] }>(
            context.baseUrl,
            context.apiKey,
            "/api/v1/executions?workflowId=" + encodeURIComponent(workflowId) + "&limit=50&includeData=false"
          );
          return result.data ?? [];
        } catch (error) {
          console.error("Automed n8n execution lookup failed for workflow:", workflowId, error);
          return [];
        }
      })
    );

    const workflowNames = new Map(workflows.map((workflow) => [workflow.id, workflow.name]));
    const executions = executionResponses.flat().map((execution) => ({
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

    const workflowResponse = await n8nGet<{ data?: N8nWorkflow[] }>(baseUrl, apiKey, "/api/v1/workflows?limit=100");
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
