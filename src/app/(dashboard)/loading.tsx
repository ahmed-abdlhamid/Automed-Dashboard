export default function DashboardLoading() {
  return (
    <div className="dashboard-content" role="status" aria-live="polite">
      <div className="xcard" style={{ padding: 24 }}>
        <p style={{ margin: 0, fontSize: 14 }}>
          جاري تحميل بيانات لوحة التحكم…
        </p>
      </div>
    </div>
  );
}
