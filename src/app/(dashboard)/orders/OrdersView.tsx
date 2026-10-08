"use client";

import { useMemo, useState, type ReactNode } from "react";
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

function Ltr({ children }: { children: ReactNode }) {
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

  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesFilter =
        filter === "all" || order.status === filter;

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
        (!q || searchableText.includes(q))
      );
    });
  }, [orders, filter, query]);

  const filters: {
    id: Filter;
    label: string;
  }[] = [
    {
      id: "all",
      label: t({ ar: "الكل", en: "All" }),
    },
    ...(Object.keys(statusMeta) as OrderStatus[]).map(
      (status) => ({
        id: status,
        label: t(statusMeta[status].label),
      })
    ),
  ];

  const getOrderTypeLabel = (type: string) => {
    const normalized = type.trim().toLowerCase();

    if (
      normalized === "delivery" ||
      normalized === "deliver"
    ) {
      return t({ ar: "توصيل", en: "Delivery" });
    }

    if (
      normalized === "pickup" ||
      normalized === "pick up"
    ) {
      return t({ ar: "استلام", en: "Pickup" });
    }

    return type;
  };

  const getPaymentMethodLabel = (method: string) => {
    const normalized = method.trim().toLowerCase();

    if (normalized === "cash") {
      return t({ ar: "كاش", en: "Cash" });
    }

    if (normalized === "card") {
      return t({ ar: "بطاقة", en: "Card" });
    }

    if (normalized === "online") {
      return t({ ar: "دفع إلكتروني", en: "Online" });
    }

    return method;
  };

  const columns: Column<Order>[] = [
    {
      key: "id",
      header: t({ ar: "رقم الطلب", en: "Order" }),
      render: (order) => (
        <b className="font-head text-sm">
          <Ltr>#{order.id}</Ltr>
        </b>
      ),
    },
    {
      key: "customer",
      header: t({ ar: "العميل", en: "Customer" }),
      render: (order) => (
        <span className="font-medium">
          <bdi>{order.customer}</bdi>
        </span>
      ),
    },
    {
      key: "phone",
      header: t({ ar: "رقم الهاتف", en: "Phone" }),
      render: (order) => <Ltr>{order.phoneNumber || "—"}</Ltr>,
    },
    {
      key: "chatId",
      header: t({ ar: "رقم المحادثة", en: "Chat ID" }),
      render: (order) => (
        <span className="text-mut">
          <Ltr>{order.chatId || "—"}</Ltr>
        </span>
      ),
    },
    {
      key: "orderType",
      header: t({ ar: "نوع الطلب", en: "Order type" }),
      render: (order) => getOrderTypeLabel(order.orderType),
    },
    {
      key: "date",
      header: t({ ar: "التاريخ والوقت", en: "Date & time" }),
      render: (order) => (
        <div>
          <p className="font-medium">
            <Ltr>{formatDate(order.date)}</Ltr>
          </p>
          <p className="mt-0.5 text-xs text-mut">
            <Ltr>{order.time}</Ltr>
          </p>
        </div>
      ),
    },
    {
      key: "items",
      header: t({ ar: "التفاصيل", en: "Details" }),
      render: (order) => (
        <div className="min-w-[200px] max-w-[300px] whitespace-normal">
          <p title={order.items} className="line-clamp-2 leading-5">
            {order.items}
          </p>
          {order.deliveryAddress && (
            <p
              title={order.deliveryAddress}
              className="mt-1 line-clamp-1 text-xs text-mut"
            >
              {order.deliveryAddress}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "amount",
      header: t({ ar: "الإجمالي", en: "Total" }),
      render: (order) => (
        <span className="font-semibold">
          <Ltr>
            {order.amount.toLocaleString("en-US")} {cfg.project.currency}
          </Ltr>
        </span>
      ),
    },
    {
      key: "paymentMethod",
      header: t({ ar: "طريقة الدفع", en: "Payment" }),
      render: (order) => getPaymentMethodLabel(order.paymentMethod),
    },
    {
      key: "status",
      header: t({ ar: "الحالة", en: "Status" }),
      render: (order) => (
        <Badge tone={statusMeta[order.status].tone}>
          {t(statusMeta[order.status].label)}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={t({ ar: "الطلبات", en: "Orders" })}
        subtitle={t({
          ar: "كل تفاصيل الطلبات وحالة الدفع في مكان واحد",
          en: "All order details and payment status in one place",
        })}
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3 p-6 pb-4">
          <div className="relative min-w-[240px] flex-1">
            <span className="pointer-events-none absolute inset-y-0 start-3 grid place-items-center text-mut">
              <Icon name="search" size={17} />
            </span>
            <input
              className="field ps-10"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t({
                ar: "ابحث بالطلب أو العميل أو الهاتف أو الأصناف",
                en: "Search order, customer, phone or items",
              })}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                className="btn"
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-line px-6 py-3">
          <p className="text-xs text-mut">
            {t({
              ar: `عرض ${rows.length} من ${orders.length} طلب`,
              en: `Showing ${rows.length} of ${orders.length} orders`,
            })}
          </p>
        </div>

        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(order) => order.id}
            empty={t({ ar: "لا توجد نتائج", en: "No results" })}
          />
        </div>
      </Card>
    </>
  );
}
