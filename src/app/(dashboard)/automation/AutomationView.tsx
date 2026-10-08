"use client";

import { useI18n } from "@/components/Providers";
import {
  Card,
  Icon,
  PageHeader,
} from "@/components/ui";

export default function AutomationView({
  projectName,
}: {
  projectName: string;
}) {
  const { t } = useI18n();

  const modules = [
    {
      icon: "pulse" as const,
      title: {
        ar: "سير العمل",
        en: "Workflows",
      },
      description: {
        ar: "إدارة ومتابعة عمليات الأتمتة المرتبطة بالمشروع.",
        en: "Manage and monitor automation workflows connected to the project.",
      },
      status: {
        ar: "جاهز للربط",
        en: "Ready to connect",
      },
      tone: "teal",
    },
    {
      icon: "users" as const,
      title: {
        ar: "الوكلاء الذكيون",
        en: "AI agents",
      },
      description: {
        ar: "متابعة الوكلاء والأنظمة الذكية التي تعمل ضمن المشروع.",
        en: "Monitor the AI agents and intelligent systems running for the project.",
      },
      status: {
        ar: "قريبًا",
        en: "Coming soon",
      },
      tone: "orange",
    },
    {
      icon: "activity" as const,
      title: {
        ar: "سجل التنفيذ",
        en: "Execution history",
      },
      description: {
        ar: "عرض عمليات التنفيذ والنتائج والأخطاء بشكل واضح.",
        en: "View executions, results and errors in one place.",
      },
      status: {
        ar: "قريبًا",
        en: "Coming soon",
      },
      tone: "teal",
    },
    {
      icon: "wallet" as const,
      title: {
        ar: "التكاملات",
        en: "Integrations",
      },
      description: {
        ar: "إدارة الخدمات والأنظمة المتصلة بأتمتة المشروع.",
        en: "Manage the services and systems connected to the automation.",
      },
      status: {
        ar: "قريبًا",
        en: "Coming soon",
      },
      tone: "orange",
    },
  ];

  return (
    <div className="automation-page">
      <PageHeader
        title={t({
          ar: "الأتمتة",
          en: "Automation",
        })}
        subtitle={t({
          ar: `مركز التحكم في أتمتة مشروع ${projectName}`,
          en: `Automation control center for ${projectName}`,
        })}
      />

      <section className="automation-hero">
        <div className="automation-hero-content">
          <div className="automation-hero-icon">
            <Icon name="pulse" size={21} />
          </div>

          <div>
            <div className="automation-hero-label">
              <span className="automation-status-dot" />

              {t({
                ar: "بيئة الأتمتة",
                en: "Automation environment",
              })}
            </div>

            <h2>
              {t({
                ar: "كل عمليات مشروعك في مكان واحد",
                en: "Your project's automation in one place",
              })}
            </h2>

            <p>
              {t({
                ar: "مساحة مخصصة لإدارة الـ workflows والوكلاء الذكيين والتكاملات وسجل التنفيذ.",
                en: "A dedicated workspace for workflows, AI agents, integrations and execution history.",
              })}
            </p>
          </div>
        </div>

        <div className="automation-hero-badge">
          <span>
            {t({
              ar: "n8n",
              en: "n8n",
            })}
          </span>

          <small>
            {t({
              ar: "سيتم الربط لاحقًا",
              en: "Integration planned",
            })}
          </small>
        </div>
      </section>

      <section className="automation-module-grid">
        {modules.map((module) => (
          <Card
            key={module.title.en}
            className="automation-module-card"
          >
            <div className="automation-module-icon-wrap">
              <span
                className={
                  module.tone === "orange"
                    ? "automation-module-icon automation-module-icon-orange"
                    : "automation-module-icon"
                }
              >
                <Icon
                  name={module.icon}
                  size={19}
                />
              </span>

              <span className="automation-module-status">
                {t(module.status)}
              </span>
            </div>

            <h3>
              {t(module.title)}
            </h3>

            <p>
              {t(module.description)}
            </p>

            <div className="automation-module-footer">
              <span>
                {t({
                  ar: "غير متصل حاليًا",
                  en: "Not connected yet",
                })}
              </span>

              <Icon
                name="arrowUpRight"
                size={14}
              />
            </div>
          </Card>
        ))}
      </section>

      <section className="automation-control-card">
        <div className="automation-control-header">
          <div>
            <div className="automation-control-eyebrow">
              <Icon name="pulse" size={14} />

              {t({
                ar: "مركز التحكم",
                en: "Control center",
              })}
            </div>

            <h2>
              {t({
                ar: "جاهز للربط بالأنظمة الفعلية",
                en: "Ready for live system integration",
              })}
            </h2>

            <p>
              {t({
                ar: "بعد ربط n8n، ستتحول هذه المساحة من واجهة تعريفية إلى مركز فعلي لمتابعة وتشغيل الأتمتة.",
                en: "Once n8n is connected, this workspace will become the live center for monitoring and operating your automations.",
              })}
            </p>
          </div>

          <div className="automation-control-visual">
            <div className="automation-orbit automation-orbit-one" />
            <div className="automation-orbit automation-orbit-two" />

            <div className="automation-control-core">
              <Icon
                name="pulse"
                size={23}
              />
            </div>
          </div>
        </div>

        <div className="automation-roadmap">
          <div className="automation-roadmap-item automation-roadmap-active">
            <span>01</span>

            <div>
              <strong>
                {t({
                  ar: "ربط المشروع",
                  en: "Connect project",
                })}
              </strong>

              <p>
                {t({
                  ar: "تحديد المشروع ونطاق البيانات.",
                  en: "Define project scope and data.",
                })}
              </p>
            </div>
          </div>

          <div className="automation-roadmap-item">
            <span>02</span>

            <div>
              <strong>
                {t({
                  ar: "ربط n8n",
                  en: "Connect n8n",
                })}
              </strong>

              <p>
                {t({
                  ar: "استقبال بيانات التنفيذ الفعلية.",
                  en: "Receive live execution data.",
                })}
              </p>
            </div>
          </div>

          <div className="automation-roadmap-item">
            <span>03</span>

            <div>
              <strong>
                {t({
                  ar: "المراقبة والتحكم",
                  en: "Monitor & control",
                })}
              </strong>

              <p>
                {t({
                  ar: "متابعة العمليات والحالة والأخطاء.",
                  en: "Monitor operations, status and errors.",
                })}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}