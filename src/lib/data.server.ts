import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Bilingual } from "@/components/Providers";
import type {
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

function getEgyptDateTime(
  dateTime: string
): {
  date: string;
  time: string;
} {
  const value =
    new Date(dateTime);

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
  } = await supabase
    .from("projects")
    .select(
      "id, name, slug, description, status, created_at"
    )
    .order(
      "created_at",
      {
        ascending: true,
      }
    );

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
  projectId: string
): Promise<Order[]> {
  const supabase =
    await createSupabaseServerClient();

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
    .order(
      "date_time",
      {
        ascending: false,
      }
    );

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
  orders: Order[]
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
  const orders =
    await getOrders(
      projectId
    );

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