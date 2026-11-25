'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, AlertTriangle, ArrowLeft, Package } from 'lucide-react';
import { deleteProduct } from '@/lib/actions/product';
import { ProductData } from '@/types';
import Spinner from '@/components/ui/Spinner';

export default function DeleteProductClient({ product }: { product: ProductData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    const res = await deleteProduct(product.id!);

    if (!res.success) {
      setError(res.message ?? 'Failed to delete product.');
      setLoading(false);
      return;
    }

    router.push('/dashboard/admin/manage-product');
    router.refresh();
  };

  const image = product.images?.[0];

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <Link
        href="/dashboard/admin/manage-product"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Warning header */}
        <div className="bg-red-50 border-b border-red-100 px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-red-800">Delete Product</h1>
            <p className="text-xs text-red-600 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>

        {/* Product preview */}
        <div className="px-6 py-5 flex items-center gap-4 border-b border-gray-100">
          <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
            {image ? (
              <Image src={image} alt={product.name} width={64} height={64} className="w-full h-full object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-300" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{product.category} · SKU: {product.sku}</p>
            <p className="text-xs font-semibold text-emerald-600 mt-1">
              ৳{product.discountPrice ?? product.price}
            </p>
          </div>
        </div>

        {/* Confirm text */}
        <div className="px-6 py-5">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900">"{product.name}"</span>?
            All associated cart items and order records will remain intact, but this product
            will no longer be available.
          </p>

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-6">
            <Link
              href="/dashboard/admin/manage-product"
              className="flex-1 py-2.5 text-center text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              Cancel
            </Link>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <Spinner size="sm" color="white" /> : <Trash2 className="w-4 h-4" />}
              {loading ? 'Deleting…' : 'Delete Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
