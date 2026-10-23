import { readAllRows } from "@/lib/supabase/pagination";
import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Bilingual } from "@/components/Providers";
import type {
  Analytics,
  Order,
  Overview,
  Project,
} from "@/lib/data";

const EGYPT_TIME_ZONE =
  "Africa/Cairo";

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

  const dateFormatter =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          EGYPT_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    );

  const timeFormatter =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone:
          EGYPT_TIME_ZONE,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    );


function getEgyptDateTime(
  dateTime: string
): {
  date: string;
  time: string;
} {
  const value =
    new Date(dateTime);


  return {
    date:
      dateFormatter.format(value),

    time:
      timeFormatter.format(value),
  };
}

function mapPaymentStatus(
  status: string
): Order["status"] {
  const normalized =
    status
      .trim()
      .toLowerCase();

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
  const {
    date,
    time,
  } =
    getEgyptDateTime(
      order.date_time
    );

  return {
    id:
      order.order_id,

    customer:
      order.customer_name,

    amount:
      Number(
        order.total_price
      ),

    status:
      mapPaymentStatus(
        order.payment_status
      ),

    date,

    time,

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
  const supabase =
    await createSupabaseServerClient();

  const {
    data,
    error,
  } = await readAllRows(offset => supabase
    .from("projects")
    .select(
      "id, name, slug, description, status, created_at", { count: "exact" }
    )
    .order(
      "created_at",
      {
        ascending: true,
      }
    ).order("id").range(offset, offset + 999));

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

export type OrderQueryOptions = {
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
};

function egyptMidnightUtc(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const targetLocalAsUtc = Date.UTC(year, month - 1, day, 0, 0, 0);
  let candidate = targetLocalAsUtc;

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: EGYPT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  for (let i = 0; i < 3; i++) {
    const parts = formatter.formatToParts(new Date(candidate));
    const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
    const representedLocalAsUtc = Date.UTC(
      get("year"),
      get("month") - 1,
      get("day"),
      get("hour"),
      get("minute"),
      get("second")
    );
    candidate += targetLocalAsUtc - representedLocalAsUtc;
  }

  return new Date(candidate).toISOString();
}

export async function getOrders(
  projectId: string,
  options?: number | OrderQueryOptions
): Promise<Order[]> {
  const normalizedOptions: OrderQueryOptions =
    typeof options === "number"
      ? { limit: options }
      : options || {};

  const supabase =
    await createSupabaseServerClient();

  let query = supabase
    .from("orders")
    .select(
      "id, project_id, order_id, chat_id, order_type, date_time, customer_name, phone_number, delivery_address, ordered_items, total_price, payment_method, payment_status"
    )
    .eq(
      "project_id",
      projectId
    )
    .order(
      "date_time",
      {
        ascending: false,
      }
    )
    .order("id", { ascending: false });

  if (normalizedOptions.from) {
    query = query.gte(
      "date_time",
      egyptMidnightUtc(normalizedOptions.from)
    );
  }

  if (normalizedOptions.to) {
    query = query.lt(
      "date_time",
      egyptMidnightUtc(normalizedOptions.to)
    );
  }

  const limit = normalizedOptions.limit;
  const offset = normalizedOptions.offset || 0;

  const {
    data,
    error,
  } = typeof limit === "number" && Number.isInteger(limit) && limit > 0
    ? offset > 0
      ? await query.range(offset, offset + limit - 1)
      : await query.limit(limit)
    : await query;

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

type SummaryOrder = Pick<Order, "customer" | "amount" | "status" | "date">;

async function getSummaryOrders(projectId: string): Promise<SummaryOrder[]> {
  const supabase = await createSupabaseServerClient();
  const rows: SummaryOrder[] = [];
  let offset = 0;
  while (true) {
    const { data, error, count } = await supabase.from("orders")
      .select("id, customer_name, total_price, payment_status, date_time", { count: "exact" })
      .eq("project_id", projectId).order("id", { ascending: true }).range(offset, offset + 999);
    if (error) throw new Error("Failed to load order summary: " + error.message);
    const page = data ?? [];
    for (const order of page) rows.push({ customer: order.customer_name,
      amount: Number(order.total_price), status: mapPaymentStatus(order.payment_status),
      date: getEgyptDateTime(order.date_time).date });
    offset += page.length;
    if (count !== null && offset >= count) break;
    if (!page.length) {
      if (count !== null && offset < count) throw new Error("Incomplete order summary response");
      break;
    }
  }
  return rows;
}

function getLastSevenDays(): {
  date: string;
  label: Bilingual;
}[] {
  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          EGYPT_TIME_ZONE,
        weekday: "short",
      }
    );

  const arabicDays: Record<
    string,
    string
  > = {
    Sat: "السبت",
    Sun: "الأحد",
    Mon: "الاثنين",
    Tue: "الثلاثاء",
    Wed: "الأربعاء",
    Thu: "الخميس",
    Fri: "الجمعة",
  };

  const dateFormatter =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          EGYPT_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    );

  const now =
    new Date();

  const egyptNowParts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          EGYPT_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).formatToParts(now);

  const year =
    Number(
      egyptNowParts.find(
        (part) =>
          part.type ===
          "year"
      )?.value
    );

  const month =
    Number(
      egyptNowParts.find(
        (part) =>
          part.type ===
          "month"
      )?.value
    );

  const day =
    Number(
      egyptNowParts.find(
        (part) =>
          part.type ===
          "day"
      )?.value
    );

  const egyptToday =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day
      )
    );

  const result: {
    date: string;
    label: Bilingual;
  }[] = [];

  for (
    let i = 6;
    i >= 0;
    i--
  ) {
    const date =
      new Date(
        egyptToday
      );

    date.setUTCDate(
      egyptToday.getUTCDate() -
        i
    );

    const dateKey =
      dateFormatter.format(
        date
      );

    const englishDay =
      formatter.format(
        date
      );

    result.push({
      date: dateKey,

      label: {
        ar:
          arabicDays[
            englishDay
          ] ||
          englishDay,

        en: englishDay,
      },
    });
  }

  return result;
}

