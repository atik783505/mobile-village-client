'use client';

import React, { useState } from 'react';
import { ShoppingBag, ShoppingCart, Loader2 } from 'lucide-react';
import { addToCartAction } from '@/lib/actions/cart';
import { AddToCartButtonProps } from '@/types';
import { useSession } from '@/lib/auth-client';
import { addToGuestCart } from '@/lib/guest-cart';

export default function AddToCartButton({
  productId,
  stock,
  isAvailable,
  productName,
  productPrice,
  productDiscountPrice,
  productImages,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const { data: session } = useSession();

  const productDetails = {
    id: productId,
    name: productName,
    price: productPrice,
    discountPrice: productDiscountPrice ?? null,
    images: productImages,
    stock,
  };

  const handleAddToCart = async () => {
    try {
      setLoadingCart(true);

      if (!session?.user) {
        addToGuestCart(productId, quantity, productDetails);
        alert('Added to cart! Sign in to save your cart.');
        return;
      }

      const res = await addToCartAction(productId, quantity);
      if (res.success) {
        alert(res.message || 'Product added to cart successfully!');
      } else {
        alert(res.message || 'Failed to add to cart.');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    } finally {
      setLoadingCart(false);
    }
  };

  const handleBuyNow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingBuy(true);

      if (!session?.user) {
        addToGuestCart(productId, quantity, productDetails);
        window.location.href = '/signin?callbackUrl=/allcart';
        return;
      }

      const res = await addToCartAction(productId, quantity);
      if (res.success) {
        window.location.href = '/allcart';
      } else {
        alert(res.message || 'Could not proceed to checkout.');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    } finally {
      setLoadingBuy(false);
    }
  };

  return (
    <form onSubmit={handleBuyNow} className="pt-4 space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="text-sm font-semibold text-gray-700">
          Quantity:
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          min="1"
          max={stock || 1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          disabled={!isAvailable || stock <= 0}
          className="w-20 rounded-lg border border-gray-300 py-2 px-3 text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!isAvailable || stock <= 0 || loadingCart}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-sm transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loadingCart ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
          {loadingCart ? 'Adding...' : 'Add to Cart'}
        </button>

        <button
          type="submit"
          disabled={!isAvailable || stock <= 0 || loadingBuy}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-sm transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loadingBuy ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingBag className="w-5 h-5" />}
          {loadingBuy ? 'Processing...' : 'Buy Now'}
        </button>
      </div>
    </form>
  );
}
