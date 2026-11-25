import React from "react";

const reviews = [
  {
    name: "Rafiqul Islam",
    location: "Dhaka",
    rating: 5,
    text: "Delivery was super fast and the product was exactly as described. The Galaxy Buds sound quality is amazing. Will definitely order again!",
    product: "Samsung Galaxy Buds2 Pro",
    avatar: "RI",
  },
  {
    name: "Nusrat Jahan",
    location: "Chittagong",
    rating: 5,
    text: "Great customer service. I had a question about warranty and the team responded within minutes. The charger works perfectly with my MacBook.",
    product: "Anker 65W GaN Charger",
    avatar: "NJ",
  },
  {
    name: "Tanvir Ahmed",
    location: "Sylhet",
    rating: 4,
    text: "Product quality is top notch and 100% original. Packaging was secure. Only minor thing — took 2 extra days to deliver to Sylhet.",
    product: "Xiaomi Redmi Buds 4 Pro",
    avatar: "TA",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < count ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-7 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
          Customer Reviews
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          What Our Customers Say
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <div
            key={r.name}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
          >
            <Stars count={r.rating} />
            <p className="flex-1 text-sm leading-relaxed text-slate-600">
              &ldquo;{r.text}&rdquo;
            </p>
            <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                {r.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                <p className="text-xs text-slate-500">
                  {r.location} · {r.product}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