function buildWeeklyRevenue(
  orders: SummaryOrder[]
): {
  label: Bilingual;
  value: number;
}[] {
  const days =
    getLastSevenDays();

  return days.map(
    (day) => {
      const revenue =
        orders
          .filter(
            (order) =>
              order.date ===
                day.date &&
              order.status ===
                "paid"
          )
          .reduce(
            (
              sum,
              order
            ) =>
              sum +
              order.amount,
            0
          );

      return {
        label:
          day.label,

        value:
          revenue,
      };
    }
  );
}

export async function getOverview(
  projectId: string
): Promise<Overview> {
  const [orders, recent] = await Promise.all([getSummaryOrders(projectId), getOrders(projectId, 5)]);

  const paidOrders =
    orders.filter(
      (order) =>
        order.status ===
        "paid"
    );

  const uniqueCustomers =
    new Set(
      orders.map(
        (order) =>
          order.customer
      )
    );

  return {
    stats: {
      orders:
        orders.length,

      revenue:
        paidOrders.reduce(
          (
            sum,
            order
          ) =>
            sum +
            order.amount,
          0
        ),

      customers:
        uniqueCustomers.size,

      paidRate:
        orders.length
          ? Math.round(
              (paidOrders.length /
                orders.length) *
                100
            )
          : 0,
    },

    weekly:
      buildWeeklyRevenue(
        orders
      ),

    recent:
      recent,

  };
}

export async function getAnalytics(
  projectId: string
): Promise<Analytics> {
  const orders = await getSummaryOrders(projectId);

  const paidOrders =
    orders.filter(
      (order) =>
        order.status ===
        "paid"
    );

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status ===
        "pending"
    );

  const failedOrders =
    orders.filter(
      (order) =>
        order.status ===
        "failed"
    );

  const uniqueCustomers =
    new Set(
      orders.map(
        (order) =>
          order.customer
      )
    );

  const revenue =
    paidOrders.reduce(
      (sum, order) =>
        sum + order.amount,
      0
    );

  const averageOrderValue =
    paidOrders.length
      ? revenue / paidOrders.length
      : 0;

  const totalOrders =
    orders.length;

  return {
    stats: {
      orders:
        totalOrders,

      revenue,

      customers:
        uniqueCustomers.size,

      paidRate:
        totalOrders
          ? Math.round(
              (paidOrders.length /
                totalOrders) *
                100
            )
          : 0,

      paidOrders:
        paidOrders.length,

      pendingOrders:
        pendingOrders.length,

      failedOrders:
        failedOrders.length,

      averageOrderValue:
        Math.round(
          averageOrderValue
        ),
    },

    weekly:
      buildWeeklyRevenue(
        orders
      ),

    statusBreakdown: [
      {
        status: "paid",
        count:
          paidOrders.length,
        percentage:
          totalOrders
            ? Math.round(
                (paidOrders.length /
                  totalOrders) *
                  100
              )
            : 0,
      },

      {
        status: "pending",
        count:
          pendingOrders.length,
        percentage:
          totalOrders
            ? Math.round(
                (pendingOrders.length /
                  totalOrders) *
                  100
              )
            : 0,
      },

      {
        status: "failed",
        count:
          failedOrders.length,
        percentage:
          totalOrders
            ? Math.round(
                (failedOrders.length /
                  totalOrders) *
                  100
              )
            : 0,
      },
    ],
  };
}