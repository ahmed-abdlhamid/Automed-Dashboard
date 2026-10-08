"use client";

import { useI18n } from "@/components/Providers";
import {
  Card,
  PageHeader,
} from "@/components/ui";

export default function AutomationView({
  projectName,
}: {
  projectName: string;
}) {
  const { t } =
    useI18n();

  return (
    <>
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <div className="p-6">
            <div className="metric-icon">
              ⚡
            </div>

            <h2 className="mt-5 font-head text-base font-semibold">
              {t({
                ar: "سير العمل",
                en: "Workflows",
              })}
            </h2>

            <p className="mt-2 text-sm leading-6 text-mut">
              {t({
                ar: "إدارة ومتابعة سير العمل المرتبط بالمشروع.",
                en: "Manage and monitor workflows connected to this project.",
              })}
            </p>

            <div className="mt-5 rounded-2xl bg-surface-soft px-4 py-3">
              <p className="text-xs text-mut">
                {t({
                  ar: "قريبًا",
                  en: "Coming soon",
                })}
              </p>

              <p className="mt-1 text-sm font-medium">
                {t({
                  ar: "سيتم ربطها بـ n8n",
                  en: "n8n integration will be added",
                })}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="metric-icon">
              🤖
            </div>

            <h2 className="mt-5 font-head text-base font-semibold">
              {t({
                ar: "الوكلاء الذكيون",
                en: "AI agents",
              })}
            </h2>

            <p className="mt-2 text-sm leading-6 text-mut">
              {t({
                ar: "متابعة الوكلاء والأنظمة الذكية التي تعمل ضمن المشروع.",
                en: "Monitor the AI agents and intelligent systems running for the project.",
              })}
            </p>

            <div className="mt-5 rounded-2xl bg-surface-soft px-4 py-3">
              <p className="text-xs text-mut">
                {t({
                  ar: "قريبًا",
                  en: "Coming soon",
                })}
              </p>

              <p className="mt-1 text-sm font-medium">
                {t({
                  ar: "سيتم ربط الوكلاء والعمليات الفعلية هنا",
                  en: "Live agents and operations will appear here",
                })}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="metric-icon">
              🔗
            </div>

            <h2 className="mt-5 font-head text-base font-semibold">
              {t({
                ar: "التكاملات",
                en: "Integrations",
              })}
            </h2>

            <p className="mt-2 text-sm leading-6 text-mut">
              {t({
                ar: "إدارة الخدمات والتكاملات التي يعتمد عليها المشروع.",
                en: "Manage the services and integrations used by this project.",
              })}
            </p>

            <div className="mt-5 rounded-2xl bg-surface-soft px-4 py-3">
              <p className="text-xs text-mut">
                {t({
                  ar: "قريبًا",
                  en: "Coming soon",
                })}
              </p>

              <p className="mt-1 text-sm font-medium">
                {t({
                  ar: "ستظهر التكاملات وحالتها الفعلية هنا",
                  en: "Live integrations and their status will appear here",
                })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card
        title={t({
          ar: "مركز التحكم في الأتمتة",
          en: "Automation control center",
        })}
        subtitle={t({
          ar: "المكان المخصص لإدارة الأنظمة والأتمتة الخاصة بالمشروع",
          en: "The workspace for managing this project's automation",
        })}
        className="mt-4"
      >
        <div className="p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-soft text-teal">
            ⚙️
          </div>

          <h3 className="mt-4 font-head text-base font-semibold">
            {t({
              ar: "جاهز للربط بـ n8n",
              en: "Ready for n8n integration",
            })}
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-mut">
            {t({
              ar: "هنستخدم المساحة دي بعدين لمتابعة الـ workflows، الوكلاء الذكيين، التكاملات، وآخر عمليات التنفيذ الفعلية بدل الاعتماد على بيانات تجريبية.",
              en: "This workspace will later show real workflows, AI agents, integrations, and execution history instead of placeholder status data.",
            })}
          </p>
        </div>
      </Card>
    </>
  );
}