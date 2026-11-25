export default function CustomersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-1 border-b border-gray-100 pb-5">
        <div className="h-7 bg-gray-200 rounded w-36" />
        <div className="h-4 bg-gray-100 rounded w-28" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
            <div className="h-3.5 bg-gray-200 rounded w-24" />
            <div className="h-7 bg-gray-200 rounded w-12" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-5 px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div className="h-4 bg-gray-200 rounded w-28" />
            </div>
            <div className="h-4 bg-gray-100 rounded w-36" />
            <div className="h-5 bg-gray-200 rounded-full w-16" />
            <div className="h-5 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-100 rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
