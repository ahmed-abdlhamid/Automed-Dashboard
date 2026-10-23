"use client";

import Link from "next/link";
import { useI18n } from "@/components/Providers";
import { resolveDashboardProfile, type ProjectDashboardSettings } from "@/config/project-dashboard";
import { dashboardConfig as cfg } from "@/config/dashboard.config";
import type { Order, Overview, Project } from "@/lib/data";
import { Badge, BarChart, Icon } from "@/components/ui";
import type { ProjectRole } from "@/lib/project";
import "./overview-workspace.css";

const numberFormatter = new Intl.NumberFormat("en-US");
const fmt = (value: number) => numberFormatter.format(value);

export default function OverviewView({ data, project, role, userName, greetingHour, dashboard }: {
  data: Overview; project: Project | null; role: ProjectRole | null;
  userName?: string; greetingHour: number;
  dashboard: { settings: ProjectDashboardSettings | null; available: boolean };
}) {
  const { t } = useI18n();
  const { category, specialty } = resolveDashboardProfile(`${dashboard.settings?.category ?? "general"}:${dashboard.settings?.specialty ?? "general"}`);
  const { stats, payments } = data;
  const weeklyTotal = data.weekly.reduce((sum, day) => sum + day.value, 0);
  const greeting = greetingHour >= 5 && greetingHour < 12
    ? t({ ar: "صباح الخير", en: "Good morning" })
    : greetingHour >= 12 && greetingHour < 18
      ? t({ ar: "نهارك سعيد", en: "Good afternoon" }) : t({ ar: "مساء الخير", en: "Good evening" });
  const paymentStates = [
    { id: "failed", label: { ar: "دفع غير ناجح", en: "Unsuccessful payment" }, value: payments.failed, tone: "danger" as const },
    { id: "pending", label: { ar: "بانتظار الدفع", en: "Awaiting payment" }, value: payments.pending, tone: "warn" as const },
    { id: "paid", label: { ar: "مدفوع", en: "Paid" }, value: payments.paid, tone: "ok" as const },
  ];
  const status = (order: Order) => paymentStates.find(item => item.id === order.status)!;
  return <div className="workbench">
    <header className="workbench-header">
      <div>
        <p className="workbench-greeting">{greeting}{userName ? <>، <bdi>{userName}</bdi></> : ""}</p>
        <h1>{t({ ar: "شغلك تحت عينك", en: "Your work, in focus" })}</h1>
        <p>{t(category.focus)}</p>
      </div>
      <div className="workbench-context">
        <span className="workbench-project"><span aria-hidden="true" /> <bdi>{project?.name ?? "Automed"}</bdi></span>
        <span>{t(category.label)}{category.id === "medical" ? ` / ${t(specialty.label)}` : ""}</span>
      </div>
    </header>

    {role === "admin" && !dashboard.settings && <aside className="workbench-setup">
      <p>{t({ ar: "جهّز المشروع: اختَر نوع النشاط من إعدادات المشروع ليُحفظ لجميع مستخدميه.", en: "Set up this project: choose its activity in project settings for all its users." })}</p>
      <Link className="workbench-link" href="/settings#project-setup">{t({ ar: "إعداد المشروع", en: "Set up project" })}<Icon name="chevronLeft" size={15} /></Link>
    </aside>}

    <section className="workbench-priority" aria-labelledby="priority-title">
      <div className="workbench-priority-intro">
        <span className="workbench-section-icon"><Icon name="pulse" size={23} /></span>
        <h2 id="priority-title">{t({ ar: "نبدأ بإيه؟", en: "Where to start" })}</h2>
        <p>{t({ ar: "راجع المدفوعات المعلّقة وغير الناجحة، ثم تابع أحدث الطلبات.", en: "Review pending and unsuccessful payments, then catch up on recent orders." })}</p>
        <span className="workbench-period">{t({ ar: "حالات الدفع · كل السجل", en: "Payment statuses · All records" })}</span>
      </div>
      <div className="workbench-priority-body">
        <div className="workbench-attention-grid">
          {paymentStates.slice(0, 2).map(item => <div className={`workbench-attention workbench-attention-${item.id}`} key={item.id}>
            <div><span className="workbench-status-dot" /><span>{t(item.label)}</span></div>
            <strong>{fmt(item.value)}</strong>
            <p>{item.id === "failed"
              ? t({ ar: "تحقق من حالة التحصيل قبل إعادة المحاولة.", en: "Check collection status before trying again." })
              : t({ ar: "راجع الطلبات التي لم يُسجّل دفعها بعد.", en: "Review orders whose payment has not been recorded yet." })}</p>
          </div>)}
        </div>
        <div className="workbench-priority-footer">
          <span>{!payments.failed && !payments.pending
            ? stats.orders ? t({ ar: "لا توجد حالات دفع معلّقة أو غير ناجحة في السجل.", en: "No pending or unsuccessful payments in the records." })
              : t({ ar: "لا توجد طلبات مسجّلة حتى الآن.", en: "No orders have been recorded yet." })
            : t({ ar: "حالة الدفع مستقلة عن تجهيز الطلب أو تسليمه.", en: "Payment status is separate from preparation or delivery." })}</span>
          <Link className="workbench-link" href="/orders?range=all">{t({ ar: "فتح سجل الطلبات", en: "Open order records" })}<Icon name="chevronLeft" size={15} /></Link>
        </div>
      </div>
    </section>

    <section className="workbench-metrics" aria-label={t({ ar: "ملخص السجل المالي", en: "Financial record summary" })}>
      {[
        { label: { ar: "الإيراد المدفوع", en: "Paid revenue" }, value: fmt(stats.revenue), unit: cfg.project.currency, icon: "wallet" as const },
        { label: { ar: "الطلبات المسجّلة", en: "Recorded orders" }, value: fmt(stats.orders), unit: "", icon: "orders" as const },
        { label: { ar: "العملاء في الطلبات", en: "Customers in orders" }, value: fmt(stats.customers), unit: "", icon: "users" as const },
        { label: { ar: "نسبة الطلبات المدفوعة", en: "Paid order rate" }, value: `${stats.paidRate}%`, unit: "", icon: "check" as const },
      ].map(item => <div className="workbench-metric" key={item.label.en}>
        <span><Icon name={item.icon} size={16} />{t(item.label)}</span>
        <div><strong>{item.value}</strong>{item.unit && <small>{item.unit}</small>}</div>
        <small>{t({ ar: "كل السجل", en: "All records" })}</small>
      </div>)}
    </section>

    <div className="workbench-analysis-grid">
      <section className="workbench-panel" aria-labelledby="trend-title">
        <div className="workbench-section-heading"><div><h2 id="trend-title">{t({ ar: "حركة الإيراد المدفوع", en: "Paid revenue trend" })}</h2><p>{t({ ar: "آخر ٧ أيام بتوقيت القاهرة", en: "Last 7 days, Cairo time" })}</p></div><Link className="workbench-link" href="/analytics">{t({ ar: "التحليلات", en: "Analytics" })}<Icon name="chevronLeft" size={14} /></Link></div>
        <div className="workbench-chart-total"><strong>{fmt(weeklyTotal)}</strong><span>{cfg.project.currency}</span></div>
        {weeklyTotal ? <div className="workbench-chart"><BarChart data={data.weekly.map(day => ({ label: t(day.label), value: day.value }))} /></div>
          : <div className="workbench-chart-empty"><Icon name="analytics" size={30} /><p>{t({ ar: "لا توجد إيرادات مدفوعة خلال آخر ٧ أيام.", en: "No paid revenue in the last 7 days." })}</p></div>}
      </section>
      <section className="workbench-panel" aria-labelledby="payments-title">
        <div className="workbench-section-heading"><div><h2 id="payments-title">{t({ ar: "توزيع حالات الدفع", en: "Payment breakdown" })}</h2><p>{t({ ar: "كل الطلبات المسجّلة", en: "All recorded orders" })}</p></div></div>
        <div className="workbench-distribution">{paymentStates.slice().reverse().map(item => <div key={item.id} className={`workbench-distribution-row workbench-distribution-${item.id}`}>
          <div><span>{t(item.label)}</span><strong>{fmt(item.value)}</strong></div>
          <div className="workbench-track"><span style={{ width: `${stats.orders ? item.value / stats.orders * 100 : 0}%` }} /></div>
        </div>)}</div>
        {!stats.orders && <p className="workbench-empty-note">{t({ ar: "سيظهر التوزيع بعد تسجيل أول طلب.", en: "The breakdown appears after your first order." })}</p>}
      </section>
    </div>

    <section className="workbench-panel workbench-records" aria-labelledby="records-title">
      <div className="workbench-section-heading"><div><h2 id="records-title">{t({ ar: "آخر ما اتسجّل", en: "Recently recorded" })}</h2><p>{t({ ar: "أحدث ٥ طلبات في المشروع", en: "The project's latest 5 orders" })}</p></div><Link className="workbench-link" href="/orders">{t({ ar: "كل الطلبات", en: "All orders" })}<Icon name="chevronLeft" size={14} /></Link></div>
      <div className="workbench-table-scroll"><table>
        <caption className="workbench-sr-only">{t({ ar: "أحدث الطلبات وحالة دفعها", en: "Recent orders and their payment statuses" })}</caption>
        <thead><tr>{[{ ar: "الطلب / العميل", en: "Order / customer" }, { ar: "التاريخ", en: "Date" }, { ar: "المبلغ", en: "Amount" }, { ar: "حالة الدفع", en: "Payment status" }].map(label => <th scope="col" key={label.en}>{t(label)}</th>)}</tr></thead>
        <tbody>{data.recent.map((order, index) => <tr key={`${order.id}-${index}`}>
          <td><strong><bdi>{order.customer || "—"}</bdi></strong><span><bdi dir="ltr">#{order.id}</bdi></span></td>
          <td><span dir="ltr">{order.date}</span><small dir="ltr">{order.time}</small></td>
          <td><bdi dir="ltr">{fmt(order.amount)} <small>{cfg.project.currency}</small></bdi></td>
          <td><Badge tone={status(order).tone}>{t(status(order).label)}</Badge></td>
        </tr>)}</tbody>
      </table></div>
      {!data.recent.length && <div className="workbench-records-empty"><Icon name="orders" size={27} /><p>{t({ ar: "أول طلب هيتسجّل هيظهر هنا.", en: "Your first recorded order will appear here." })}</p></div>}
    </section>
    <footer className="workbench-data-note"><Icon name="pulse" size={14} />{t({ ar: "الأرقام المالية من الطلبات المسجّلة. ", en: "Financial figures come from recorded orders. " })}{role === "admin" ? t({ ar: "أنت بتتابع المشروع المحدد فقط.", en: "You are viewing only the selected project." }) : t({ ar: "بيانات مشروعك فقط ظاهرة هنا.", en: "Only your project's data is shown here." })}</footer>
  </div>;
}
