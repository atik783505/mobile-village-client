import { getUserOrdersAction } from '@/lib/actions/order';
import { Order } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Package, MapPin, Phone, CreditCard, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';

const statusColor: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const timeline = [
  { key: 'PENDING', label: 'Order Placed', desc: 'Your order has been received.' },
  { key: 'CONFIRMED', label: 'Confirmed', desc: 'Order confirmed and being prepared.' },
  { key: 'PROCESSING', label: 'Processing', desc: 'Your order is being packed.' },
  { key: 'SHIPPED', label: 'Shipped', desc: 'Your order is on the way.' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Order delivered successfully.' },
];

const statusOrder = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  noStore();

  const { id } = await params;

  const res = await getUserOrdersAction();
  const orders: Order[] = res.success ? (res.data ?? []) : [];
  const order = orders.find((o) => o.id === id);

  if (!order) notFound();

  const currentStep = statusOrder.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'CANCELLED';

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back button */}
      <Link
        href="/dashboard/user/orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusColor[order.orderStatus] ?? 'bg-gray-100 text-gray-600'}`}>
          {order.orderStatus}
        </span>
      </div>

      {/* Order timeline */}
      {!isCancelled ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-5">Order Progress</h2>
          <div className="space-y-0">
            {timeline.map((step, idx) => {
              const done = idx <= currentStep;
              const active = idx === currentStep;
              const isLast = idx === timeline.length - 1;

              return (
                <div key={step.key} className="flex gap-4">
                  {/* Icon + line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${done ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-300'}`}>
                      {done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 flex-1 my-1 ${done && idx < currentStep ? 'bg-emerald-400' : 'bg-gray-100'}`} style={{ minHeight: '2rem' }} />
                    )}
                  </div>

                  {/* Text */}
                  <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
                    <p className={`text-sm font-semibold ${active ? 'text-emerald-700' : done ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${done ? 'text-gray-500' : 'text-gray-300'}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-700">Order Cancelled</p>
            <p className="text-xs text-red-500 mt-0.5">This order has been cancelled.</p>
          </div>
        </div>
      )}

      {/* Order items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">
            {order.items.length} Item{order.items.length !== 1 ? 's' : ''}
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4">
              <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                {item.product.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.product.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.product.category}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-900">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  ৳{item.price.toLocaleString()} × {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Order Total</span>
          <span className="text-lg font-extrabold text-emerald-600">
            ৳{order.totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Shipping & payment info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h2 className="text-sm font-bold text-gray-900">Delivery Info</h2>
          <div className="space-y-2.5 text-sm text-gray-600">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <span>{order.shippingAddress}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{order.phone}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h2 className="text-sm font-bold text-gray-900">Payment</h2>
          <div className="space-y-2.5 text-sm text-gray-600">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{order.paymentMethod}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-emerald-600 font-medium">Payment confirmed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
