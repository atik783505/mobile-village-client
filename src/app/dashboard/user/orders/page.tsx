import { getUserOrdersAction } from '@/lib/actions/order';
import { Order } from '@/types';
import Link from 'next/link';
import { ShoppingBag, ChevronRight, Package } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';

const statusColor: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
  PROCESSING: 'bg-purple-100 text-purple-700 border-purple-200',
  SHIPPED: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
};

const statusStep: Record<string, number> = {
  PENDING: 1, CONFIRMED: 2, PROCESSING: 3, SHIPPED: 4, DELIVERED: 5, CANCELLED: 0,
};

export default async function OrdersPage() {
  noStore();

  const res = await getUserOrdersAction();
  const orders: Order[] = res.success ? (res.data ?? []) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-sm text-gray-500 mt-1">
            {orders.length} order{orders.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          href="/allproduct"
          className="inline-flex items-center gap-2 text-sm font-medium bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          Shop More
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-base font-semibold text-gray-500">No orders yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-5">
            Your order history will appear here once you place an order.
          </p>
          <Link
            href="/allproduct"
            className="inline-flex items-center gap-2 text-sm font-semibold bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const step = statusStep[order.orderStatus] ?? 0;
            const isCancelled = order.orderStatus === 'CANCELLED';

            return (
              <Link
                key={order.id}
                href={`/dashboard/user/orders/${order.id}`}
                className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
              >
                {/* Top row */}
                <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 border-b border-gray-50">
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusColor[order.orderStatus] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="text-sm font-extrabold text-gray-900">
                      ৳{order.totalPrice.toLocaleString()}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Products preview */}
                <div className="px-5 py-3 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="w-10 h-10 rounded-lg border-2 border-white bg-gray-100 overflow-hidden shrink-0"
                      >
                        {item.product.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-10 h-10 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 ml-1">
                    {order.items.map((i) => i.product.name).slice(0, 2).join(', ')}
                    {order.items.length > 2 ? ` +${order.items.length - 2} more` : ''}
                  </p>
                </div>

                {/* Progress bar */}
                {!isCancelled && (
                  <div className="px-5 pb-4">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div
                          key={s}
                          className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? 'bg-emerald-500' : 'bg-gray-100'}`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1.5">
                      {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((label, i) => (
                        <span
                          key={label}
                          className={`text-[9px] font-medium ${i + 1 <= step ? 'text-emerald-600' : 'text-gray-300'}`}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {isCancelled && (
                  <div className="px-5 pb-4">
                    <div className="h-1.5 w-full rounded-full bg-red-100" />
                    <p className="text-[10px] text-red-500 font-medium mt-1.5">Order was cancelled</p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
