export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-lg bg-surface-soft" />
          <div className="h-4 w-72 rounded-lg bg-surface-soft/60" />
        </div>
        <div className="h-9 w-32 rounded-xl bg-surface-soft" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="xcard p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-surface-soft" />
              <div className="h-8 w-8 rounded-lg bg-surface-soft/80" />
            </div>
            <div className="h-7 w-28 rounded bg-surface-soft" />
            <div className="h-3 w-36 rounded bg-surface-soft/60" />
          </div>
        ))}
      </div>

      {/* Main content grid skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="xcard p-6 lg:col-span-2 space-y-4">
          <div className="h-5 w-36 rounded bg-surface-soft" />
          <div className="h-64 rounded-xl bg-surface-soft/40" />
        </div>

        <div className="xcard p-6 space-y-4">
          <div className="h-5 w-32 rounded bg-surface-soft" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-soft/40"
              >
                <div className="h-4 w-24 rounded bg-surface-soft" />
                <div className="h-5 w-12 rounded-full bg-surface-soft/80" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
