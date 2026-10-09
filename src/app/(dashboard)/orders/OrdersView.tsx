"use client";

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
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
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

export default function OrdersView({
  orders,
}: {
  orders: Order[];
}) {
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
      width: "145px",
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
      width: "220px",
      header: t({
        ar: "العميل",
        en: "Customer",
      }),
      render: (order) => (
        <div className="orders-customer-cell">
          <span className="font-medium">
            <bdi>{order.customer}</bdi>
          </span>
        </div>
      ),
    },

    {
      key: "phone",
      width: "175px",
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
      width: "145px",
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
      width: "275px",
      header: t({
        ar: "التفاصيل",
        en: "Details",
      }),
      render: (order) => (
        <div className="orders-details-cell">
          <p
            title={order.items}
            className="line-clamp-2"
          >
            {order.items}
          </p>

          {order.deliveryAddress && (
            <span
              title={
                order.deliveryAddress
              }
              className="line-clamp-1"
            >
              {order.deliveryAddress}
            </span>
          )}
        </div>
      ),
    },

    {
      key: "amount",
      width: "125px",
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
      width: "130px",
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
      width: "120px",
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

      {/* Summary */}
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
                ar: "إجمالي الطلبات",
                en: "Total orders",
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

      {/* Orders */}
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
              ar: `عرض ${rows.length} من ${orders.length} طلب`,
              en: `Showing ${rows.length} of ${orders.length} orders`,
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
            columns={columns}
            tableWidth="1335px"
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
      </Card>
    </div>
  );
}