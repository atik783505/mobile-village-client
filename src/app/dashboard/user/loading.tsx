export default function UserDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-1">
        <div className="h-7 bg-gray-200 rounded w-36" />
        <div className="h-4 bg-gray-100 rounded w-52" />
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gray-200 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-gray-200 rounded w-40" />
            <div className="h-4 bg-gray-100 rounded w-56" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-200" />
            <div className="space-y-2">
              <div className="h-3.5 bg-gray-200 rounded w-20" />
              <div className="h-6 bg-gray-100 rounded w-14" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="h-5 bg-gray-200 rounded w-32" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div className="space-y-1.5">
              <div className="h-4 bg-gray-200 rounded w-28" />
              <div className="h-3 bg-gray-100 rounded w-20" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 bg-gray-200 rounded-full w-20" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
