import { SingleProductProps } from '@/app/dashboard/admin/manage-product/[id]/page';
import { getProduct } from '@/lib/api/product';
import React from 'react';
import Image from 'next/image';
import { CheckCircle2, XCircle, Tag, ShieldCheck } from 'lucide-react';
import AddToCartButton from '@/components/AddToCart';


const SingleProduct = async ({ params }: SingleProductProps) => {
  const { id } = await params;
  const product = await getProduct(id);

  const {
    id: productId, 
    name,
    brand,
    category,
    price,
    discountPrice,
    fullDescription,
    shortDescription,
    images = [],
    isAvailable,
    sku,
    stock,
    specifications = {},
  } = product || {};

  const hasDiscount = discountPrice && discountPrice > 0;
  const discountPercentage = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 sm:p-10">
          
          {/* Left Column: Product Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              {images?.[0] ? (
                <Image
                  src={images[0]}
                  alt={name || 'Product Image'}
                  fill
                  className="object-cover object-center transition-transform hover:scale-105 duration-300"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image Available
                </div>
              )}
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img: string, idx: number) => (
                  <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    <Image src={img} alt="preview" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md font-semibold">
                  {category}
                </span>
                <span>SKU: {sku}</span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  {name}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Brand: <span className="font-semibold text-gray-700">{brand}</span>
                </p>
              </div>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-extrabold text-gray-900">
                  ${hasDiscount ? discountPrice : price}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-400 line-through">
                    ${price}
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed border-t border-b border-gray-100 py-3">
                {shortDescription}
              </p>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 font-medium">
                  {isAvailable && stock > 0 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">In Stock ({stock} available)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-500">Out of Stock</span>
                    </>
                  )}
                </div>
              </div>

              {/* Purchase Component Call */}
              <AddToCartButton
                productId={productId}
                stock={stock}
                isAvailable={isAvailable}
                productName={name}
                productPrice={price}
                productDiscountPrice={discountPrice}
                productImages={images}
              />

            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>100% Authentic Product</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-500" />
                <span>Best Price Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Full Description & Specifications */}
        <div className="border-t border-gray-100 bg-gray-50/50 p-6 sm:p-10 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Product Description</h3>
            <div className="prose prose-sm text-gray-600 leading-relaxed max-w-none">
              {fullDescription}
            </div>
          </div>

          {Object.keys(specifications).length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Specifications</h3>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-2xl">
                <table className="w-full text-sm text-left">
                  <tbody>
                    {Object.entries(specifications).map(([key, value], idx) => (
                      <tr
                        key={key}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="px-4 py-3 font-medium text-gray-700 capitalize border-b border-gray-100">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </td>
                        <td className="px-4 py-3 text-gray-600 border-b border-gray-100">
                          {String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;