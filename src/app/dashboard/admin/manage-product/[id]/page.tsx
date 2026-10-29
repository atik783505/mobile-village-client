import { getProduct } from '@/lib/api/product';
import Image from 'next/image';
import React from 'react';

export interface SingleProductProps {
  params: Promise<{
    id: string;
  }>;
}

const SingleProduct = async ({ params }: SingleProductProps) => {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  return (
    // মূল কন্টেন্ট এরিয়া যা সাইডবারের সাথে সাংঘর্ষিক হবে না
    <div className="p-8 max-w-6xl mx-auto">
      {/* টপ হেডার বা ব্রেডক্রাম্ব */}
      <div className="mb-6 flex justify-between items-center border-b pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold mt-2 text-gray-800">{product.name}</h1>
          {product.brand && <p className="text-sm text-gray-500 mt-1">Brand: <span className="font-medium text-gray-700">{product.brand}</span></p>}
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {product.isAvailable ? 'In Stock' : 'Out of Stock'}
          </span>
          <p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>
        </div>
      </div>

      {/* মূল গ্রিড লেআউট (ছবি এবং ডিটেইলস) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* প্রোডাক্ট ইমেজ সেকশন */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-sm border h-80 relative flex items-center justify-center">
            {product.images && product.images.length > 0 ? (
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                fill 
                className="object-cover"
              />
            ) : (
              <span className="text-gray-400">No Image Available</span>
            )}
          </div>
        </div>

        {/* প্রোডাক্ট ইনফো ও প্রাইসিং */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-emerald-600">
                ${product.discountPrice ? product.discountPrice.toFixed(2) : product.price?.toFixed(2)}
              </span>
              {product.discountPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ${product.price?.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">
              {product.shortDescription}
            </p>

            <div className="border-t pt-4 text-sm text-gray-600 space-y-2">
              <p><strong>Available Stock:</strong> {product.stock} units</p>
            </div>
          </div>
        </div>
      </div>

      {/* ফুল ডেসক্রিপশন */}
      <div className="mt-8 bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Full Description</h3>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {product.fullDescription}
        </p>
      </div>
    </div>
  );
};

export default SingleProduct;