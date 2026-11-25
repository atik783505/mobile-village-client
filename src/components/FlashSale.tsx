import { getAllProducts } from '@/lib/api/product';
import type { ProductData } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import FlashSaleTimer from './FlashSaleTimer';

export async function FlashSaleSection() {
  let products: ProductData[] = [];

  try {
    const all = await getAllProducts();
    // discountPrice আছে এমন products আগে, তারপর বাকিগুলো — top 4
    const sorted = (all || []).sort((a: ProductData, b: ProductData) => {
      const aHas = a.discountPrice ? 1 : 0;
      const bHas = b.discountPrice ? 1 : 0;
      return bHas - aHas;
    });
    products = sorted.slice(0, 4);
  } catch {
    products = [];
  }

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-red-500">
            Limited Time
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            ⚡ Flash Sale
          </h2>
        </div>
        <FlashSaleTimer hours={5} />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => {
          const price = product.discountPrice ?? product.price;
          const hasDiscount = product.discountPrice && product.discountPrice < product.price;
          const off = hasDiscount
            ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
            : null;
          const image = product.images?.[0];

          return (
            <Link
              key={product.id}
              href={`/allproduct/${product.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
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
                {off && (
                  <span className="absolute left-2.5 top-2.5 rounded-lg bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                    -{off}%
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between p-3.5">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-green-600">
                    {product.category}
                  </span>
                  <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-green-600 transition-colors">
                    {product.name}
                  </h3>
                </div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-base font-extrabold text-slate-900">
                    ৳{Number(price).toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-slate-400 line-through">
                      ৳{Number(product.price).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
