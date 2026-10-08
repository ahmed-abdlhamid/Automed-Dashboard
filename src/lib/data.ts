import type { Bilingual } from "@/components/Providers";
import { dashboardConfig } from "@/config/dashboard.config";
import { supabase } from "./supabase";

export type OrderStatus =
  | "paid"
  | "pending"
  | "failed";

export type Order = {
  id: string;
  customer: string;
  amount: number;
  status: OrderStatus;

  date: string;
  time: string;

  orderType: string;

  items: string;

  paymentMethod: string;

  phoneNumber: string | null;

  deliveryAddress: string | null;

  chatId: string;
};

export const statusMeta: Record<
  OrderStatus,
  {
    label: Bilingual;
    tone: "ok" | "warn" | "danger";
  }
> = {
  paid: {
    label: {
      ar: "مدفوع",
      en: "Paid",
    },
    tone: "ok",
  },

  pending: {
    label: {
      ar: "قيد الانتظار",
      en: "Pending",
    },
    tone: "warn",
  },

  failed: {
    label: {
      ar: "فشل",
      en: "Failed",
    },
    tone: "danger",
  },
};

type SupabaseOrder = {
  id: string;
  project_id: string;
  order_id: string;
  chat_id: string;
  order_type: string;
  date_time: string;
  customer_name: string;
  phone_number: string | null;
  delivery_address: string | null;
  ordered_items: string;
  total_price: number;
  payment_method: string;
  payment_status: string;
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  created_at: string;
};

export type Overview = {
  stats: {
    orders: number;
    revenue: number;
    customers: number;
    paidRate: number;
  };

  weekly: {
    label: Bilingual;
    value: number;
  }[];

  recent: Order[];

  services: {
    name: Bilingual;
    ok: boolean;
  }[];
};

export type Analytics = {
  stats: {
    orders: number;
    revenue: number;
    customers: number;
    paidRate: number;
    paidOrders: number;
    pendingOrders: number;
    failedOrders: number;
    averageOrderValue: number;
  };

  weekly: {
    label: Bilingual;
    value: number;
  }[];

  statusBreakdown: {
    status: OrderStatus;
    count: number;
    percentage: number;
  }[];
};

function mapPaymentStatus(
  status: string
): OrderStatus {
  const normalized =
    status.trim().toLowerCase();

  if (
    normalized === "paid" ||
    normalized === "success" ||
    normalized === "successful"
  ) {
    return "paid";
  }

  if (
    normalized === "pending" ||
    normalized === "waiting" ||
    normalized === "unpaid"
  ) {
    return "pending";
  }

  return "failed";
}

function mapSupabaseOrder(
  order: SupabaseOrder
): Order {
  const date = new Date(
    order.date_time
  );

  return {
    id: order.order_id,

    customer:
      order.customer_name,

    amount:
      Number(order.total_price),

    status:
      mapPaymentStatus(
        order.payment_status
      ),

    date:
      date
        .toISOString()
        .split("T")[0],

    time:
      date.toISOString()
        .split("T")[1]
        .slice(0, 5),

    orderType:
      order.order_type,

    items:
      order.ordered_items,

    paymentMethod:
      order.payment_method,

    phoneNumber:
      order.phone_number,

    deliveryAddress:
      order.delivery_address,

    chatId:
      order.chat_id,
  };
}

export async function getProjects(): Promise<
  Project[]
> {
  const {
    data,
    error,
  } = await supabase
    .from("projects")
    .select(
      "id, name, slug, description, status, created_at"
    )
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Supabase projects error:",
      error
    );

    throw new Error(
      "Failed to load projects: " +
        error.message
    );
  }

  return data as Project[];
}

export async function getOrders(
  projectId: string =
    dashboardConfig.project.id
): Promise<Order[]> {
  const {
    data,
    error,
  } = await supabase
    .from("orders")
    .select(
      "id, project_id, order_id, chat_id, order_type, date_time, customer_name, phone_number, delivery_address, ordered_items, total_price, payment_method, payment_status"
    )
    .eq(
      "project_id",
      projectId
    )
    .order("date_time", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Supabase orders error:",
      error
    );

    throw new Error(
      "Failed to load orders: " +
        error.message
    );
  }

  return (
    data as SupabaseOrder[]
  ).map(mapSupabaseOrder);
}

export async function getOverview(
  projectId: string =
    dashboardConfig.project.id
): Promise<Overview> {
  const orders =
    await getOrders(projectId);

  const paid =
    orders.filter(
      (order) =>
        order.status === "paid"
    );

  return {
    stats: {
      orders:
        orders.length,

      revenue:
        paid.reduce(
          (sum, order) =>
            sum + order.amount,
          0
        ),

      customers:
        new Set(
          orders.map(
            (order) =>
              order.customer
          )
        ).size,

      paidRate:
        orders.length
          ? Math.round(
              (paid.length /
                orders.length) *
                100
            )
          : 0,
    },

    weekly: [],

    recent:
      orders.slice(0, 5),

    services: [
      {
        name: {
          ar: "واجهة النظام",
          en: "Dashboard",
        },
        ok: true,
      },

      {
        name: {
          ar: "اتصال البيانات",
          en: "Data connection",
        },
        ok: true,
      },

      {
        name: {
          ar: "الأتمتة",
          en: "Automation",
        },
        ok: true,
      },

      {
        name: {
          ar: "بوابة الدفع",
          en: "Payment gateway",
        },
        ok: true,
      },
    ],
  };
}