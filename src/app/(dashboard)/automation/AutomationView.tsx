"use client";

import { useI18n } from "@/components/Providers";
import type { Overview } from "@/lib/data";
import { Badge, Card, PageHeader } from "@/components/ui";

export default function AutomationView({
  data,
}: {
  data: Overview;
}) {
  const { t } = useI18n();

  return (
    <>
      <PageHeader
        title={t({
          ar: "الأتمتة",
          en: "Automation",
        })}
        subtitle={t({
          ar: "تابع الخدمات وسير العمل المتصل بالمشروع الحالي",
          en: "Monitor the services and workflows connected to this project",
        })}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.services.map((service) => (
          <Card key={service.name.en}>
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="metric-icon">
                  <span className="system-dot" />
                </div>

                <Badge tone={service.ok ? "ok" : "danger"}>
                  {service.ok
                    ? t({ ar: "يعمل", en: "Operational" })
                    : t({ ar: "متوقف", en: "Down" })}
                </Badge>
              </div>

              <h2 className="mt-5 font-head text-sm font-semibold">
                {t(service.name)}
              </h2>

              <p className="mt-1 text-xs text-mut">
                {t({
                  ar: "متصل بالمشروع الحالي.",
                  en: "Connected to the current project.",
                })}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Card
        title={t({
          ar: "مساحة الأتمتة",
          en: "Automation workspace",
        })}
        subtitle={t({
          ar: "إدارة سير العمل ستكون هنا",
          en: "Workflow management will live here",
        })}
        className="mt-4"
      >
        <div className="p-8 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-teal-soft text-teal">
            ⚡
          </div>

          <h3 className="mt-4 font-head text-base font-semibold">
            {t({
              ar: "مركز التحكم في سير العمل",
              en: "Workflow control center",
            })}
          </h3>

          <p className="mx-auto mt-2 max-w-lg text-xs leading-6 text-mut">
            {t({
              ar: "المساحة دي جاهزة لإضافة سير العمل والأتمتة والوكلاء الذكيين والتكاملات اللي هنربطها بـ Automed.",
              en: "This area is ready for the workflows, AI agents and integrations we will connect to Automed next.",
            })}
          </p>
        </div>
      </Card>
    </>
  );
}
