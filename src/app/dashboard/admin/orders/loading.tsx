export default function AdminOrdersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-1 border-b border-gray-100 pb-5">
        <div className="h-7 bg-gray-200 rounded w-48" />
        <div className="h-4 bg-gray-100 rounded w-28" />
      </div>
      <div className="flex gap-3">
        <div className="h-10 bg-gray-200 rounded-xl flex-1 max-w-xs" />
        <div className="h-10 bg-gray-200 rounded-xl w-36" />
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-3 space-y-1.5">
            <div className="h-3 bg-gray-200 rounded w-16" />
            <div className="h-6 bg-gray-200 rounded w-8" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3.5 border-b border-gray-50">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-28" />
            <div className="h-4 bg-gray-100 rounded w-12" />
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-100 rounded w-14" />
            <div className="h-4 bg-gray-100 rounded w-20" />
            <div className="h-6 bg-gray-200 rounded-lg w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
