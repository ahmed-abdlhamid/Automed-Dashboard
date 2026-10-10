import { NextResponse } from "next/server";
import { isCurrentUserAdmin } from "@/lib/project";

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
  const response = await fetch(new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`), {
    method: "GET",
    headers: {
      "X-N8N-API-KEY": apiKey,
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`n8n API returned ${response.status}${details ? `: ${details.slice(0, 180)}` : ""}`);
  }

  return response.json() as Promise<T>;
}

export async function GET() {
  try {
    const isAdmin = await isCurrentUserAdmin();

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const baseUrl = process.env.N8N_BASE_URL?.trim();
    const apiKey = process.env.N8N_API_KEY?.trim();

    if (!baseUrl || !apiKey) {
      return NextResponse.json(
        {
          error: "n8n is not configured yet. Add N8N_BASE_URL and N8N_API_KEY to the server environment.",
          code: "N8N_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    let parsedBaseUrl: URL;
    try {
      parsedBaseUrl = new URL(baseUrl);
    } catch {
      return NextResponse.json(
        { error: "N8N_BASE_URL must be a valid URL.", code: "N8N_INVALID_URL" },
        { status: 500 }
      );
    }

    if (parsedBaseUrl.protocol !== "https:" && parsedBaseUrl.hostname !== "localhost" && parsedBaseUrl.hostname !== "127.0.0.1") {
      return NextResponse.json(
        { error: "Use an HTTPS URL for the n8n tunnel.", code: "N8N_HTTPS_REQUIRED" },
        { status: 500 }
      );
    }

    const [workflowResponse, executionResponse] = await Promise.all([
      n8nGet<{ data?: N8nWorkflow[] }>(baseUrl, apiKey, "/api/v1/workflows?limit=100"),
      n8nGet<{ data?: N8nExecution[] }>(baseUrl, apiKey, "/api/v1/executions?limit=50&includeData=false"),
    ]);

    const workflows = (workflowResponse.data ?? []).map((workflow) => ({
      id: workflow.id,
      name: workflow.name || "Unnamed workflow",
      active: Boolean(workflow.active),
      nodeCount: Array.isArray(workflow.nodes) ? workflow.nodes.length : 0,
      updatedAt: workflow.updatedAt ?? null,
      createdAt: workflow.createdAt ?? null,
    }));

    const workflowNames = new Map(workflows.map((workflow) => [workflow.id, workflow.name]));
    const executions = (executionResponse.data ?? []).map((execution) => ({
      id: execution.id,
      workflowId: execution.workflowId ?? "",
      workflowName: workflowNames.get(execution.workflowId ?? "") ?? "Workflow",
      status: execution.status ?? "unknown",
      startedAt: execution.startedAt ?? null,
      stoppedAt: execution.stoppedAt ?? null,
      mode: execution.mode ?? "unknown",
    }));

    return NextResponse.json({
      connected: true,
      fetchedAt: new Date().toISOString(),
      workflows,
      executions,
      stats: {
        workflows: workflows.length,
        activeWorkflows: workflows.filter((workflow) => workflow.active).length,
        executions: executions.length,
        successfulExecutions: executions.filter((execution) => execution.status === "success").length,
        failedExecutions: executions.filter((execution) => execution.status === "error").length,
        runningExecutions: executions.filter((execution) => execution.status === "running" || execution.status === "waiting").length,
      },
    }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Automed n8n integration error:", error);
    const message = error instanceof Error ? error.message : "Could not reach n8n.";
    return NextResponse.json(
      {
        error: message.includes("n8n API returned")
          ? message
          : "Could not connect to n8n. Check the tunnel URL, API key, and that n8n is running.",
        code: "N8N_CONNECTION_FAILED",
      },
      { status: 502 }
    );
  }
}
