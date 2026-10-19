"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/components/Providers";
import { Icon } from "@/components/ui";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <div className="xcard max-w-md w-full p-6 md:p-8 text-center space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
          <Icon name="pulse" size={28} />
        </div>

        <div className="space-y-2">
          <h2 className="font-head text-lg font-bold">
            {t({
              ar: "حدث خطأ أثناء تحميل البيانات",
              en: "Something went wrong loading data",
            })}
          </h2>

          <p className="text-sm text-mut leading-relaxed">
            {error.message ||
              t({
                ar: "تعذر الاتصال بالخادم أو جلب البيانات المطلوبة. يرجى إعادة المحاولة.",
                en: "Could not connect to the server or load the requested data. Please try again.",
              })}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 shadow-sm"
          >
            <Icon name="activity" size={16} />
            {t({
              ar: "إعادة المحاولة",
              en: "Try again",
            })}
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-surface-soft px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface"
          >
            {t({
              ar: "الرئيسية",
              en: "Overview",
            })}
          </Link>
        </div>
      </div>
    </div>
  );
}
