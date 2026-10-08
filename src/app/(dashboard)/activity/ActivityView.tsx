"use client";

import { useI18n } from "@/components/Providers";
import { dashboardConfig as cfg } from "@/config/dashboard.config";
import { statusMeta, type Order } from "@/lib/data";
import { Badge, Card, Icon, PageHeader } from "@/components/ui";

function formatDate(date: string): string {
  const parts = date.split("-");
  return parts.length === 3
    ? `${parts[2]}/${parts[1]}/${parts[0]}`
    : date;
}

export default function ActivityView({
  orders,
}: {
  orders: Order[];
}) {
  const { t } = useI18n();

  return (
    <>
      <PageHeader
        title={t({ ar: "النشاط", en: "Activity" })}
        subtitle={t({
          ar: "آخر الأحداث في المشروع الحالي",
          en: "Recent events from the current project",
        })}
      />

      <Card>
        <div className="p-2">
          {orders.map((order) => (
            <div key={order.id} className="system-item">
              <div className="flex min-w-0 items-center gap-3">
                <span className="metric-icon shrink-0">
                  <Icon name="orders" size={18} />
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {t({ ar: "طلب", en: "Order" })} #{order.id}
                  </p>

                  <p className="mt-0.5 text-xs text-mut">
                    <bdi>{order.customer}</bdi>
                    {" · "}
                    <span dir="ltr">
                      {formatDate(order.date)} {order.time}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <span
                  dir="ltr"
                  className="hidden text-sm font-semibold sm:inline"
                >
                  {order.amount.toLocaleString("en-US")}{" "}
                  {cfg.project.currency}
                </span>

                <Badge tone={statusMeta[order.status].tone}>
                  {t(statusMeta[order.status].label)}
                </Badge>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="p-8 text-center text-sm text-mut">
              {t({
                ar: "لا يوجد نشاط حتى الآن.",
                en: "No activity yet.",
              })}
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
