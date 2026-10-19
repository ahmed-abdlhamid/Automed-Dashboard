import { getOrders } from "@/lib/data.server";
import { getCurrentProjectId } from "@/lib/project";
import OrdersView from "./OrdersView";

type SearchParams = Promise<{
  range?: string;
  from?: string;
  to?: string;
  page?: string;
}>;

function dateKeyInEgypt(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function shiftDateKey(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function isDateKey(value?: string): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const projectId = await getCurrentProjectId();
  const params = await searchParams;
  const allowedRanges = ["recent", "week", "month", "all", "custom"];
  const range = allowedRanges.includes(params.range || "")
    ? params.range!
    : "recent";
  const parsedPage = Number.parseInt(params.page || "1", 10);
  const pageNumber = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;
  const today = dateKeyInEgypt(new Date());

  let from: string | undefined;
  let to: string | undefined;
  const customRangeValid =
    range !== "custom" ||
    (isDateKey(params.from) &&
      isDateKey(params.to) &&
      params.from <= params.to);

  if (range === "week") {
    from = shiftDateKey(today, -6);
    to = shiftDateKey(today, 1);
  } else if (range === "month") {
    from = shiftDateKey(today, -29);
    to = shiftDateKey(today, 1);
  } else if (range === "custom") {
    if (isDateKey(params.from) && isDateKey(params.to) && params.from <= params.to) {
      from = params.from;
      to = shiftDateKey(params.to, 1);
    }
  }

  const isRecent = range === "recent";
  const pageSize = isRecent ? 10 : 25;
  const fetchedOrders = customRangeValid
    ? await getOrders(
        projectId,
        isRecent
          ? { limit: pageSize }
          : {
              from: range === "all" ? undefined : from,
              to: range === "all" ? undefined : to,
              limit: pageSize + 1,
              offset: (pageNumber - 1) * pageSize,
            }
      )
    : [];
  const hasNextPage = !isRecent && customRangeValid && fetchedOrders.length > pageSize;
  const orders = fetchedOrders.slice(0, pageSize);

  return (
    <OrdersView
      orders={orders}
      range={range}
      from={params.from || ""}
      to={params.to || ""}
      page={pageNumber}
      pageSize={pageSize}
      hasNextPage={hasNextPage}
    />
  );
}
