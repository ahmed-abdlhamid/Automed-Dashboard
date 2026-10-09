import Link from "next/link";
import type { ReactNode } from "react";

const PATHS = {
  home: "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10.5ZM9 21v-6h6v6",
  orders: "M7 3h10l2 4v14H5V7l2-4ZM5 8h14M9 4v4M15 4v4",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 13.5a7.7 7.7 0 0 0 0-3l2-1.2-2-3.3-2.2 1a7.5 7.5 0 0 0-2.6-1.5L14 3h-4l-.3 2.5A7.5 7.5 0 0 0 7.1 7L5 6 3 9.3l2 1.2a7.7 7.7 0 0 0 0 3l-2 1.2L5 18l2.1-1a7.5 7.5 0 0 0 2.6 1.5L10 21h4l.3-2.5a7.5 7.5 0 0 0 2.6-1.5l2.2 1 2-3.3-2.1-1.2Z",
  wallet: "M3 7.5A2.5 2.5 0 0 1 5.5 5H19v4M3 7.5V17a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1V9H5.5A2.5 2.5 0 0 1 3 7.5ZM16 14h2",
  users:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20c.5-3.2 2.8-5 6.5-5s6 1.8 6.5 5M16 5.5a3.5 3.5 0 0 1 0 7M17 15c2.7.3 4.3 1.9 4.7 4",
  pulse: "M4 12h4l2-6 4 12 2-6h4",
  analytics: "M4 19V5M4 19h17M8 16v-4M12 16V8M16 16V5M20 16v-8",
  customers:
    "M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 7a3 3 0 0 1 0 6M17 14.5a4 4 0 0 1 4 4V20",
  automation:
    "M9 3h6v4H9zM4 17h6v4H4zM14 17h6v4h-6zM12 7v4M7 17v-2a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2",
  activity:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2",
  menu: "M4 7h16M4 12h16M4 17h16",
  logout: "M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H9",
  chevronLeft: "m15 6-6 6 6 6",
  arrowUpRight: "M7 17 17 7M8 7h9v9",
  calendar:
    "M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM4 10h16M8 3v4M16 3v4",
  close: "m6 6 12 12M18 6 6 18",

  check:
    "m5 12 4 4L19 6",

  chevron: "m7 9 5 5 5-5",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM21 21l-4.3-4.3",
  sun: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  moon: "M20.5 14.4A8.5 8.5 0 0 1 9.6 3.5 8.5 8.5 0 1 0 20.5 14.4Z",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  size = 20,
}: {
  name: IconName;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

export function Card({
  title,
  subtitle,
  action,
  hover = false,
  className = "",
  children,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  hover?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`xcard ${hover ? "xcard-hover" : ""} ${className}`}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 px-6 pt-6">
          <div>
            {title && (
              <h2 className="font-head text-base font-semibold tracking-tight">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-1 text-xs font-medium text-mut">
                {subtitle}
              </p>
            )}
          </div>

          {action}
        </div>
      )}

      <div className="relative">
        {children}
      </div>
    </section>
  );
}

export function StatCard({
  icon,
  label,
  value,
  unit,
  footnote,
  href,
  featured = false,
}: {
  icon: IconName;
  label: string;
  value: string;
  unit?: string;
  footnote?: string;
  href?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`metric-card ${
        featured ? "metric-card-featured" : ""
      }`}
    >
      <div className="metric-head">
        <span className="metric-label">
          <Icon name={icon} size={18} />
          {label}
        </span>

        {href && (
          <Link
            href={href}
            className="metric-arrow"
            aria-label={label}
          >
            <Icon
              name="arrowUpRight"
              size={16}
            />
          </Link>
        )}
      </div>

      <div className="metric-value-row">
        <span className="metric-value">
          {value}
        </span>

        {unit && (
          <span className="metric-unit">
            {unit}
          </span>
        )}
      </div>

      {footnote && (
        <p className="metric-foot">
          {footnote}
        </p>
      )}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-head text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-sm text-mut">
            {subtitle}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

export function Badge({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "danger";
  children: ReactNode;
}) {
  return (
    <span className={`badge badge-${tone}`}>
      {children}
    </span>
  );
}

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty,
  equalColumnWidths = false,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty: string;
  equalColumnWidths?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table
        className="tbl w-full border-collapse"
        style={{ tableLayout: "fixed", width: "100%" }}
      >
        {equalColumnWidths && (
          <colgroup>
            {columns.map((column) => (
              <col
                key={column.key}
                style={{
                  width: `${100 / columns.length}%`,
                }}
              />
            ))}
          </colgroup>
        )}
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length === 0 && (
        <p className="px-6 py-10 text-center text-sm text-mut">
          {empty}
        </p>
      )}
    </div>
  );
}

export function BarChart({
  data,
}: {
  data: {
    label: string;
    value: number;
  }[];
}) {
  const max = Math.max(
    ...data.map((item) => item.value),
    1
  );

  return (
    <div className="chart-wrap" dir="ltr">
      <div className="chart-grid" />

      <div className="relative z-10 flex h-64 items-end gap-3 px-5 pb-5 pt-8 sm:gap-5">
        {data.map((item) => {
          const isTop =
            item.value === max &&
            item.value > 0;

          const isEmpty =
            item.value === 0;

          return (
            <div
              key={item.label}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
            >
              <span
                className={`text-xs font-semibold ${
                  isEmpty ? "text-mut" : ""
                }`}
              >
                {item.value.toLocaleString(
                  "en-US"
                )}
              </span>

              <div className="flex min-h-0 w-full flex-1 items-end justify-center">
                <div
                  className={`bar ${
                    isTop ? "bar-top" : ""
                  } ${
                    isEmpty
                      ? "bar-empty"
                      : ""
                  }`}
                  style={{
                    height: isEmpty
                      ? "30%"
                      : `${Math.max(
                          (item.value /
                            max) *
                            100,
                          12
                        )}%`,
                  }}
                  title={String(
                    item.value
                  )}
                />
              </div>

              <span className="text-xs text-mut">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Donut({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const size = 148;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(
    Math.max(value, 0),
    100
  );

  return (
    <div
      className="relative mx-auto"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${label} ${pct}%`}
        style={{
          transform: "rotate(-90deg)",
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--teal-soft)"
          strokeWidth={stroke}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--teal)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${
            (pct / 100) * circ
          } ${circ}`}
        />
      </svg>

      <div className="absolute inset-0 grid place-items-center text-center">
        <div dir="ltr">
          <p className="font-head text-2xl font-bold leading-none">
            {pct}%
          </p>

          <p className="mt-1.5 text-xs text-mut">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}