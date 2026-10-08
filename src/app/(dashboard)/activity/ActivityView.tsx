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
        title={t({
          ar: "النشاط",
          en: "Activity",
        })}
        subtitle={t({
          ar: "آخر الأحداث في المشروع الحالي",
          en: "Recent events from the current project",
        })}
      />

      <Card>
        <div className="p-5 sm:p-6">
          {orders.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div
                className="
                  absolute
                  bottom-6
                  right-[17px]
                  top-6
                  w-px
                  bg-[var(--border)]
                  sm:right-[19px]
                "
              />

              <div className="space-y-0">
                {orders.map((order, index) => {
                  const status =
                    statusMeta[order.status];

                  return (
                    <div
                      key={order.id}
                      className="relative flex gap-4 pb-7 last:pb-0"
                    >
                      {/* Timeline node */}
                      <div className="relative z-10 shrink-0">
                        <span
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-[var(--border)]
                            bg-[var(--card)]
                            shadow-sm
                          "
                        >
                          <Icon
                            name="orders"
                            size={17}
                          />
                        </span>
                      </div>

                      {/* Event content */}
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div
                          className="
                            flex
                            flex-col
                            gap-2
                            sm:flex-row
                            sm:items-start
                            sm:justify-between
                          "
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold">
                              {t({
                                ar: "تم إنشاء الطلب",
                                en: "Order created",
                              })}{" "}
                              <span dir="ltr">
                                #{order.id}
                              </span>
                            </p>

                            <p className="mt-1 text-xs text-mut">
                              <bdi>
                                {order.customer}
                              </bdi>

                              {" · "}

                              <span dir="ltr">
                                {formatDate(
                                  order.date
                                )}{" "}
                                {order.time}
                              </span>
                            </p>
                          </div>

                          <Badge tone={status.tone}>
                            {t(status.label)}
                          </Badge>
                        </div>

                        <div
                          className="
                            mt-3
                            flex
                            flex-wrap
                            items-center
                            gap-x-4
                            gap-y-2
                            text-xs
                            text-mut
                          "
                        >
                          <span
                            dir="ltr"
                            className="font-semibold text-[var(--text)]"
                          >
                            {order.amount.toLocaleString(
                              "en-US"
                            )}{" "}
                            {cfg.project.currency}
                          </span>

                          <span>
                            {t({
                              ar: "طريقة الدفع:",
                              en: "Payment:",
                            })}{" "}
                            <bdi>
                              {order.paymentMethod}
                            </bdi>
                          </span>

                          {order.orderType && (
                            <span>
                              {t({
                                ar: "نوع الطلب:",
                                en: "Type:",
                              })}{" "}
                              <bdi>
                                {order.orderType}
                              </bdi>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[240px] items-center justify-center p-8 text-center">
              <div>
                <div
                  className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                  "
                >
                  <Icon
                    name="activity"
                    size={20}
                  />
                </div>

                <p className="mt-4 text-sm font-semibold">
                  {t({
                    ar: "لا يوجد نشاط حتى الآن.",
                    en: "No activity yet.",
                  })}
                </p>

                <p className="mt-1 text-xs text-mut">
                  {t({
                    ar: "ستظهر الأحداث هنا عند وصول بيانات جديدة.",
                    en: "New events will appear here as data arrives.",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}