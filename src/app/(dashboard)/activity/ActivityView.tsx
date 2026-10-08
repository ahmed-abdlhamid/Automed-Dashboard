"use client";

import { useI18n } from "@/components/Providers";
import { dashboardConfig as cfg } from "@/config/dashboard.config";
import { statusMeta, type Order } from "@/lib/data";
import {
  Badge,
  Card,
  Icon,
  PageHeader,
} from "@/components/ui";

function formatDate(date: string): string {
  const parts = date.split("-");

  return parts.length === 3
    ? `${parts[2]}/${parts[1]}/${parts[0]}`
    : date;
}

function getOrderTypeLabel(
  type: string,
  t: ReturnType<typeof useI18n>["t"]
) {
  const normalized = type.trim().toLowerCase();

  if (
    normalized === "delivery" ||
    normalized === "deliver"
  ) {
    return t({
      ar: "توصيل",
      en: "Delivery",
    });
  }

  if (
    normalized === "pickup" ||
    normalized === "pick up"
  ) {
    return t({
      ar: "استلام",
      en: "Pickup",
    });
  }

  return type;
}

function getPaymentMethodLabel(
  method: string,
  t: ReturnType<typeof useI18n>["t"]
) {
  const normalized = method.trim().toLowerCase();

  if (normalized === "cash") {
    return t({
      ar: "كاش",
      en: "Cash",
    });
  }

  if (normalized === "card") {
    return t({
      ar: "بطاقة",
      en: "Card",
    });
  }

  if (normalized === "online") {
    return t({
      ar: "دفع إلكتروني",
      en: "Online",
    });
  }

  return method;
}

export default function ActivityView({
  orders,
}: {
  orders: Order[];
}) {
  const { t } = useI18n();

  return (
    <div className="activity-page">
      <PageHeader
        title={t({
          ar: "النشاط",
          en: "Activity",
        })}
        subtitle={t({
          ar: "آخر الأحداث والطلبات في المشروع الحالي",
          en: "Recent events and orders from the current project",
        })}
      />

      <div className="activity-layout">
        <Card
          className="activity-feed-card"
          title={t({
            ar: "آخر النشاط",
            en: "Recent activity",
          })}
          subtitle={t({
            ar: "آخر 10 أحداث مسجلة",
            en: "Latest 10 recorded events",
          })}
          action={
            <span className="activity-live-badge">
              <span className="activity-live-dot" />
              {t({
                ar: "مباشر",
                en: "Live",
              })}
            </span>
          }
        >
          {orders.length > 0 ? (
            <div className="activity-feed">
              <div className="activity-timeline-line" />

              {orders.map((order) => {
                const status =
                  statusMeta[order.status];

                return (
                  <article
                    key={order.id}
                    className="activity-event"
                  >
                    <div className="activity-event-marker">
                      <span>
                        <Icon
                          name="orders"
                          size={17}
                        />
                      </span>
                    </div>

                    <div className="activity-event-content">
                      <div className="activity-event-top">
                        <div className="activity-event-heading">
                          <p className="activity-event-title">
                            {t({
                              ar: "تم إنشاء طلب جديد",
                              en: "New order created",
                            })}
                          </p>

                          <span className="activity-order-id">
                            <bdi dir="ltr">
                              #{order.id}
                            </bdi>
                          </span>
                        </div>

                        <Badge tone={status.tone}>
                          {t(status.label)}
                        </Badge>
                      </div>

                      <div className="activity-event-meta">
                        <span>
                          <bdi>
                            {order.customer}
                          </bdi>
                        </span>

                        <span className="activity-meta-separator">
                          •
                        </span>

                        <span dir="ltr">
                          {formatDate(order.date)}
                        </span>

                        <span dir="ltr">
                          {order.time}
                        </span>
                      </div>

                      <div className="activity-event-details">
                        <div className="activity-detail">
                          <span className="activity-detail-label">
                            {t({
                              ar: "القيمة",
                              en: "Amount",
                            })}
                          </span>

                          <strong dir="ltr">
                            {order.amount.toLocaleString(
                              "en-US"
                            )}{" "}
                            {cfg.project.currency}
                          </strong>
                        </div>

                        <div className="activity-detail">
                          <span className="activity-detail-label">
                            {t({
                              ar: "الدفع",
                              en: "Payment",
                            })}
                          </span>

                          <strong>
                            {getPaymentMethodLabel(
                              order.paymentMethod,
                              t
                            )}
                          </strong>
                        </div>

                        {order.orderType && (
                          <div className="activity-detail">
                            <span className="activity-detail-label">
                              {t({
                                ar: "النوع",
                                en: "Type",
                              })}
                            </span>

                            <strong>
                              {getOrderTypeLabel(
                                order.orderType,
                                t
                              )}
                            </strong>
                          </div>
                        )}
                      </div>

                      {order.items && (
                        <div className="activity-order-preview">
                          <Icon
                            name="orders"
                            size={14}
                          />

                          <span
                            title={order.items}
                          >
                            {order.items}
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="activity-empty">
              <div className="activity-empty-icon">
                <Icon
                  name="activity"
                  size={21}
                />
              </div>

              <p>
                {t({
                  ar: "لا يوجد نشاط حتى الآن",
                  en: "No activity yet",
                })}
              </p>

              <span>
                {t({
                  ar: "ستظهر الأحداث هنا عند وصول بيانات جديدة.",
                  en: "New events will appear here as new data arrives.",
                })}
              </span>
            </div>
          )}
        </Card>

        <aside className="activity-side">
          <Card
            title={t({
              ar: "ملخص النشاط",
              en: "Activity summary",
            })}
            subtitle={t({
              ar: "نظرة سريعة على آخر الأحداث",
              en: "Quick view of recent events",
            })}
          >
            <div className="activity-summary">
              <div className="activity-summary-item">
                <div className="activity-summary-icon">
                  <Icon
                    name="orders"
                    size={17}
                  />
                </div>

                <div>
                  <span>
                    {t({
                      ar: "آخر الطلبات",
                      en: "Recent orders",
                    })}
                  </span>

                  <strong>
                    {orders.length}
                  </strong>
                </div>
              </div>

              <div className="activity-summary-item">
                <div className="activity-summary-icon activity-summary-icon-teal">
                  <Icon
                    name="wallet"
                    size={17}
                  />
                </div>

                <div>
                  <span>
                    {t({
                      ar: "مدفوع",
                      en: "Paid",
                    })}
                  </span>

                  <strong>
                    {
                      orders.filter(
                        (order) =>
                          order.status === "paid"
                      ).length
                    }
                  </strong>
                </div>
              </div>

              <div className="activity-summary-item">
                <div className="activity-summary-icon activity-summary-icon-orange">
                  <Icon
                    name="activity"
                    size={17}
                  />
                </div>

                <div>
                  <span>
                    {t({
                      ar: "قيد الانتظار",
                      en: "Pending",
                    })}
                  </span>

                  <strong>
                    {
                      orders.filter(
                        (order) =>
                          order.status === "pending"
                      ).length
                    }
                  </strong>
                </div>
              </div>
            </div>
          </Card>

          <div className="activity-info-card">
            <div className="activity-info-icon">
              <Icon
                name="pulse"
                size={18}
              />
            </div>

            <div>
              <strong>
                {t({
                  ar: "النشاط يتحدث تلقائيًا",
                  en: "Activity updates automatically",
                })}
              </strong>

              <p>
                {t({
                  ar: "أي طلب جديد سيظهر هنا تلقائيًا مع تفاصيله وحالة الدفع.",
                  en: "New orders appear here automatically with their details and payment status.",
                })}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}