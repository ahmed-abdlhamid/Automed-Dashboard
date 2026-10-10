"use client";

import Link from "next/link";
import { useI18n } from "@/components/Providers";
import { adminIdentity } from "@/config/identity";
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

  const greetingName = isAdmin
    ? t(adminIdentity.name)
    : userName ||
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
          {project && (
            <span className="kicker-chip">
              <span className="project-trigger-dot" />

              <bdi>{project.name}</bdi>
            </span>
          )}

          <div className="overview-title-row">
            <div>
              <h1
                className="overview-title"
                suppressHydrationWarning
              >
                {greeting}،{" "}
                <bdi>{greetingName}</bdi>
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

      <section className="overview-command-center">
        <article className="overview-revenue-feature">
          <div className="overview-feature-top">
            <span className="overview-feature-icon"><Icon name="wallet" size={20} /></span>
            <span className="overview-feature-label">{t({ ar: "إجمالي المبيعات", en: "Total revenue" })}</span>
            <span className="overview-feature-live"><span />{t({ ar: "ملخص الأداء", en: "Performance snapshot" })}</span>
          </div>
          <div className="overview-feature-value">
            <strong>{fmt(stats.revenue)}</strong>
            <span>{cfg.project.currency}</span>
          </div>
          <p className="overview-feature-footnote">
            {t({ ar: "آخر 7 أيام: " + fmt(weeklyTotal) + " " + cfg.project.currency, en: "Last 7 days: " + fmt(weeklyTotal) + " " + cfg.project.currency })}
          </p>
          <div className="overview-feature-bottom">
            <div className="overview-feature-mark" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /></div>
            <Link href="/analytics" className="overview-feature-link">
              {t({ ar: "تفاصيل الإيرادات", en: "Revenue details" })}<Icon name="arrowUpRight" size={16} />
            </Link>
          </div>
        </article>
        <div className="overview-kpi-stack">
          <StatCard featured icon="orders" label={t({ ar: "إجمالي الطلبات", en: "Total orders" })} value={fmt(stats.orders)} unit={t({ ar: "طلب", en: "orders" })} href="/orders" footnote={t({ ar: "كل الطلبات المسجلة", en: "All recorded orders" })} />
          <StatCard icon="users" label={t({ ar: "العملاء", en: "Customers" })} value={fmt(stats.customers)} unit={t({ ar: "عميل", en: "customers" })} />
          <StatCard icon="pulse" label={t({ ar: "نسبة الدفع", en: "Paid rate" })} value={stats.paidRate + "%"} unit={t({ ar: "من الطلبات", en: "of orders" })} href="/analytics" />
        </div>
      </section>
      <section className="overview-insight-grid">
        <div className="overview-chart-panel">
          <div className="overview-panel-heading">
            <div>
              <span className="overview-section-eyebrow">{t({ ar: "تحليلات", en: "ANALYTICS" })}</span>
              <h2>{t({ ar: "الأداء خلال آخر 7 أيام", en: "Performance · Last 7 days" })}</h2>
              <p>{t({ ar: "الإيرادات المدفوعة يومًا بيوم", en: "Paid revenue, day by day" })}</p>
            </div>
            <Link href="/analytics" className="overview-panel-icon" aria-label={t({ ar: "فتح التحليلات", en: "Open analytics" })}><Icon name="arrowUpRight" size={17} /></Link>
          </div>
          <div className="overview-chart-header">
            <div><span className="overview-chart-total">{fmt(weeklyTotal)}</span><span className="overview-chart-currency">{cfg.project.currency}</span></div>
            <span className="overview-chart-period">{t({ ar: "آخر 7 أيام", en: "Last 7 days" })}</span>
          </div>
          <div className="overview-chart">
            <BarChart data={data.weekly.map((item) => ({ label: t(item.label), value: item.value }))} />
          </div>
        </div>
        <aside className="overview-recent-panel">
          <div className="overview-panel-heading">
            <div>
              <span className="overview-section-eyebrow">{t({ ar: "مباشر", en: "LIVE" })}</span>
              <h2>{t({ ar: "أحدث الطلبات", en: "Latest orders" })}</h2>
              <p>{t({ ar: "آخر العمليات المسجلة", en: "Recently recorded activity" })}</p>
            </div>
            <span className="overview-recent-count">{data.recent.length}</span>
          </div>
          <div className="overview-recent-list">
            {data.recent.slice(0, 4).map((order) => (
              <div className="overview-recent-item" key={order.id}>
                <span className={"overview-recent-status status-" + order.status}>
                  <Icon name={order.status === "paid" ? "check" : order.status === "pending" ? "activity" : "close"} size={15} />
                </span>
                <div className="overview-recent-copy">
                  <strong><bdi>{order.customer}</bdi></strong>
                  <span><bdi dir="ltr">#{order.id}</bdi> · {order.date}</span>
                </div>
                <div className="overview-recent-amount">
                  <strong dir="ltr">{fmt(order.amount)}</strong><span>{cfg.project.currency}</span>
                </div>
              </div>
            ))}
            {data.recent.length === 0 && <p className="overview-recent-empty">{t({ ar: "لا توجد طلبات حديثة حتى الآن", en: "No recent orders yet" })}</p>}
          </div>
          <Link href="/orders" className="overview-recent-all">{t({ ar: "عرض كل الطلبات", en: "View all orders" })}<Icon name="arrowUpRight" size={15} /></Link>
        </aside>
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