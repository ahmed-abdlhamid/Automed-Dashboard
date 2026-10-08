"use client";

import { useI18n } from "@/components/Providers";
import type {
  Analytics,
} from "@/lib/data";
import {
  Card,
  Donut,
  PageHeader,
} from "@/components/ui";
import { AnalyticsChart } from "./AnalyticsChart";

export default function AnalyticsView({
  data,
}: {
  data: Analytics;
}) {
  const { t } = useI18n();

  const currency =
    "EGP";

  const formatMoney = (
    value: number
  ) =>
    `${value.toLocaleString(
      "en-US"
    )} ${currency}`;

  const metrics = [
    {
      label: {
        ar: "الإيرادات المدفوعة",
        en: "Paid revenue",
      },
      value:
        formatMoney(
          data.stats.revenue
        ),
    },

    {
      label: {
        ar: "إجمالي الطلبات",
        en: "Total orders",
      },
      value:
        data.stats.orders.toLocaleString(
          "en-US"
        ),
    },

    {
      label: {
        ar: "العملاء",
        en: "Customers",
      },
      value:
        data.stats.customers.toLocaleString(
          "en-US"
        ),
    },

    {
      label: {
        ar: "متوسط الطلب",
        en: "Average order",
      },
      value:
        formatMoney(
          data.stats.averageOrderValue
        ),
    },
  ];

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

      {/* Main metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(
          (metric) => (
            <Card
              key={
                metric.label.en
              }
            >
              <div className="p-5">
                <p className="text-xs text-mut">
                  {t(
                    metric.label
                  )}
                </p>

                <p className="mt-2 font-head text-2xl font-bold">
                  {metric.value}
                </p>
              </div>
            </Card>
          )
        )}
      </div>

      {/* Revenue + payment rate */}
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
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
          <AnalyticsChart
            data={data.weekly}
          />
        </Card>

        <Card
          title={t({
            ar: "معدل الدفع",
            en: "Payment rate",
          })}
          subtitle={t({
            ar: "نسبة الطلبات التي تم دفعها",
            en: "Percentage of orders that were paid",
          })}
        >
          <div className="flex min-h-[250px] items-center justify-center p-5">
            <Donut
              value={
                data.stats.paidRate
              }
              label={t({
                ar: "نسبة الدفع",
                en: "Paid rate",
              })}
            />
          </div>
        </Card>
      </div>

      {/* Payment status */}
      <div className="mt-4">
        <Card
          title={t({
            ar: "حالة الطلبات",
            en: "Order status",
          })}
          subtitle={t({
            ar: "توزيع الطلبات حسب حالة الدفع الحالية",
            en: "Orders grouped by their current payment status",
          })}
        >
          <div className="grid gap-3 p-5 md:grid-cols-3">
            {data.statusBreakdown.map(
              (item) => {
                const isPaid =
                  item.status ===
                  "paid";

                const isPending =
                  item.status ===
                  "pending";

                const label =
                  isPaid
                    ? {
                        ar: "مدفوع",
                        en: "Paid",
                      }
                    : isPending
                      ? {
                          ar: "قيد الانتظار",
                          en: "Pending",
                        }
                      : {
                          ar: "فشل",
                          en: "Failed",
                        };

                const icon =
                  isPaid
                    ? "check"
                    : isPending
                      ? "clock"
                      : "x";

                const background =
                  isPaid
                    ? "bg-teal-soft"
                    : isPending
                      ? "bg-orange-soft"
                      : "bg-red-soft";

                return (
                  <div
                    key={
                      item.status
                    }
                    className={`rounded-2xl ${background} p-4`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">
                          {t(label)}
                        </p>

                        <p className="mt-1 text-xs text-mut">
                          {item.percentage}%
                        </p>
                      </div>

                      <span className="font-head text-2xl font-bold">
                        {item.count.toLocaleString(
                          "en-US"
                        )}
                      </span>
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--surface)]">
                      <div
                        className={`h-full rounded-full ${
                          isPaid
                            ? "bg-teal"
                            : isPending
                              ? "bg-orange"
                              : "bg-red-500"
                        }`}
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </Card>
      </div>

      {/* Additional insights */}
      <div className="mt-4">
        <Card
          title={t({
            ar: "ملخص الأداء",
            en: "Performance summary",
          })}
          subtitle={t({
            ar: "أهم مؤشرات الطلبات الحالية",
            en: "Key indicators from current orders",
          })}
        >
          <div className="grid gap-3 p-5 sm:grid-cols-3">
            <div className="rounded-2xl bg-surface-soft p-4">
              <p className="text-xs text-mut">
                {t({
                  ar: "طلبات مدفوعة",
                  en: "Paid orders",
                })}
              </p>

              <p className="mt-1 font-head text-2xl font-bold">
                {data.stats.paidOrders.toLocaleString(
                  "en-US"
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-surface-soft p-4">
              <p className="text-xs text-mut">
                {t({
                  ar: "طلبات قيد الانتظار",
                  en: "Pending orders",
                })}
              </p>

              <p className="mt-1 font-head text-2xl font-bold">
                {data.stats.pendingOrders.toLocaleString(
                  "en-US"
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-surface-soft p-4">
              <p className="text-xs text-mut">
                {t({
                  ar: "طلبات فاشلة",
                  en: "Failed orders",
                })}
              </p>

              <p className="mt-1 font-head text-2xl font-bold">
                {data.stats.failedOrders.toLocaleString(
                  "en-US"
                )}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}