'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight, Loader2, Plus, Minus } from 'lucide-react';
import { addToCartAction, removeFromCartAction } from '@/lib/actions/cart';
import { useSession } from '@/lib/auth-client';
import {
  getGuestCart,
  getGuestCartForSync,
  removeFromGuestCart,
  updateGuestCartQuantity,
  clearGuestCart,
  GuestCartItem,
} from '@/lib/guest-cart';
import { syncCartAction } from '@/lib/actions/cart';
import { CartData, CartItem } from '@/types';

type DisplayItem = {
  id: string;
  quantity: number;
  isGuest?: boolean;
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number | null;
    images: string[];
    stock: number;
  };
};

interface CartViewProps {
  serverCart: CartData | null;
}

export default function CartView({ serverCart }: CartViewProps) {
  const { data: session, isPending } = useSession();
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      // Login detect korle guest cart sync koro (ekbaar)
      if (!synced) {
        setSynced(true);
        const guestItems = getGuestCartForSync();
        if (guestItems.length > 0) {
          syncCartAction(guestItems).then(() => {
            clearGuestCart();
            window.location.reload();
          });
          return;
        }
      }

      // Server cart use koro
      if (serverCart) {
        setItems(
          serverCart.items
            .filter((item: CartItem) => item.product != null)
            .map((item: CartItem) => ({
              id: item.id,
              quantity: item.quantity,
              product: item.product,
            }))
        );
      }
    } else {
      // Guest — localStorage theke poro
      const guestItems = getGuestCart();
      setItems(
        guestItems.map((item: GuestCartItem) => ({
          id: item.productId,
          quantity: item.quantity,
          isGuest: true,
          product: item.product,
        }))
      );
    }
    setReady(true);
  }, [session, isPending, serverCart, synced]);

  const handleRemove = async (item: DisplayItem) => {
    try {
      setLoadingId(item.id);

      if (item.isGuest) {
        removeFromGuestCart(item.product.id);
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        return;
      }

      const res = await removeFromCartAction(item.id);
      if (res.success) {
        const updated = res.data as CartData;
        setItems(updated.items.map((i: CartItem) => ({
          id: i.id,
          quantity: i.quantity,
          product: i.product,
        })));
      } else {
        alert(res.message || 'Failed to remove item.');
      }
    } catch {
      alert('Something went wrong.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleQuantityChange = async (item: DisplayItem, change: number) => {
    const newQty = item.quantity + change;
    if (newQty < 1) return;

    try {
      setLoadingId(item.id);

      if (item.isGuest) {
        updateGuestCartQuantity(item.product.id, newQty);
        setItems((prev) =>
          prev.map((i) => i.id === item.id ? { ...i, quantity: newQty } : i)
        );
        return;
      }

      const res = await addToCartAction(item.product.id, change);
      if (res.success) {
        const updated = res.data as CartData;
        setItems(updated.items.map((i: CartItem) => ({
          id: i.id,
          quantity: i.quantity,
          product: i.product,
        })));
      } else {
        alert(res.message || 'Failed to update quantity.');
      }
    } catch {
      alert('Something went wrong.');
    } finally {
      setLoadingId(null);
    }
  };

  const subtotal = items.reduce((acc, item) => {
    if (!item.product) return acc;
    const price = item.product.discountPrice ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const shippingFee = subtotal > 0 ? 60 : 0;
  const total = subtotal + shippingFee;

  if (isPending || !ready) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 max-w-sm mb-6">
          Looks like you haven't added anything yet.
        </p>
        <Link
          href="/allproduct"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-sm transition duration-200"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

      {!session?.user && (
        <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-center justify-between gap-4">
          <span>Sign in to save your cart and checkout.</span>
          <Link href="/signin?callbackUrl=/allcart" className="font-semibold underline whitespace-nowrap">
            Sign In
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.filter(item => item.product != null).map((item) => {
            const product = item.product;
            const price = product.discountPrice ?? product.price;
            const isItemLoading = loadingId === item.id;

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                    <Image
                      src={product.images?.[0] || '/placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                    <p className="text-blue-600 font-bold mt-1">৳{price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <button
                      onClick={() => handleQuantityChange(item, -1)}
                      disabled={item.quantity <= 1 || isItemLoading}
                      className="p-2 hover:bg-gray-200 text-gray-600 disabled:opacity-40 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-semibold text-gray-800 min-w-[2rem] text-center">
                      {isItemLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item, 1)}
                      disabled={item.quantity >= product.stock || isItemLoading}
                      className="p-2 hover:bg-gray-200 text-gray-600 disabled:opacity-40 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right font-bold text-gray-900 min-w-[80px]">
                    ৳{(price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => handleRemove(item)}
                    disabled={isItemLoading}
                    className="text-gray-400 hover:text-red-600 p-2 transition rounded-lg hover:bg-red-50 disabled:opacity-50"
                  >
                    {isItemLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
            Order Summary
          </h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">৳{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-gray-900">
                {shippingFee === 0 ? 'Free' : `৳${shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span className="text-blue-600">৳{total.toFixed(2)}</span>
            </div>
          </div>

          {session?.user ? (
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-sm transition duration-200"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              href="/signin?callbackUrl=/allcart"
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3.5 px-6 rounded-xl shadow-sm transition duration-200"
            >
              Sign In to Checkout
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
