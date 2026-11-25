export default function EditProductLoading() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-pulse">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
        <div className="h-7 bg-gray-200 rounded w-36" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-28" />
              <div className="h-10 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-36" />
          <div className="h-24 bg-gray-100 rounded-xl" />
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-36" />
          <div className="h-32 bg-gray-100 rounded-xl" />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <div className="h-10 bg-gray-200 rounded-xl w-24" />
          <div className="h-10 bg-gray-200 rounded-xl w-32" />
        </div>
      </div>
    </div>
  );
}
