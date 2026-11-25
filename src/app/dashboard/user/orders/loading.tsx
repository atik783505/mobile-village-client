export default function OrdersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div className="space-y-1.5">
          <div className="h-7 bg-gray-200 rounded w-36" />
          <div className="h-4 bg-gray-100 rounded w-24" />
        </div>
        <div className="h-9 bg-gray-200 rounded-xl w-28" />
      </div>

      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="space-y-1.5">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-3 bg-gray-100 rounded w-24" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 bg-gray-200 rounded-full w-20" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
          </div>
          <div className="px-5 py-3 flex gap-2">
            {[1, 2, 3].map((j) => (
              <div key={j} className="w-10 h-10 rounded-lg bg-gray-200" />
            ))}
          </div>
          <div className="px-5 pb-4 space-y-1.5">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="h-1.5 flex-1 rounded-full bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
