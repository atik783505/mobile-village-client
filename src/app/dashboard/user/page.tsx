import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { getUserOrdersAction } from '@/lib/actions/order';
import { Order } from '@/types';
import Link from 'next/link';
import { User, ShoppingBag, Heart, MapPin, Mail, Calendar, Shield } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function statusColor(status: string) {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-purple-100 text-purple-700',
    SHIPPED: 'bg-indigo-100 text-indigo-700',
    DELIVERED: 'bg-emerald-100 text-emerald-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };
  return map[status] ?? 'bg-gray-100 text-gray-600';
}

export default async function UserAccountPage() {
  noStore();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/signin?callbackUrl=/dashboard/user');

  const user = session.user as typeof session.user & { role?: string };

  const ordersRes = await getUserOrdersAction();
  const orders: Order[] = ordersRes.success ? (ordersRes.data ?? []) : [];

  const totalSpent = orders
    .filter((o) => o.orderStatus !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, {user.name}!</p>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <span className="text-2xl font-bold text-emerald-600">
                {user.name?.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
                {user.role ?? 'user'}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-500" />
                {user.emailVerified ? 'Email verified' : 'Email not verified'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={orders.length}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={User}
          label="Total Spent"
          value={`৳${totalSpent.toLocaleString()}`}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={Heart}
          label="Delivered"
          value={orders.filter((o) => o.orderStatus === 'DELIVERED').length}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
          <Link
            href="/dashboard/user/orders"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-14 text-center">
            <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No orders yet.</p>
            <Link
              href="/allproduct"
              className="mt-3 inline-block text-sm font-semibold text-emerald-600 hover:underline"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/user/orders/${order.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/60 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                    {' · '}{order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    ৳{order.totalPrice.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/user/orders"
          className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Order History</p>
            <p className="text-xs text-gray-500 mt-0.5">View and track all your orders</p>
          </div>
        </Link>

        <Link
          href="/allproduct"
          className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Shop Products</p>
            <p className="text-xs text-gray-500 mt-0.5">Browse our latest collection</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
