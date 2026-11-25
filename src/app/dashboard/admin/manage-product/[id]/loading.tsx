export default function ProductDetailLoading() {
  return (
    <div className="p-8 max-w-6xl mx-auto animate-pulse">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center border-b pb-4">
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-24" />
          <div className="h-7 bg-gray-200 rounded w-56 mt-2" />
          <div className="h-4 bg-gray-100 rounded w-32" />
        </div>
        <div className="space-y-2 text-right">
          <div className="h-6 bg-gray-200 rounded-full w-20 ml-auto" />
          <div className="h-3.5 bg-gray-100 rounded w-24 ml-auto" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-200 rounded-2xl h-80" />
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <div className="h-9 bg-gray-200 rounded w-32" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-4/5" />
            </div>
            <div className="border-t pt-4">
              <div className="h-4 bg-gray-100 rounded w-40" />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 bg-white p-6 rounded-2xl border shadow-sm space-y-3">
        <div className="h-5 bg-gray-200 rounded w-36" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
          <div className="h-4 bg-gray-100 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
}
