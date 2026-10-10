"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/components/Providers";
import { Card, Icon, PageHeader } from "@/components/ui";

type Workflow = {
  id: string;
  name: string;
  active: boolean;
  nodeCount: number;
  updatedAt: string | null;
  createdAt: string | null;
};

type Execution = {
  id: string;
  workflowId: string;
  workflowName: string;
  status: string;
  startedAt: string | null;
  stoppedAt: string | null;
  mode: string;
};

type N8nData = {
  connected: boolean;
  fetchedAt: string;
  workflows: Workflow[];
  executions: Execution[];
  stats: {
    workflows: number;
    activeWorkflows: number;
    executions: number;
    successfulExecutions: number;
    failedExecutions: number;
    runningExecutions: number;
  };
};

function formatDate(value: string | null, lang: "ar" | "en") {
  if (!value) return lang === "ar" ? "غير متاح" : "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function statusLabel(status: string, lang: "ar" | "en") {
  const labels: Record<string, { ar: string; en: string }> = {
    success: { ar: "نجاح", en: "Success" },
    error: { ar: "فشل", en: "Failed" },
    running: { ar: "قيد التشغيل", en: "Running" },
    waiting: { ar: "في الانتظار", en: "Waiting" },
    canceled: { ar: "تم الإلغاء", en: "Canceled" },
    unknown: { ar: "غير معروف", en: "Unknown" },
  };
  return labels[status]?.[lang] ?? status;
}

function statusTone(status: string) {
  if (status === "success") return "automation-live-status-ok";
  if (status === "error") return "automation-live-status-error";
  if (status === "running" || status === "waiting") return "automation-live-status-running";
  return "automation-live-status-muted";
}

