import { getAllProducts } from '@/lib/api/product';
import type { ProductData } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Allproduct = async () => {
    const allproducts: ProductData[] = (await getAllProducts()) || [];

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">All Products</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Total <span className="font-semibold text-gray-700">{allproducts.length}</span> products available in the inventory.
                    </p>
                </div>
                <Link
                    href="/dashboard/admin/manage-product/new"
                    className="inline-flex items-center justify-center text-xs font-medium bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-500/20"
                >
                    + Add New Product
                </Link>
            </div>

            {/* প্রোডাক্ট খালি থাকলে Empty State */}
            {allproducts.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 text-base font-medium">No products found.</p>
                    <p className="text-gray-400 text-xs mt-1">Start by adding a new product to your inventory.</p>
                </div>
            ) : (
                /* ৪-কলাম গ্রিড লেআউট */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {allproducts.map((product) => {
                        const stock = product.stock ?? 0;
                        const isOutOfStock = stock <= 0;
                        const isLowStock = stock > 0 && stock < 5;
                        const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

                        return (
                            <div
                                key={product.id || product.sku}
                                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                            >
                                {/* প্রডাক্ট ইমেজ ও ব্যাজ */}
                                <div className="relative h-48 bg-gray-50 w-full overflow-hidden flex items-center justify-center">
                                    {mainImage ? (
                                        <Image
                                            src={mainImage}
                                            alt={product.name}
                                            fill
                                            unoptimized
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-gray-400">
                                            <span className="text-xs">No Image Available</span>
                                        </div>
                                    )}

                                    {/* স্টক ব্যাজ */}
                                    <span
                                        className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md ${
                                            isOutOfStock
                                                ? 'bg-rose-100/90 text-rose-700 border border-rose-200'
                                                : isLowStock
                                                ? 'bg-amber-100/90 text-amber-700 border border-amber-200'
                                                : 'bg-emerald-100/90 text-emerald-700 border border-emerald-200'
                                        }`}
                                    >
                                        {isOutOfStock ? 'Out of Stock' : isLowStock ? `Low (${stock})` : `${stock} left`}
                                    </span>
                                </div>

                                {/* প্রডাক্ট ইনফরমেশন */}
                                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                {product.category}
                                            </span>
                                            {product.brand && (
                                                <span className="text-[11px] font-medium text-gray-400">
                                                    {product.brand}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                            {product.name}
                                        </h3>

                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                            {product.shortDescription}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                        <div>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-base font-bold text-gray-900">
                                                    ${product.discountPrice ? Number(product.discountPrice).toFixed(2) : Number(product.price).toFixed(2)}
                                                </span>
                                                {product.discountPrice && (
                                                    <span className="text-xs text-gray-400 line-through">
                                                        ${Number(product.price).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <Link
                                            href={`/allproduct/${product.id}`}
                                            className="text-xs font-semibold bg-gray-900 text-white px-3.5 py-2 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Allproduct;