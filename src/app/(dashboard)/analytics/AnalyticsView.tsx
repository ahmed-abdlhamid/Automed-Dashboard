"use client";

import { useI18n } from "@/components/Providers";
import type { Overview } from "@/lib/data";
import { Card, Donut, PageHeader } from "@/components/ui";
import { AnalyticsChart } from "./AnalyticsChart";

export default function AnalyticsView({
  data,
}: {
  data: Overview;
}) {
  const { t } = useI18n();

  return (
    <>
      <PageHeader
        title={t({
          ar: "التحليلات",
          en: "Analytics",
        })}
        subtitle={t({
          ar: "رؤى الأداء والإيرادات للمشروع الحالي",
          en: "Performance and revenue insights for the current project",
        })}
      />

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card
          title={t({
            ar: "اتجاه الإيرادات",
            en: "Revenue trend",
          })}
          subtitle={t({
            ar: "الإيرادات المدفوعة خلال آخر 7 أيام",
            en: "Paid revenue over the last 7 days",
          })}
        >
          <AnalyticsChart data={data.weekly} />
        </Card>

        <Card
          title={t({
            ar: "المؤشرات الرئيسية",
            en: "Key metrics",
          })}
          subtitle={t({
            ar: "ملخص سريع للمشروع الحالي",
            en: "Current project snapshot",
          })}
        >
          <div className="p-5">
            <Donut
              value={data.stats.paidRate}
              label={t({ ar: "نسبة الدفع", en: "Paid rate" })}
            />

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-teal-soft p-4">
                <p className="text-xs text-mut">
                  {t({ ar: "الطلبات", en: "Orders" })}
                </p>
                <p className="mt-1 font-head text-2xl font-bold">
                  {data.stats.orders.toLocaleString("en-US")}
                </p>
              </div>

              <div className="rounded-2xl bg-teal-soft p-4">
                <p className="text-xs text-mut">
                  {t({ ar: "العملاء", en: "Customers" })}
                </p>
                <p className="mt-1 font-head text-2xl font-bold">
                  {data.stats.customers.toLocaleString("en-US")}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
