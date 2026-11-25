'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { getGuestCart, getGuestCartForSync, clearGuestCart, GuestCartItem } from '@/lib/guest-cart';
import { createOrderAction, createGuestOrderAction } from '@/lib/actions/order';
import { CartData, CartItem } from '@/types';
import Spinner from '@/components/ui/Spinner';
import { Package, ShoppingBag, CheckCircle2, MapPin, Phone, User, CreditCard } from 'lucide-react';

type DisplayItem = {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  discountPrice?: number | null;
  image?: string;
};

interface CheckoutClientProps {
  serverCart: CartData | null;
}

export default function CheckoutClient({ serverCart }: CheckoutClientProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [items, setItems] = useState<DisplayItem[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    shippingAddress: '',
    paymentMethod: 'COD',
  });

  // Load items — logged-in: server cart, guest: localStorage
  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      if (serverCart && serverCart.items.length > 0) {
        // Server থেকে cart এসেছে
        setItems(
          serverCart.items
            .filter((i: CartItem) => i.product != null)
            .map((i: CartItem) => ({
              productId: i.product.id,
              quantity: i.quantity,
              name: i.product.name,
              price: i.product.price,
              discountPrice: i.product.discountPrice,
              image: i.product.images?.[0],
            }))
        );
      }
      // serverCart null বা empty হলেও items [] — server createOrder call করলে
      // server নিজেই DB cart পড়বে, আলাদা items পাঠাতে হয় না
      setForm((prev) => ({ ...prev, customerName: session.user.name ?? '' }));
    } else {
      // Guest — localStorage theke poro
      const guestItems = getGuestCart();
      setItems(
        guestItems.map((i: GuestCartItem) => ({
          productId: i.productId,
          quantity: i.quantity,
          name: i.product.name,
          price: i.product.price,
          discountPrice: i.product.discountPrice,
          image: i.product.images?.[0],
        }))
      );
    }
    setReady(true);
  }, [session, isPending, serverCart]);

  const subtotal = items.reduce((sum, i) => {
    return sum + (i.discountPrice ?? i.price) * i.quantity;
  }, 0);
  const shippingFee = subtotal > 0 ? 60 : 0;
  const total = subtotal + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Guest user এর cart empty হলে block
    if (!session?.user && items.length === 0) {
      setError('Your cart is empty.');
      setLoading(false);
      return;
    }

    let res;

    if (session?.user) {
      // Logged-in: server DB cart theke order — items পাঠাতে হয় না
      res = await createOrderAction({
        shippingAddress: form.shippingAddress,
        phone: form.phone,
        paymentMethod: form.paymentMethod,
      });
    } else {
      // Guest: localStorage items body te pathano
      const guestItems = getGuestCartForSync();
      if (guestItems.length === 0) {
        setError('Your cart is empty.');
        setLoading(false);
        return;
      }
      res = await createGuestOrderAction({
        customerName: form.customerName,
        shippingAddress: form.shippingAddress,
        phone: form.phone,
        paymentMethod: form.paymentMethod,
        items: guestItems,
      });
    }

    setLoading(false);

    if (!res.success) {
      setError(res.message ?? 'Order failed. Please try again.');
      return;
    }

    // Success — guest cart clear koro
    if (!session?.user) {
      clearGuestCart();
    }

    setSuccess(true);
  };

  if (!ready || isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="emerald" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-sm text-gray-500 mb-7">
            Thank you for your order. We'll process it shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {session?.user ? (
              <Link
                href="/dashboard/user/orders"
                className="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition text-center"
              >
                View Orders
              </Link>
            ) : null}
            <Link
              href="/allproduct"
              className="flex-1 py-2.5 bg-gray-100 text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-200 transition text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !session?.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mb-6">Add some products before checking out.</p>
        <Link
          href="/allproduct"
          className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-7">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Shipping form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                Shipping Information
              </h2>

              {/* Customer name — only show for guest */}
              {!session?.user && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone Number
                  </span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="01XXXXXXXXX"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Shipping Address
                  </span>
                </label>
                <textarea
                  name="shippingAddress"
                  value={form.shippingAddress}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="House #, Road #, Area, City"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                />
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['COD', 'ONLINE'].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.paymentMethod === method
                        ? 'border-emerald-500 bg-emerald-50/60'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={form.paymentMethod === method}
                      onChange={handleChange}
                      className="accent-emerald-600"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {method === 'COD' ? 'Pay when you receive' : 'bKash / Nagad / Card'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner size="sm" color="white" />
                  Placing Order…
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Place Order · ৳{total.toLocaleString()}
                </>
              )}
            </button>
          </form>

          {/* Order summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900">
                  Order Summary ({items.length} item{items.length !== 1 ? 's' : ''})
                </h2>
              </div>

              <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                {items.map((item) => {
                  const price = item.discountPrice ?? item.price;
                  return (
                    <div key={item.productId} className="flex items-center gap-3 px-5 py-3.5">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">× {item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold text-gray-900 shrink-0">
                        ৳{(price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="px-5 py-4 bg-gray-50/50 space-y-2.5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold">৳{shippingFee}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-100 pt-2.5">
                  <span>Total</span>
                  <span className="text-emerald-600">৳{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Guest sign-in nudge */}
            {!session?.user && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
                <p className="font-semibold mb-1">Want to track your order?</p>
                <p className="text-xs text-amber-700 mb-3">
                  Sign in to view your order history and get updates.
                </p>
                <Link
                  href="/signin?callbackUrl=/checkout"
                  className="inline-block text-xs font-semibold text-amber-900 underline"
                >
                  Sign In →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
