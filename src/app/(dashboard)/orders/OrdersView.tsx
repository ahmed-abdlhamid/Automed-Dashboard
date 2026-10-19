"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useI18n } from "@/components/Providers";
import { dashboardConfig as cfg } from "@/config/dashboard.config";
import {
  statusMeta,
  type Order,
  type OrderStatus,
} from "@/lib/data";
import {
  Badge,
  Card,
  DataTable,
  Icon,
  PageHeader,
  type Column,
} from "@/components/ui";

type Filter = "all" | OrderStatus;

function formatDate(date: string): string {
  const parts = date.split("-");

  if (parts.length === 3) {
    return parts[2] + "/" + parts[1] + "/" + parts[0];
  }

  return date;
}

function Ltr({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <bdi dir="ltr" className="inline-block">
      {children}
    </bdi>
  );
}

type OrdersViewProps = {
  orders: Order[];
  range: string;
  from: string;
  to: string;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
};

export default function OrdersView({
  orders,
  range,
  from,
  to,
  page,
  pageSize,
  hasNextPage,
}: OrdersViewProps) {
  const { t } = useI18n();

  const [filter, setFilter] =
    useState<Filter>("all");

  const [query, setQuery] =
    useState("");

  const rows = useMemo(() => {
    const q = query
      .trim()
      .toLowerCase();

    return orders.filter((order) => {
      const matchesFilter =
        filter === "all" ||
        order.status === filter;

      const searchableText = [
        order.id,
        order.customer,
        order.phoneNumber || "",
        order.orderType,
        order.items,
        order.paymentMethod,
        order.chatId,
        order.deliveryAddress || "",
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesFilter &&
        (!q ||
          searchableText.includes(q))
      );
    });
  }, [orders, filter, query]);

  const pageHref = (nextPage: number) => {
    const params = new URLSearchParams();
    params.set("range", range);
    if (range === "custom") {
      if (from) params.set("from", from);
      if (to) params.set("to", to);
    }
    if (nextPage > 1) params.set("page", String(nextPage));
    return `/orders?${params.toString()}`;
  };

  const rangeOptions = [
    { id: "recent", ar: "آخر 10 طلبات", en: "Latest 10" },
    { id: "week", ar: "آخر 7 أيام", en: "Last 7 days" },
    { id: "month", ar: "آخر 30 يومًا", en: "Last 30 days" },
    { id: "all", ar: "كل الطلبات", en: "All orders" },
  ];

  const counts = useMemo(
    () => ({
      all: orders.length,
      paid: orders.filter(
        (order) =>
          order.status === "paid"
      ).length,
      pending: orders.filter(
        (order) =>
          order.status === "pending"
      ).length,
      failed: orders.filter(
        (order) =>
          order.status === "failed"
      ).length,
    }),
    [orders]
  );

  const filters: {
    id: Filter;
    label: string;
  }[] = [
    {
      id: "all",
      label: t({
        ar: "الكل",
        en: "All",
      }),
    },
    ...(
      Object.keys(
        statusMeta
      ) as OrderStatus[]
    ).map((status) => ({
      id: status,
      label: t(
        statusMeta[status].label
      ),
    })),
  ];

  const getOrderTypeLabel = (
    type: string
  ) => {
    const normalized =
      type.trim().toLowerCase();

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
  };

  const getPaymentMethodLabel = (
    method: string
  ) => {
    const normalized =
      method.trim().toLowerCase();

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
  };

  const columns: Column<Order>[] = [
    {
      key: "id",
      header: t({
        ar: "رقم الطلب",
        en: "Order",
      }),
      render: (order) => (
        <div className="orders-id-cell">
          <b className="font-head text-sm">
            <Ltr>
              #{order.id}
            </Ltr>
          </b>

          <span>
            {getOrderTypeLabel(
              order.orderType
            )}
          </span>
        </div>
      ),
    },

    {
      key: "customer",
      header: t({
        ar: "العميل",
        en: "Customer",
      }),
      render: (order) => (
        <span className="font-medium">
          <bdi>{order.customer}</bdi>
        </span>
      ),
    },

    {
      key: "phone",
      header: t({
        ar: "رقم الهاتف",
        en: "Phone",
      }),
      render: (order) => (
        <span className="orders-muted-value">
          <Ltr>
            {order.phoneNumber ||
              "—"}
          </Ltr>
        </span>
      ),
    },

    {
      key: "date",
      header: t({
        ar: "التاريخ",
        en: "Date & time",
      }),
      render: (order) => (
        <div className="orders-date-cell">
          <p>
            <Ltr>
              {formatDate(
                order.date
              )}
            </Ltr>
          </p>

          <span>
            <Ltr>
              {order.time}
            </Ltr>
          </span>
        </div>
      ),
    },

    {
      key: "items",
      header: t({
        ar: "التفاصيل",
        en: "Details",
      }),
      render: (order) => (
        <div className="orders-details-cell">
          <p title={order.items}>
            {order.items}
          </p>

          {order.deliveryAddress && (
            <span title={order.deliveryAddress}>
              {order.deliveryAddress}
            </span>
          )}
        </div>
      ),
    },

    {
      key: "amount",
      header: t({
        ar: "الإجمالي",
        en: "Total",
      }),
      render: (order) => (
        <span className="orders-amount">
          <Ltr>
            {order.amount.toLocaleString(
              "en-US"
            )}{" "}
            {cfg.project.currency}
          </Ltr>
        </span>
      ),
    },

    {
      key: "paymentMethod",
      header: t({
        ar: "طريقة الدفع",
        en: "Payment",
      }),
      render: (order) => (
        <span className="orders-payment">
          {getPaymentMethodLabel(
            order.paymentMethod
          )}
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
            statusMeta[
              order.status
            ].tone
          }
        >
          {t(
            statusMeta[
              order.status
            ].label
          )}
        </Badge>
      ),
    },
  ];

  return (
    <div className="orders-page">
      <PageHeader
        title={t({
          ar: "الطلبات",
          en: "Orders",
        })}
        subtitle={t({
          ar: "كل تفاصيل الطلبات وحالة الدفع في مكان واحد",
          en: "All order details and payment status in one place",
        })}
      />

      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
            <strong style={{ marginInlineEnd: 4 }}>
              {t({ ar: "الفترة الزمنية", en: "Date range" })}
            </strong>
            {rangeOptions.map((option) => (
              <Link
                key={option.id}
                href={`/orders?range=${option.id}`}
                className={range === option.id ? "orders-filter active" : "orders-filter"}
                aria-current={range === option.id ? "page" : undefined}
              >
                {t({ ar: option.ar, en: option.en })}
              </Link>
            ))}
          </div>

          <form
            action="/orders"
            method="get"
            style={{ display: "flex", flexWrap: "wrap", alignItems: "end", gap: 10 }}
          >
            <input type="hidden" name="range" value="custom" />
            <label style={{ display: "grid", gap: 5, fontSize: 13 }}>
              {t({ ar: "من تاريخ", en: "From" })}
              <input className="field" type="date" name="from" value={from} required />
            </label>
            <label style={{ display: "grid", gap: 5, fontSize: 13 }}>
              {t({ ar: "إلى تاريخ", en: "To" })}
              <input className="field" type="date" name="to" value={to} required min={from || undefined} />
            </label>
            <button className="ctl" type="submit">
              {t({ ar: "تطبيق الفترة", en: "Apply range" })}
            </button>
          </form>
          {range === "custom" && (!from || !to || from > to) && (
            <p style={{ margin: 0, fontSize: 13 }} role="status">
              {t({ ar: "اختار تاريخ بداية ونهاية صحيحين لعرض الطلبات.", en: "Choose a valid start and end date to view orders." })}
            </p>
          )}
        </div>
      </Card>

      <section className="orders-summary">
        <div className="orders-summary-main">
          <div className="orders-summary-icon">
            <Icon
              name="orders"
              size={19}
            />
          </div>

          <div>
            <span>
              {t({
                ar: range === "recent" ? "آخر الطلبات" : "طلبات في الصفحة",
                en: range === "recent" ? "Recent orders" : "Orders on this page",
              })}
            </span>

            <strong>
              {orders.length.toLocaleString(
                "en-US"
              )}
            </strong>
          </div>
        </div>

        <div className="orders-summary-stats">
          <button
            type="button"
            className={
              filter === "paid"
                ? "orders-mini-stat active"
                : "orders-mini-stat"
            }
            onClick={() =>
              setFilter("paid")
            }
          >
            <span className="orders-stat-dot orders-stat-dot-ok" />

            <span>
              {t({
                ar: "مدفوع",
                en: "Paid",
              })}
            </span>

            <strong>
              {counts.paid}
            </strong>
          </button>

          <button
            type="button"
            className={
              filter === "pending"
                ? "orders-mini-stat active"
                : "orders-mini-stat"
            }
            onClick={() =>
              setFilter("pending")
            }
          >
            <span className="orders-stat-dot orders-stat-dot-warn" />

            <span>
              {t({
                ar: "معلق",
                en: "Pending",
              })}
            </span>

            <strong>
              {counts.pending}
            </strong>
          </button>

          <button
            type="button"
            className={
              filter === "failed"
                ? "orders-mini-stat active"
                : "orders-mini-stat"
            }
            onClick={() =>
              setFilter("failed")
            }
          >
            <span className="orders-stat-dot orders-stat-dot-danger" />

            <span>
              {t({
                ar: "فشل",
                en: "Failed",
              })}
            </span>

            <strong>
              {counts.failed}
            </strong>
          </button>
        </div>
      </section>

      <Card>
        <div className="orders-toolbar">
          <div className="orders-search">
            <span className="orders-search-icon">
              <Icon
                name="search"
                size={17}
              />
            </span>

            <input
              className="field orders-search-input"
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value
                )
              }
              placeholder={t({
                ar: "ابحث بالطلب أو العميل أو الهاتف أو الأصناف",
                en: "Search order, customer, phone or items",
              })}
            />

            {query && (
              <button
                type="button"
                className="orders-search-clear"
                onClick={() =>
                  setQuery("")
                }
                aria-label={t({
                  ar: "مسح البحث",
                  en: "Clear search",
                })}
              >
                ×
              </button>
            )}
          </div>

          <div className="orders-filters">
            {filters.map(
              (item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    filter === item.id
                      ? "orders-filter active"
                      : "orders-filter"
                  }
                  aria-pressed={
                    filter ===
                    item.id
                  }
                  onClick={() =>
                    setFilter(
                      item.id
                    )
                  }
                >
                  {item.label}

                  {item.id !==
                    "all" && (
                    <span>
                      {
                        counts[
                          item.id
                        ]
                      }
                    </span>
                  )}
                </button>
              )
            )}
          </div>
        </div>

        <div className="orders-results-bar">
          <span>
            {t({
              ar: `عرض ${rows.length} من ${orders.length} طلب في الصفحة`,
              en: `Showing ${rows.length} of ${orders.length} orders on this page`,
            })}
          </span>

          {(query ||
            filter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              {t({
                ar: "مسح الفلاتر",
                en: "Clear filters",
              })}
            </button>
          )}
        </div>

        <div className="orders-table-wrap">
          <DataTable
            equalColumnWidths
            columns={columns}
            rows={rows}
            rowKey={(order) =>
              order.id
            }
            empty={t({
              ar: "لا توجد نتائج",
              en: "No results",
            })}
          />
        </div>

        {range !== "recent" && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, paddingTop: 16 }}>
            <span style={{ fontSize: 13, opacity: 0.75 }}>
              {t({
                ar: `الصفحة ${page} · ${pageSize} طلبًا كحد أقصى لكل صفحة`,
                en: `Page ${page} · Up to ${pageSize} orders per page`,
              })}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              {page > 1 && (
                <Link className="ctl" href={pageHref(page - 1)}>
                  {t({ ar: "السابق", en: "Previous" })}
                </Link>
              )}
              {hasNextPage && (
                <Link className="ctl" href={pageHref(page + 1)}>
                  {t({ ar: "التالي", en: "Next" })}
                </Link>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
