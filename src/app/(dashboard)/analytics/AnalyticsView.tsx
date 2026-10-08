"use client";

import { useI18n } from "@/components/Providers";
import type { Analytics } from "@/lib/data";
import {
  Card,
  Donut,
  Icon,
  PageHeader,
  StatCard,
} from "@/components/ui";
import { AnalyticsChart } from "./AnalyticsChart";

export default function AnalyticsView({
  data,
}: {
  data: Analytics;
}) {
  const { t } = useI18n();

  const currency = "EGP";

  const formatMoney = (value: number) =>
    `${value.toLocaleString("en-US")} ${currency}`;

  const statusItems = data.statusBreakdown.map((item) => {
    const isPaid = item.status === "paid";
    const isPending = item.status === "pending";

    return {
      ...item,
      label: isPaid
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
              ar: "فاشل",
              en: "Failed",
            },
      icon: isPaid
        ? ("check" as const)
        : isPending
          ? ("activity" as const)
          : ("close" as const),
      tone: isPaid
        ? "paid"
        : isPending
          ? "pending"
          : "failed",
    };
  });

  return (
    <div className="analytics-page">
      <PageHeader
        title={t({
          ar: "التحليلات",
          en: "Analytics",
        })}
        subtitle={t({
          ar: "صورة أوضح لأداء المشروع والإيرادات وحالة الطلبات",
          en: "A clearer view of project performance, revenue and order status",
        })}
      />

      {/* KPI row */}
      <section className="analytics-kpis">
        <StatCard
          icon="wallet"
          label={t({
            ar: "الإيرادات المدفوعة",
            en: "Paid revenue",
          })}
          value={data.stats.revenue.toLocaleString("en-US")}
          unit={currency}
          footnote={t({
            ar: "إجمالي الإيرادات من الطلبات المدفوعة",
            en: "Revenue from paid orders",
          })}
          featured
        />

        <StatCard
          icon="orders"
          label={t({
            ar: "إجمالي الطلبات",
            en: "Total orders",
          })}
          value={data.stats.orders.toLocaleString("en-US")}
          footnote={t({
            ar: "كل الطلبات المسجلة للمشروع",
            en: "All recorded orders for this project",
          })}
        />

        <StatCard
          icon="customers"
          label={t({
            ar: "العملاء",
            en: "Customers",
          })}
          value={data.stats.customers.toLocaleString("en-US")}
          footnote={t({
            ar: "عدد العملاء الفريدين",
            en: "Unique customers",
          })}
        />

        <StatCard
          icon="analytics"
          label={t({
            ar: "متوسط قيمة الطلب",
            en: "Average order value",
          })}
          value={data.stats.averageOrderValue.toLocaleString("en-US")}
          unit={currency}
          footnote={t({
            ar: "متوسط قيمة جميع الطلبات",
            en: "Average value across all orders",
          })}
        />
      </section>

      {/* Main analytics */}
      <section className="analytics-main-grid">
        <Card
          className="analytics-revenue-card"
          title={t({
            ar: "الإيرادات خلال الأسبوع",
            en: "Weekly revenue",
          })}
          subtitle={t({
            ar: "الإيرادات المدفوعة خلال آخر 7 أيام",
            en: "Paid revenue over the last 7 days",
          })}
          action={
            <span className="analytics-card-badge">
              <span className="analytics-live-dot" />
              {t({
                ar: "آخر 7 أيام",
                en: "Last 7 days",
              })}
            </span>
          }
        >
          <div className="analytics-chart-summary">
            <div>
              <p className="analytics-summary-label">
                {t({
                  ar: "إجمالي الفترة",
                  en: "Period total",
                })}
              </p>

              <p className="analytics-summary-value">
                {formatMoney(data.weekly.reduce(
                  (sum, item) => sum + item.value,
                  0
                ))}
              </p>
            </div>

            <div className="analytics-summary-note">
              <Icon name="wallet" size={16} />
              <span>
                {t({
                  ar: "الإيرادات المدفوعة فقط",
                  en: "Paid revenue only",
                })}
              </span>
            </div>
          </div>

          <AnalyticsChart data={data.weekly} />
        </Card>

        <Card
          className="analytics-payment-card"
          title={t({
            ar: "معدل الدفع",
            en: "Payment rate",
          })}
          subtitle={t({
            ar: "نسبة الطلبات التي تم دفعها",
            en: "Percentage of orders that were paid",
          })}
        >
          <div className="analytics-donut-area">
            <Donut
              value={data.stats.paidRate}
              label={t({
                ar: "نسبة الدفع",
                en: "Paid rate",
              })}
            />

            <div className="analytics-donut-copy">
              <div className="analytics-donut-stat">
                <span className="analytics-status-dot analytics-status-dot-paid" />
                <div>
                  <strong>
                    {data.stats.paidOrders.toLocaleString("en-US")}
                  </strong>
                  <span>
                    {t({
                      ar: "طلب مدفوع",
                      en: "paid orders",
                    })}
                  </span>
                </div>
              </div>

              <div className="analytics-donut-stat">
                <span className="analytics-status-dot analytics-status-dot-pending" />
                <div>
                  <strong>
                    {data.stats.pendingOrders.toLocaleString("en-US")}
                  </strong>
                  <span>
                    {t({
                      ar: "طلب قيد الانتظار",
                      en: "pending orders",
                    })}
                  </span>
                </div>
              </div>

              <div className="analytics-donut-stat">
                <span className="analytics-status-dot analytics-status-dot-failed" />
                <div>
                  <strong>
                    {data.stats.failedOrders.toLocaleString("en-US")}
                  </strong>
                  <span>
                    {t({
                      ar: "طلب فاشل",
                      en: "failed orders",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Order status */}
      <section className="analytics-status-section">
        <Card
          title={t({
            ar: "حالة الطلبات",
            en: "Order status",
          })}
          subtitle={t({
            ar: "توزيع الطلبات حسب حالة الدفع الحالية",
            en: "Distribution of orders by their current payment status",
          })}
        >
          <div className="analytics-status-grid">
            {statusItems.map((item) => (
              <div
                key={item.status}
                className={`analytics-status-card analytics-status-${item.tone}`}
              >
                <div className="analytics-status-card-top">
                  <span className="analytics-status-icon">
                    <Icon name={item.icon} size={18} />
                  </span>

                  <span className="analytics-status-percentage">
                    {item.percentage}%
                  </span>
                </div>

                <div className="analytics-status-card-body">
                  <p>
                    {t(item.label)}
                  </p>

                  <strong>
                    {item.count.toLocaleString("en-US")}
                  </strong>
                </div>

                <div className="analytics-progress">
                  <span
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Performance snapshot */}
      <section className="analytics-summary-section">
        <div className="analytics-section-heading">
          <div>
            <h2>
              {t({
                ar: "ملخص الأداء",
                en: "Performance snapshot",
              })}
            </h2>

            <p>
              {t({
                ar: "الأرقام الأساسية التي تستحق المتابعة",
                en: "The key numbers worth keeping an eye on",
              })}
            </p>
          </div>
        </div>

        <div className="analytics-insight-grid">
          <div className="analytics-insight-card">
            <div className="analytics-insight-icon">
              <Icon name="check" size={18} />
            </div>

            <div>
              <span>
                {t({
                  ar: "طلبات مدفوعة",
                  en: "Paid orders",
                })}
              </span>

              <strong>
                {data.stats.paidOrders.toLocaleString("en-US")}
              </strong>
            </div>

            <small>
              {data.stats.paidRate}%
            </small>
          </div>

          <div className="analytics-insight-card">
            <div className="analytics-insight-icon analytics-insight-icon-warning">
              <Icon name="activity" size={18} />
            </div>

            <div>
              <span>
                {t({
                  ar: "طلبات قيد الانتظار",
                  en: "Pending orders",
                })}
              </span>

              <strong>
                {data.stats.pendingOrders.toLocaleString("en-US")}
              </strong>
            </div>

            <small>
              {data.stats.orders
                ? Math.round(
                    (data.stats.pendingOrders /
                      data.stats.orders) *
                      100
                  )
                : 0}
              %
            </small>
          </div>

          <div className="analytics-insight-card">
            <div className="analytics-insight-icon analytics-insight-icon-danger">
              <Icon name="close" size={18} />
            </div>

            <div>
              <span>
                {t({
                  ar: "طلبات فاشلة",
                  en: "Failed orders",
                })}
              </span>

              <strong>
                {data.stats.failedOrders.toLocaleString("en-US")}
              </strong>
            </div>

            <small>
              {data.stats.orders
                ? Math.round(
                    (data.stats.failedOrders /
                      data.stats.orders) *
                      100
                  )
                : 0}
              %
            </small>
          </div>
        </div>
      </section>
    </div>
  );
}