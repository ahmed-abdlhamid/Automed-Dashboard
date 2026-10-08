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
      ? t({ ar: "صباح الخير", en: "Good morning" })
      : hour >= 12 && hour < 18
      ? t({ ar: "نهارك سعيد", en: "Good afternoon" })
      : t({ ar: "مساء الخير", en: "Good evening" });

  const today = new Intl.DateTimeFormat(
    lang === "ar" ? "ar-EG-u-nu-latn" : "en-GB",
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
    : project?.name ||
      t({
        ar: "عميلنا",
        en: "there",
      });

  const columns: Column<Order>[] = [
    {
      key: "id",
      header: t({
        ar: "الطلب",
        en: "Order",
      }),
      render: (order) => (
        <div>
          <b className="font-head text-xs">
            #{order.id}
          </b>
          <p className="mt-0.5 text-xs text-mut">
            {order.customer}
          </p>
        </div>
      ),
    },

    {
      key: "type",
      header: t({
        ar: "النوع",
        en: "Type",
      }),
      render: (order) => {
        const normalized =
          order.orderType
            .trim()
            .toLowerCase();

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

        return order.orderType;
      },
    },

    {
      key: "date",
      header: t({
        ar: "التاريخ",
        en: "Date",
      }),
      render: (order) => (
        <span
          dir="ltr"
          className="text-xs text-mut"
        >
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
        <span
          dir="ltr"
          className="font-semibold"
        >
          {fmt(order.amount)}{" "}
          {cfg.project.currency}
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
            ? t({
                ar: "مدفوع",
                en: "Paid",
              })
            : order.status === "pending"
            ? t({
                ar: "قيد الانتظار",
                en: "Pending",
              })
            : t({
                ar: "فشل",
                en: "Failed",
              })}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {project && (
            <span className="kicker-chip">
              <span className="project-trigger-dot" />
              <bdi>{project.name}</bdi>
            </span>
          )}

          <h1
            className="mt-3 font-head text-2xl font-bold tracking-tight sm:text-3xl"
            suppressHydrationWarning
          >
            {greeting}، <bdi>{greetingName}</bdi>
          </h1>

          <p className="mt-1.5 text-sm text-mut">
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

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="date-chip" suppressHydrationWarning>
            <Icon name="calendar" size={16} />
            {today}
          </span>

          <Link href="/orders" className="btn btn-pri">
            {t({ ar: "كل الطلبات", en: "All orders" })}
          </Link>

          <Link href="/analytics" className="btn">
            {t({ ar: "التحليلات", en: "Analytics" })}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          featured
          icon="wallet"
          label={t({ ar: "إجمالي المبيعات", en: "Revenue" })}
          value={fmt(stats.revenue)}
          unit={cfg.project.currency}
          href="/analytics"
          footnote={t({
            ar: `آخر 7 أيام: ${fmt(weeklyTotal)} ${cfg.project.currency}`,
            en: `Last 7 days: ${fmt(weeklyTotal)} ${cfg.project.currency}`,
          })}
        />

        <StatCard
          icon="orders"
          label={t({ ar: "إجمالي الطلبات", en: "Total orders" })}
          value={fmt(stats.orders)}
          unit={t({ ar: "طلب", en: "orders" })}
          href="/orders"
        />

        <StatCard
          icon="users"
          label={t({ ar: "العملاء", en: "Customers" })}
          value={fmt(stats.customers)}
          unit={t({ ar: "عميل", en: "customers" })}
        />

        <StatCard
          icon="pulse"
          label={t({ ar: "نسبة الدفع", en: "Paid rate" })}
          value={`${stats.paidRate}%`}
          unit={t({ ar: "من الطلبات", en: "of orders" })}
          href="/analytics"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,.8fr)]">
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
          <BarChart
            data={data.weekly.map(
              (item) => ({
                label: t(item.label),
                value: item.value,
              })
            )}
          />
        </Card>

        <Card
          title={t({
            ar: "حالة النظام",
            en: "System health",
          })}
          subtitle={t({
            ar: "حالة الخدمات المتصلة",
            en: "Connected services",
          })}
        >
          <div className="p-3">
            {data.services.map(
              (service) => (
                <div
                  key={service.name.en}
                  className="system-item"
                >
                  <div className="system-name">
                    <span
                      className="system-dot"
                      style={{
                        background:
                          service.ok
                            ? "var(--ok)"
                            : "var(--danger)",
                      }}
                    />
                    {t(
                      service.name
                    )}
                  </div>

                  <Badge
                    tone={
                      service.ok
                        ? "ok"
                        : "danger"
                    }
                  >
                    {service.ok
                      ? t({
                          ar: "يعمل",
                          en: "Operational",
                        })
                      : t({
                          ar: "متوقف",
                          en: "Down",
                        })}
                  </Badge>
                </div>
              )
            )}
          </div>
        </Card>
      </div>

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
            className="btn btn-pri"
          >
            {t({
              ar: "عرض الكل",
              en: "View all",
            })}
          </Link>
        }
      >
        <div className="pt-3">
          <DataTable
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
    </div>
  );
}