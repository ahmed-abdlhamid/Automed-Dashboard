"use client";

import Link from "next/link";
import { useI18n } from "@/components/Providers";
import { dashboardConfig as cfg } from "@/config/dashboard.config";
import type {
  Order,
  Overview,
  Project,
} from "@/lib/data";
import {
  Badge,
  BarChart,
  Card,
  DataTable,
  Icon,
  StatCard,
  type Column,
} from "@/components/ui";
import type { ProjectRole } from "@/lib/project";

const fmt = (value: number) =>
  value.toLocaleString("en-US");

export default function OverviewView({
  data,
  project,
  role,
  userName,
}: {
  data: Overview;
  project: Project | null;
  role: ProjectRole | null;
  userName?: string;
}) {
  const { t, lang } = useI18n();
  const { stats } = data;

  const isAdmin = role === "admin";

  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "Africa/Cairo",
    }).format(new Date())
  );

  const greeting =
    hour >= 5 && hour < 12
      ? t({
          ar: "صباح الخير",
          en: "Good morning",
        })
      : hour >= 12 && hour < 18
      ? t({
          ar: "نهارك سعيد",
          en: "Good afternoon",
        })
      : t({
          ar: "مساء الخير",
          en: "Good evening",
        });

  const today = new Intl.DateTimeFormat(
    lang === "ar"
      ? "ar-EG-u-nu-latn"
      : "en-GB",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "Africa/Cairo",
    }
  ).format(new Date());

  const weeklyTotal = data.weekly.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const paymentMethods = data.recent.reduce<Array<{ label: string; count: number }>>(
    (groups, order) => {
      const raw = (order.paymentMethod || "").trim();
      const key = raw || t({ ar: "غير محدد", en: "Unspecified" });
      const existing = groups.find((item) => item.label === key);
      if (existing) existing.count += 1;
      else groups.push({ label: key, count: 1 });
      return groups;
    },
    []
  );
  const paymentTotal = paymentMethods.reduce((sum, item) => sum + item.count, 0);
  const paymentColors = ["#0d5c56", "#fd9238", "#8ea7a2", "#c7d5d1"];
  let paymentOffset = 0;
  const paymentGradient = paymentMethods.length
    ? `conic-gradient(${paymentMethods.map((item, index) => {
        const start = paymentOffset;
        paymentOffset += (item.count / paymentTotal) * 100;
        return `${paymentColors[index % paymentColors.length]} ${start}% ${paymentOffset}%`;
      }).join(", ")})`
    : "conic-gradient(var(--line) 0% 100%)";

  const greetingName = userName ||
      project?.name ||
      t({
        ar: "عميلنا",
        en: "there",
      });

  const columns: Column<Order>[] = [
    {
      key: "id",
      header: t({
        ar: "رقم الطلب",
        en: "Order",
      }),
      render: (order) => (
        <b className="font-head text-xs">
          <bdi dir="ltr">#{order.id}</bdi>
        </b>
      ),
    },
    {
      key: "customer",
      header: t({
        ar: "العميل",
        en: "Customer",
      }),
      render: (order) => (
        <bdi>{order.customer}</bdi>
      ),
    },
    {
      key: "phone",
      header: t({
        ar: "رقم الهاتف",
        en: "Phone",
      }),
      render: (order) => (
        <bdi dir="ltr">{order.phoneNumber || "—"}</bdi>
      ),
    },
    {
      key: "date",
      header: t({
        ar: "التاريخ",
        en: "Date",
      }),
      render: (order) => (
        <span dir="ltr">
          {order.date} · {order.time}
        </span>
      ),
    },
    {
      key: "amount",
      header: t({
        ar: "المبلغ",
        en: "Amount",
      }),
      render: (order) => (
        <span dir="ltr">
          {fmt(order.amount)} {cfg.project.currency}
        </span>
      ),
    },
    {
      key: "status",
      header: t({
        ar: "الحالة",
        en: "Status",
      }),
      render: (order) => (
        <Badge
          tone={
            order.status === "paid"
              ? "ok"
              : order.status === "pending"
              ? "warn"
              : "danger"
          }
        >
          {order.status === "paid"
            ? t({ ar: "مدفوع", en: "Paid" })
            : order.status === "pending"
            ? t({ ar: "قيد الانتظار", en: "Pending" })
            : t({ ar: "فشل", en: "Failed" })}
        </Badge>
      ),
    },
  ];

  return (
    <div className="overview-page">
      <section className="overview-header">
        <div className="overview-heading">
          <div className="overview-title-row">
            <div>
              <h1
                className="overview-title"
                suppressHydrationWarning
              >
                {greeting}،{" "}
                <bdi>{greetingName}</bdi>
                {project && !isAdmin && (
                  <span className="overview-project-inline">
                    <span className="project-trigger-dot" />
                    <bdi>{project.name}</bdi>
                  </span>
                )}
              </h1>

              <p className="overview-description">
                {isAdmin
                  ? t({
                      ar: "دي نظرة سريعة على أداء المشروع والعمليات الحالية.",
                      en: "A quick view of your project performance and current operations.",
                    })
                  : t({
                      ar: "دي نظرة سريعة على أداء نظامك والعمليات الحالية.",
                      en: "A quick view of your system performance and current operations.",
                    })}
              </p>
            </div>
          </div>
        </div>

        <div className="overview-actions">
          <span
            className="date-chip"
            suppressHydrationWarning
          >
            <Icon
              name="calendar"
              size={15}
            />

            {today}
          </span>

          <Link
            href="/orders"
            className="btn btn-pri"
          >
            <Icon
              name="orders"
              size={15}
            />

            {t({
              ar: "كل الطلبات",
              en: "All orders",
            })}
          </Link>

          <Link
            href="/analytics"
            className="btn"
          >
            <Icon
              name="pulse"
              size={15}
            />

            {t({
              ar: "التحليلات",
              en: "Analytics",
            })}
          </Link>
        </div>
      </section>

      <section className="overview-kpis">
        <StatCard
          featured
          icon="wallet"
          label={t({
            ar: "إجمالي المبيعات",
            en: "Revenue",
          })}
          value={fmt(stats.revenue)}
          unit={cfg.project.currency}
          href="/analytics"
          footnote={t({
            ar: `آخر 7 أيام: ${fmt(
              weeklyTotal
            )} ${cfg.project.currency}`,
            en: `Last 7 days: ${fmt(
              weeklyTotal
            )} ${cfg.project.currency}`,
          })}
        />

        <StatCard
          icon="orders"
          label={t({
            ar: "إجمالي الطلبات",
            en: "Total orders",
          })}
          value={fmt(stats.orders)}
          unit={t({
            ar: "طلب",
            en: "orders",
          })}
          href="/orders"
        />

        <StatCard
          icon="users"
          label={t({
            ar: "العملاء",
            en: "Customers",
          })}
          value={fmt(stats.customers)}
          unit={t({
            ar: "عميل",
            en: "customers",
          })}
        />

        <StatCard
          icon="pulse"
          label={t({
            ar: "نسبة الدفع",
            en: "Paid rate",
          })}
          value={`${stats.paidRate}%`}
          unit={t({
            ar: "من الطلبات",
            en: "of orders",
          })}
          href="/analytics"
        />
      </section>

      <section className="overview-section-grid">
        <Card
          title={t({
            ar: "الأداء خلال آخر 7 أيام",
            en: "Performance · Last 7 days",
          })}
          subtitle={t({
            ar: "الإيرادات المدفوعة",
            en: "Paid revenue",
          })}
        >
          <div className="overview-chart-header">
            <div>
              <span className="overview-chart-total">
                {fmt(weeklyTotal)}
              </span>

              <span className="overview-chart-currency">
                {cfg.project.currency}
              </span>
            </div>

            <span className="overview-chart-period">
              {t({
                ar: "آخر 7 أيام",
                en: "Last 7 days",
              })}
            </span>
          </div>

          <div className="overview-chart">
            <BarChart
              data={data.weekly.map(
                (item) => ({
                  label: t(item.label),
                  value: item.value,
                })
              )}
            />
          </div>
        </Card>

        <Card
          title={t({ ar: "وسائل الدفع", en: "Payment methods" })}
          subtitle={t({
            ar: "توزيع وسائل الدفع في أحدث العمليات",
            en: "Payment method mix in recent orders",
          })}
        >
          <div className="overview-payment-layout">
            <div
              className="overview-payment-donut"
              style={{ background: paymentGradient }}
              role="img"
              aria-label={t({ ar: "توزيع وسائل الدفع في أحدث العمليات", en: "Payment method distribution in recent orders" })}
            >
              <div className="overview-payment-center">
                <strong>{paymentTotal}</strong>
                <span>{t({ ar: "عملية", en: "orders" })}</span>
              </div>
            </div>
            <div className="overview-payment-legend">
              {paymentMethods.length ? paymentMethods.map((item, index) => (
                <div className="overview-payment-item" key={item.label}>
                  <span className="overview-payment-dot" style={{ background: paymentColors[index % paymentColors.length] }} />
                  <span>{item.label}</span>
                  <strong>{Math.round((item.count / paymentTotal) * 100)}%</strong>
                </div>
              )) : (
                <p className="text-sm text-muted">
                  {t({ ar: "لا توجد بيانات كافية لعرض وسائل الدفع.", en: "Not enough payment data to display yet." })}
                </p>
              )}
            </div>
          </div>
        </Card>
      </section>

      <section className="overview-section">
        <Card
          title={t({
            ar: "أحدث العمليات",
            en: "Recent activity",
          })}
          subtitle={t({
            ar: "آخر العمليات المسجلة",
            en: "Latest recorded operations",
          })}
          action={
            <Link
              href="/orders"
              className="btn"
            >
              {t({
                ar: "عرض الكل",
                en: "View all",
              })}

              <Icon
                name="chevronLeft"
                size={14}
              />
            </Link>
          }
        >
          <div className="overview-table-wrap">
            <DataTable
              equalColumnWidths
              columns={columns}
              rows={data.recent}
              rowKey={(order) =>
                order.id
              }
              empty={t({
                ar: "لا توجد عمليات",
                en: "No activity yet",
              })}
            />
          </div>
        </Card>
      </section>
    </div>
  );
}