export default function AutomationView({ projectName }: { projectName: string }) {
  const { t, lang } = useI18n();
  const [data, setData] = useState<N8nData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/automation/n8n", {
        method: "GET",
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : (lang === "ar" ? "تعذر تحميل بيانات n8n." : "Could not load n8n data.")
        );
      }

      setData(result as N8nData);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : (lang === "ar" ? "حدث خطأ أثناء الاتصال بـ n8n." : "An error occurred while connecting to n8n.")
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [lang]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const stats = data?.stats;
  const statCards = [
    {
      key: "workflows",
      icon: "automation" as const,
      label: { ar: "إجمالي الـ Workflows", en: "Total workflows" },
      value: stats?.workflows ?? "—",
      detail: stats ? (lang === "ar" ? `${stats.activeWorkflows} مفعّل` : `${stats.activeWorkflows} active`) : "",
    },
    {
      key: "executions",
      icon: "activity" as const,
      label: { ar: "التنفيذات المعروضة", en: "Executions loaded" },
      value: stats?.executions ?? "—",
      detail: lang === "ar" ? "آخر 50 تنفيذًا" : "Latest 50 executions",
    },
    {
      key: "success",
      icon: "check" as const,
      label: { ar: "تنفيذات ناجحة", en: "Successful executions" },
      value: stats?.successfulExecutions ?? "—",
      detail: lang === "ar" ? "ضمن السجل المحمّل" : "In the loaded history",
    },
    {
      key: "failed",
      icon: "pulse" as const,
      label: { ar: "تنفيذات فاشلة", en: "Failed executions" },
      value: stats?.failedExecutions ?? "—",
      detail: stats ? (lang === "ar" ? `${stats.runningExecutions} قيد التشغيل/الانتظار` : `${stats.runningExecutions} running/waiting`) : "",
    },
  ];

  return (
    <div className="automation-page">
      <PageHeader
        title={t({ ar: "الأتمتة", en: "Automation" })}
        subtitle={t({
          ar: `مركز متابعة الأتمتة لمشروع ${projectName}`,
          en: `Automation monitoring for ${projectName}`,
        })}
        action={
          <button
            type="button"
            className="automation-refresh-button"
            onClick={() => void loadData(true)}
            disabled={loading || refreshing}
          >
            <Icon name="activity" size={16} />
            {refreshing
              ? t({ ar: "جاري التحديث...", en: "Refreshing..." })
              : t({ ar: "تحديث البيانات", en: "Refresh data" })}
          </button>
        }
      />

      <section className="automation-hero">
        <div className="automation-hero-content">
          <div className="automation-hero-icon">
            <Icon name="pulse" size={21} />
          </div>
          <div>
            <div className="automation-hero-label">
              <span className="automation-status-dot" />
              {t({ ar: "حالة الاتصال", en: "Connection status" })}
            </div>
            <h2>
              {data?.connected
                ? t({ ar: "n8n متصل بالداشبورد", en: "n8n is connected to your dashboard" })
                : t({ ar: "مركز متابعة عمليات الأتمتة", en: "Your automation monitoring center" })}
            </h2>
            <p>
              {data?.connected
                ? t({
                    ar: "البيانات المعروضة مباشرة من n8n، وتشمل سير العمل وآخر التنفيذات وحالاتها.",
                    en: "Live data from n8n, including workflows, recent executions and their statuses.",
                  })
                : t({
                    ar: "هنعرض هنا حالة الـ workflows والتنفيذات الفعلية بمجرد اكتمال إعداد الاتصال.",
                    en: "Live workflow and execution information will appear here once the connection is configured.",
                  })}
            </p>
          </div>
        </div>
        <div className="automation-hero-badge">
          <span>n8n</span>
          <small>
            {loading
              ? t({ ar: "جاري الاتصال", en: "Connecting" })
              : data?.connected
                ? t({ ar: "متصل", en: "Connected" })
                : t({ ar: "يحتاج إعدادًا", en: "Setup required" })}
          </small>
        </div>
      </section>

      {error && (
        <div className="automation-live-error" role="alert">
          <strong>{t({ ar: "تعذر تحميل بيانات n8n", en: "Could not load n8n data" })}</strong>
          <p>{error}</p>
          <span>
            {t({
              ar: "تأكد من إضافة N8N_BASE_URL وN8N_API_KEY في إعدادات Environment Variables في Vercel.",
              en: "Check that N8N_BASE_URL and N8N_API_KEY are set in Vercel Environment Variables.",
            })}
          </span>
        </div>
      )}

      <section className="automation-live-stats">
        {statCards.map((item) => (
          <Card key={item.key} className="automation-live-stat-card">
            <div className="automation-live-stat-top">
              <span className="automation-live-stat-icon">
                <Icon name={item.icon} size={18} />
              </span>
              <span>{t(item.label)}</span>
            </div>
            <strong>{loading ? "…" : item.value}</strong>
            <small>{item.detail}</small>
          </Card>
        ))}
      </section>

      <section className="automation-live-grid">
        <Card
          className="automation-live-panel"
          title={t({ ar: "سير العمل (Workflows)", en: "Workflows" })}
          subtitle={t({ ar: "قائمة سير العمل الموجودة في n8n", en: "Workflows available in n8n" })}
        >
          {loading ? (
            <div className="automation-live-empty">{t({ ar: "جاري تحميل سير العمل...", en: "Loading workflows..." })}</div>
          ) : data?.workflows.length ? (
            <div className="automation-live-list">
              {data.workflows.map((workflow) => (
                <div className="automation-live-row" key={workflow.id}>
                  <span className="automation-live-row-icon"><Icon name="automation" size={17} /></span>
                  <div className="automation-live-row-main">
                    <strong>{workflow.name}</strong>
                    <small>
                      {lang === "ar" ? "معرّف" : "ID"}: {workflow.id}
                      {" · "}
                      {workflow.nodeCount} {lang === "ar" ? "عقد" : "nodes"}
                    </small>
                  </div>
                  <span className={workflow.active ? "automation-live-status automation-live-status-ok" : "automation-live-status automation-live-status-muted"}>
                    {workflow.active
                      ? t({ ar: "مفعّل", en: "Active" })
                      : t({ ar: "متوقف", en: "Inactive" })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="automation-live-empty">
              {t({ ar: "مفيش Workflows ظاهرة حاليًا في حساب n8n ده.", en: "No workflows are currently visible in this n8n account." })}
            </div>
          )}
        </Card>

        <Card
          className="automation-live-panel"
          title={t({ ar: "آخر التنفيذات", en: "Recent executions" })}
          subtitle={t({ ar: "آخر 50 تنفيذًا متاحًا من n8n", en: "Latest 50 executions available from n8n" })}
        >
          {loading ? (
            <div className="automation-live-empty">{t({ ar: "جاري تحميل سجل التنفيذ...", en: "Loading execution history..." })}</div>
          ) : data?.executions.length ? (
            <div className="automation-live-list">
              {data.executions.map((execution) => (
                <div className="automation-live-row" key={execution.id}>
                  <span className="automation-live-row-icon"><Icon name="activity" size={17} /></span>
                  <div className="automation-live-row-main">
                    <strong>{execution.workflowName}</strong>
                    <small>
                      #{execution.id}
                      {" · "}
                      {formatDate(execution.startedAt, lang)}
                    </small>
                  </div>
                  <span className={`automation-live-status ${statusTone(execution.status)}`}>
                    {statusLabel(execution.status, lang)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="automation-live-empty">
              {t({ ar: "لسه مفيش تنفيذات ظاهرة في السجل.", en: "No executions are currently available in the history." })}
            </div>
          )}
        </Card>
      </section>

      {data?.fetchedAt && (
        <p className="automation-live-updated">
          {t({ ar: "آخر تحديث", en: "Last updated" })}: {formatDate(data.fetchedAt, lang)}
        </p>
      )}
    </div>
  );
}
