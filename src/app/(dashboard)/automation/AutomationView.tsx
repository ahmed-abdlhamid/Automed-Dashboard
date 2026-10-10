"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/Providers";
import { Card, Icon, PageHeader } from "@/components/ui";

type ProjectOption = { id: string; name: string };
type Workflow = {
  id: string; name: string; active: boolean; nodeCount: number;
  updatedAt: string | null; createdAt: string | null;
  projectId: string | null; mappedProjectName: string | null;
};
type Execution = {
  id: string; workflowId: string; workflowName: string;
  status: string; startedAt: string | null; stoppedAt: string | null; mode: string;
};
type N8nData = {
  connected: boolean; fetchedAt: string; selectedProjectId: string;
  projects: ProjectOption[]; workflows: Workflow[]; executions: Execution[];
  stats: { workflows: number; activeWorkflows: number; executions: number;
    successfulExecutions: number; failedExecutions: number; runningExecutions: number };
};

function formatDate(value: string | null, lang: "ar" | "en") {
  if (!value) return lang === "ar" ? "غير متاح" : "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
    dateStyle: "medium", timeStyle: "short",
  }).format(date);
}
function statusLabel(status: string, lang: "ar" | "en") {
  const labels: Record<string, { ar: string; en: string }> = {
    success: { ar: "نجاح", en: "Success" }, error: { ar: "فشل", en: "Failed" },
    running: { ar: "قيد التشغيل", en: "Running" }, waiting: { ar: "في الانتظار", en: "Waiting" },
    canceled: { ar: "تم الإلغاء", en: "Canceled" }, unknown: { ar: "غير معروف", en: "Unknown" },
  };
  return labels[status]?.[lang] ?? status;
}
function statusTone(status: string) {
  if (status === "success") return "automation-live-status-ok";
  if (status === "error") return "automation-live-status-error";
  if (status === "running" || status === "waiting") return "automation-live-status-running";
  return "automation-live-status-muted";
}

