function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-200 rounded w-2/5" />
        <div className="h-3 bg-gray-100 rounded w-1/4" />
      </div>
      <div className="h-3.5 bg-gray-200 rounded w-16" />
      <div className="h-3.5 bg-gray-200 rounded w-14" />
      <div className="h-3.5 bg-gray-200 rounded w-20" />
      <div className="h-7 bg-gray-200 rounded-lg w-16" />
    </div>
  );
}

export default function ManageProductLoading() {
  return (
    <main className="min-h-screen bg-gray-50/50 py-8">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header skeleton */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 animate-pulse">
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-36" />
            <div className="h-3.5 bg-gray-100 rounded w-24" />
          </div>
          <div className="h-9 bg-gray-200 rounded-xl w-32" />
        </div>

        {/* Table rows */}
        <div>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
