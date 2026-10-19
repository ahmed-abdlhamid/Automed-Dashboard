"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard route error:", error);
  }, [error]);

  return (
    <div className="dashboard-content" role="alert">
      <section className="xcard" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 18, fontWeight: 700 }}>
          حدث خطأ أثناء تحميل الصفحة
        </h2>
        <p style={{ lineHeight: 1.8, fontSize: 14 }}>
          تعذر تحميل هذه الصفحة حاليًا. جرّب إعادة المحاولة، وإذا استمرت المشكلة تحقق من اتصال قاعدة البيانات.
        </p>
        <button type="button" className="ctl" onClick={() => reset()}>
          إعادة المحاولة
        </button>
      </section>
    </div>
  );
}