export default function AutomationView({ projects, initialProjectId }: {
  projects: ProjectOption[]; initialProjectId: string;
}) {
  const { t, lang } = useI18n();
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [data, setData] = useState<N8nData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingWorkflowId, setSavingWorkflowId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const loadData = useCallback(async (projectId: string, manual = false) => {
    if (manual) setRefreshing(true); else setLoading(true);
    setError(null); setSaveMessage(null);
    try {
      const response = await fetch("/api/automation/n8n?projectId=" + encodeURIComponent(projectId), {
        method: "GET", cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Could not load n8n data.");
      setData(result as N8nData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : (lang === "ar" ? "تعذر الاتصال بـ n8n." : "Could not connect to n8n."));
      setData(null);
    } finally {
      setLoading(false); setRefreshing(false);
    }
  }, [lang]);

  useEffect(() => { void loadData(selectedProjectId); }, [loadData, selectedProjectId]);

  const selectedProject = projects.find((project) => project.id === selectedProjectId);
  const workflows = data?.workflows ?? [];
  const projectWorkflows = useMemo(() => workflows.filter((workflow) => workflow.projectId === selectedProjectId), [workflows, selectedProjectId]);
  const executions = data?.executions ?? [];
  const stats = data?.stats;

  const assignWorkflow = async (workflow: Workflow, targetProjectId: string) => {
    setSavingWorkflowId(workflow.id); setError(null); setSaveMessage(null);
    try {
      const response = await fetch("/api/automation/n8n", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowId: workflow.id, workflowName: workflow.name, projectId: targetProjectId || null }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Could not save assignment.");
      await loadData(selectedProjectId, true);
      setSaveMessage(lang === "ar" ? "تم حفظ ربط الـ Workflow بالمشروع." : "Workflow assignment saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : (lang === "ar" ? "تعذر حفظ الربط." : "Could not save assignment."));
    } finally { setSavingWorkflowId(null); }
  };

  const statCards = [
    { key: "workflows", icon: "automation" as const, label: { ar: "Workflows المشروع", en: "Project workflows" }, value: stats?.workflows ?? "—", detail: lang === "ar" ? "حالة تفعيل الـ Workflows" : "Workflow activation status" },
    { key: "executions", icon: "activity" as const, label: { ar: "التنفيذات المعروضة", en: "Executions loaded" }, value: stats?.executions ?? "—", detail: lang === "ar" ? "من آخر 50 تنفيذًا كحد أقصى" : "Of up to the latest 50 executions" },
    { key: "success", icon: "check" as const, label: { ar: "تنفيذات ناجحة", en: "Successful executions" }, value: stats?.successfulExecutions ?? "—", detail: lang === "ar" ? "ضمن سجل المشروع" : "In this project's history" },
    { key: "failed", icon: "pulse" as const, label: { ar: "تنفيذات فاشلة", en: "Failed executions" }, value: stats?.failedExecutions ?? "—", detail: lang === "ar" ? "قيد التشغيل أو الانتظار" : "Running or waiting" },
  ];

  return <div className="automation-page">
    <PageHeader
      title={t({ ar: "الأتمتة", en: "Automation" })}
      subtitle={t({ ar: "إدارة ومتابعة أتمتة مشاريع Automed من مكان واحد.", en: "Manage and monitor every Automed project's automation in one place." })}
      action={<button type="button" className="automation-refresh-button" onClick={() => void loadData(selectedProjectId, true)} disabled={loading || refreshing}>
        <Icon name="activity" size={16} />{refreshing ? t({ ar: "جاري التحديث...", en: "Refreshing..." }) : t({ ar: "تحديث البيانات", en: "Refresh data" })}
      </button>}
    />

    <section className="automation-project-picker">
      <div className="automation-project-picker-copy">
        <span className="automation-project-picker-icon"><Icon name="automation" size={19} /></span>
        <div><strong>{t({ ar: "المشروع المحدد", en: "Selected project" })}</strong>
          <p>{t({ ar: "اختر مشروعًا لعرض الـ Workflows والتنفيذات الخاصة به فقط.", en: "Choose a project to view only its workflows and executions." })}</p>
        </div>
      </div>
      <label className="automation-project-select-wrap"><span>{t({ ar: "المشروع", en: "Project" })}</span>
        <select value={selectedProjectId} onChange={(event) => setSelectedProjectId(event.target.value)}>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
        </select>
      </label>
    </section>

    <section className="automation-hero">
      <div className="automation-hero-content"><div className="automation-hero-icon"><Icon name="pulse" size={21} /></div>
        <div><div className="automation-hero-label"><span className="automation-status-dot" />{t({ ar: "حالة الاتصال", en: "Connection status" })}</div>
          <h2>{data?.connected ? t({ ar: "n8n متصل بالداشبورد", en: "n8n is connected to your dashboard" }) : t({ ar: "مركز متابعة عمليات الأتمتة", en: "Your automation monitoring center" })}</h2>
          <p>{data?.connected ? t({ ar: "المعروض الآن هو الأتمتة المرتبطة بمشروع " + (selectedProject?.name ?? "") + ".", en: "Showing automation assigned to " + (selectedProject?.name ?? "") + "." }) : t({ ar: "سيظهر هنا وضع الاتصال والبيانات الفعلية بمجرد اكتمال الإعداد.", en: "Connection status and live data appear here once configured." })}</p>
        </div>
      </div>
      <div className="automation-hero-badge"><span>n8n</span><small>{loading ? t({ ar: "جاري الاتصال", en: "Connecting" }) : data?.connected ? t({ ar: "متصل", en: "Connected" }) : t({ ar: "يحتاج إعدادًا", en: "Setup required" })}</small></div>
    </section>

    {error && <div className="automation-live-error" role="alert"><strong>{t({ ar: "تعذر إكمال العملية", en: "Could not complete the operation" })}</strong><p>{error}</p>
      <span>{t({ ar: "لو ظهر تنبيه عن project_workflows، نفّذ ملف SQL الخاص بإعداد ربط المشاريع في Supabase.", en: "If the error mentions project_workflows, run the setup SQL in Supabase." })}</span>
    </div>}
    {saveMessage && <div className="automation-project-save-message" role="status"><Icon name="check" size={16} />{saveMessage}</div>}

    <section className="automation-live-stats">{statCards.map((item) => <Card key={item.key} className="automation-live-stat-card">
      <div className="automation-live-stat-top"><span className="automation-live-stat-icon"><Icon name={item.icon} size={18} /></span><span>{t(item.label)}</span></div>
      <strong><bdi dir="ltr" className="automation-stat-number">{loading ? "…" : item.value}</bdi></strong><small>{item.detail}</small>
    </Card>)}</section>

    <section className="automation-live-grid">
      <Card className="automation-live-panel" title={t({ ar: "Workflows المشروع", en: "Project workflows" })} subtitle={t({ ar: "سير العمل المربوط بالمشروع المحدد", en: "Workflows assigned to the selected project" })}>
        {loading ? <div className="automation-live-empty">{t({ ar: "جاري تحميل سير العمل...", en: "Loading workflows..." })}</div>
          : projectWorkflows.length ? <div className="automation-live-list">{projectWorkflows.map((workflow) => <div className="automation-live-row" key={workflow.id}>
            <span className="automation-live-row-icon"><Icon name="automation" size={17} /></span>
            <div className="automation-live-row-main"><strong>{workflow.name}</strong><small>{lang === "ar" ? "معرّف" : "ID"}: {workflow.id} · {workflow.nodeCount} {lang === "ar" ? "عقد" : "nodes"}</small></div>
            <span className={workflow.active ? "automation-live-status automation-live-status-ok" : "automation-live-status automation-live-status-muted"}>{workflow.active ? t({ ar: "مفعّل", en: "Active" }) : t({ ar: "متوقف", en: "Inactive" })}</span>
          </div>)}</div>
          : <div className="automation-live-empty">{t({ ar: "مفيش Workflows مربوطة بالمشروع ده لسه. اربطها من قسم إدارة الربط بالأسفل.", en: "No workflows assigned yet. Assign one below." })}</div>}
      </Card>

      <Card className="automation-live-panel" title={t({ ar: "آخر التنفيذات", en: "Recent executions" })} subtitle={t({ ar: "سجل التنفيذ الخاص بالمشروع المحدد فقط", en: "Execution history for this project only" })}>
        {loading ? <div className="automation-live-empty">{t({ ar: "جاري تحميل سجل التنفيذ...", en: "Loading execution history..." })}</div>
          : executions.length ? <div className="automation-live-list">{executions.map((execution) => <div className="automation-live-row" key={execution.id}>
            <span className="automation-live-row-icon"><Icon name="activity" size={17} /></span>
            <div className="automation-live-row-main"><strong>{execution.workflowName}</strong><small>#{execution.id} · {formatDate(execution.startedAt, lang)}</small></div>
            <span className={"automation-live-status " + statusTone(execution.status)}>{statusLabel(execution.status, lang)}</span>
          </div>)}</div>
          : <div className="automation-live-empty">{t({ ar: "مفيش تنفيذات ظاهرة للمشروع ده حتى الآن.", en: "No executions are available for this project yet." })}</div>}
      </Card>
    </section>

    <Card className="automation-live-panel automation-project-management" title={t({ ar: "إدارة ربط الـ Workflows بالمشاريع", en: "Assign workflows to projects" })} subtitle={t({ ar: "اربط كل Workflow بمشروع مرة واحدة، وتقدر تغيّر الربط أو تلغيه.", en: "Assign each workflow to a project, and change or remove assignments whenever needed." })}>
      {loading ? <div className="automation-live-empty">{t({ ar: "جاري تحميل قائمة الـ Workflows...", en: "Loading workflow list..." })}</div>
        : workflows.length ? <div className="automation-assignment-list">{workflows.map((workflow) => <div className="automation-assignment-row" key={workflow.id}>
          <div className="automation-assignment-info"><strong>{workflow.name}</strong><small>{workflow.id}</small></div>
          <label className="automation-assignment-select"><span>{t({ ar: "المشروع المسؤول", en: "Assigned project" })}</span>
            <select value={workflow.projectId ?? ""} disabled={savingWorkflowId === workflow.id} onChange={(event) => void assignWorkflow(workflow, event.target.value)}>
              <option value="">{t({ ar: "غير مربوط", en: "Unassigned" })}</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          </label>
          {savingWorkflowId === workflow.id && <span className="automation-assignment-saving">{t({ ar: "جاري الحفظ...", en: "Saving..." })}</span>}
        </div>)}</div>
        : <div className="automation-live-empty">{t({ ar: "مش لاقيين Workflows في نسخة n8n المتصلة.", en: "No workflows found in the connected n8n instance." })}</div>}
      <p className="automation-project-management-note">{t({ ar: "أي Workflow غير مربوط لن يظهر في إحصائيات أي مشروع. اربطه بالمشروع الصحيح قبل الاعتماد على بياناته.", en: "Unassigned workflows are excluded from every project's stats. Assign each workflow to the correct project." })}</p>
    </Card>
    {data?.fetchedAt && <p className="automation-live-updated">{t({ ar: "آخر تحديث", en: "Last updated" })}: {formatDate(data.fetchedAt, lang)}</p>}
  </div>;
}
