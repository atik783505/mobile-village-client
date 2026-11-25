export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 animate-pulse">
      <div className="max-w-5xl mx-auto">
        <div className="h-7 bg-gray-200 rounded w-28 mb-7" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <div className="h-5 bg-gray-200 rounded w-44" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-28" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <div className="h-5 bg-gray-200 rounded w-36" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-20 bg-gray-100 rounded-xl" />
                <div className="h-20 bg-gray-100 rounded-xl" />
              </div>
            </div>
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-32" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-100 rounded w-12" />
                  </div>
                  <div className="h-3.5 bg-gray-200 rounded w-14" />
                </div>
              ))}
              <div className="px-5 py-4 space-y-2.5">
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-5 bg-gray-200 rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
