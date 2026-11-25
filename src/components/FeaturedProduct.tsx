"use client";

import Image from "next/image";
import React from "react";

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  badge?: string;
}

export function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart?: (product: Product) => void;
}) {
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        {discountPercent && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/95 px-2.5 py-1.5 shadow-sm backdrop-blur-xs">
            <span className="rounded-lg bg-green-600 px-2 py-0.5 text-xs font-bold text-white">
              -{discountPercent}%
            </span>
            <span className="text-xs font-medium text-slate-700">
              {product.badge ?? "Flash Deal"}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-green-600">
            {product.category}
          </span>
          <h3 className="mt-1 line-clamp-1 text-base font-bold text-slate-900">
            {product.title}
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-slate-900">
              ৳{product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-slate-400 line-through">
                ৳{product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className="rounded-lg bg-green-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-green-700 active:scale-[0.98]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}