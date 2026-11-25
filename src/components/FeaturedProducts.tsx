import { getAllProducts } from '@/lib/api/product';
import type { ProductData } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default async function FeaturedProducts() {
  let products: ProductData[] = [];

  try {
    const all = await getAllProducts();
    products = (all || []).slice(0, 4);
  } catch {
    // Server down hole empty section dekhabe
    products = [];
  }

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
            Hand Picked
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Featured Products
          </h2>
        </div>
        <Link
          href="/allproduct"
          className="text-sm font-medium text-slate-600 transition hover:text-green-600"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => {
          const price = product.discountPrice ?? product.price;
          const hasDiscount = product.discountPrice && product.discountPrice < product.price;
          const discountPercent = hasDiscount
            ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
            : null;
          const image = product.images?.[0];
          const stock = product.stock ?? 0;

          return (
            <Link
              key={product.id}
              href={`/allproduct/${product.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                {image ? (
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-400">
                    No Image
                  </div>
                )}

                {discountPercent && (
                  <span className="absolute left-2.5 top-2.5 rounded-lg bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                    -{discountPercent}%
                  </span>
                )}

                {stock <= 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="rounded-lg bg-white/90 px-3 py-1 text-xs font-bold text-slate-700">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-green-600">
                    {product.category}
                  </span>
                  <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-green-600 transition-colors">
                    {product.name}
                  </h3>
                  {product.shortDescription && (
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                      {product.shortDescription}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-slate-900">
                      ৳{Number(price).toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-slate-400 line-through">
                        ৳{Number(product.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition group-hover:bg-green-700">
                    View
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
