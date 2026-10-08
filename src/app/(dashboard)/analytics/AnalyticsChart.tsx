"use client";

import { useId, useMemo } from "react";
import { useI18n, type Bilingual } from "@/components/Providers";

const W = 760;
const H = 240;
const PAD_TOP = 28;
const PAD_BOTTOM = 18;

export function AnalyticsChart({
  data,
}: {
  data: { label: Bilingual; value: number }[];
}) {
  const { t } = useI18n();
  const gradId = useId().replace(/:/g, "");

  const max = Math.max(...data.map((item) => item.value), 1);
  const step = W / Math.max(data.length, 1);

  // Each point sits at the centre of its column, so it lines up with the
  // label grid underneath (both share the same width).
  const pts = useMemo(
    () =>
      data.map((item, index) => ({
        x: step * (index + 0.5),
        y:
          H -
          PAD_BOTTOM -
          (item.value / max) * (H - PAD_TOP - PAD_BOTTOM),
        value: item.value,
      })),
    [data, max, step]
  );

  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area =
    pts.length > 0
      ? `M${pts[0].x},${H - PAD_BOTTOM} ` +
        pts.map((p) => `L${p.x},${p.y}`).join(" ") +
        ` L${pts[pts.length - 1].x},${H - PAD_BOTTOM} Z`
      : "";

  const topIndex = data.findIndex(
    (item) => item.value === max && item.value > 0
  );

  return (
    <div className="p-5">
      {/* Time always flows left -> right, also in the Arabic UI */}
      <div dir="ltr" className="rounded-2xl bg-surface-soft p-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full"
          role="img"
          aria-label={t({
            ar: "رسم بياني لاتجاه الإيرادات",
            en: "Revenue trend chart",
          })}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1="0"
              x2={W}
              y1={PAD_TOP + (H - PAD_TOP - PAD_BOTTOM) * f}
              y2={PAD_TOP + (H - PAD_TOP - PAD_BOTTOM) * f}
              stroke="var(--line)"
              strokeDasharray="4 6"
            />
          ))}

          {area && <path d={area} fill={`url(#${gradId})`} />}

          <polyline
            points={line}
            fill="none"
            stroke="var(--teal)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {pts.map((p, index) => (
            <circle
              key={index}
              cx={p.x}
              cy={p.y}
              r={index === topIndex ? 7 : 5}
              fill={index === topIndex ? "var(--orange)" : "var(--surface)"}
              stroke={index === topIndex ? "var(--surface)" : "var(--teal)"}
              strokeWidth={index === topIndex ? 3 : 3}
            />
          ))}
        </svg>

        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}
        >
          {data.map((item, index) => (
            <div key={`${item.label.en}-${index}`} className="text-center">
              <p className="text-xs text-mut">{t(item.label)}</p>
              <p
                className={`mt-0.5 text-xs font-semibold ${
                  index === topIndex ? "text-orange" : ""
                }`}
              >
                {item.value.toLocaleString("en-US")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
