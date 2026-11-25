export default function OrderDetailLoading() {
  return (
    <div className="space-y-6 max-w-3xl animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-28" />

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-100 rounded w-36" />
        </div>
        <div className="h-7 bg-gray-200 rounded-full w-24" />
      </div>

      {/* Timeline skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-28" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
            <div className="space-y-1.5 pt-1">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-gray-100 rounded w-40" />
            </div>
          </div>
        ))}
      </div>

      {/* Items skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
            <div className="w-14 h-14 rounded-xl bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 bg-gray-200 rounded w-40" />
              <div className="h-3 bg-gray-100 rounded w-24" />
            </div>
            <div className="text-right space-y-1.5">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-3 bg-gray-100 rounded w-16" />
            </div>
          </div>
        ))}
        <div className="px-6 py-4 bg-gray-50/50 flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-6 bg-gray-200 rounded w-24" />
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
