import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { getAllOrdersAction } from '@/lib/actions/order';
import { getAllProducts } from '@/lib/api/product';
import { serverFetch } from '@/lib/core/server';
import { Order } from '@/types';
import Link from 'next/link';
import {
  ShoppingBag, Users, Package, TrendingUp,
  Clock, CheckCircle2, AlertTriangle, ArrowRight,
} from 'lucide-react';

function StatCard({
  icon: Icon, label, value, sub, color,
}: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  noStore();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/signin?callbackUrl=/dashboard');

  const user = session.user as typeof session.user & { role?: string };

  // User role হলে user dashboard এ redirect
  if (user.role !== 'admin') {
    redirect('/dashboard/user');
  }

  // Admin data fetch
  const [ordersRes, products, usersRes] = await Promise.allSettled([
    getAllOrdersAction(),
    getAllProducts(),
    serverFetch('/api/users'),
  ]);

  const orders: Order[] = ordersRes.status === 'fulfilled' && ordersRes.value.success
    ? (ordersRes.value.data ?? [])
    : [];

  const productList = products.status === 'fulfilled' ? (products.value ?? []) : [];
  const userList = usersRes.status === 'fulfilled' ? (usersRes.value.data ?? []) : [];

  const totalRevenue = orders
    .filter((o) => o.orderStatus !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const pendingOrders = orders.filter((o) => o.orderStatus === 'PENDING').length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length;
  const lowStockProducts = productList.filter((p: any) => (p.stock ?? 0) < 5 && (p.stock ?? 0) > 0).length;
  const outOfStockProducts = productList.filter((p: any) => (p.stock ?? 0) <= 0).length;

  const recentOrders = orders.slice(0, 5);

  const statusColor: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-purple-100 text-purple-700',
    SHIPPED: 'bg-indigo-100 text-indigo-700',
    DELIVERED: 'bg-emerald-100 text-emerald-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, {user.name}!</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp} label="Total Revenue" color="bg-emerald-50 text-emerald-600"
          value={`৳${totalRevenue.toLocaleString()}`}
          sub={`${orders.filter((o) => o.orderStatus !== 'CANCELLED').length} completed orders`}
        />
        <StatCard
          icon={ShoppingBag} label="Total Orders" color="bg-blue-50 text-blue-600"
          value={orders.length}
          sub={`${pendingOrders} pending`}
        />
        <StatCard
          icon={Package} label="Products" color="bg-purple-50 text-purple-600"
          value={productList.length}
          sub={`${outOfStockProducts} out of stock`}
        />
        <StatCard
          icon={Users} label="Customers" color="bg-orange-50 text-orange-600"
          value={userList.length}
          sub="registered users"
        />
      </div>

      {/* Alert row */}
      {(pendingOrders > 0 || lowStockProducts > 0 || outOfStockProducts > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {pendingOrders > 0 && (
            <Link
              href="/dashboard/admin/orders"
              className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 hover:bg-amber-100 transition group"
            >
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-800">{pendingOrders} Pending Orders</p>
                <p className="text-xs text-amber-600">Need fulfillment</p>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
          {outOfStockProducts > 0 && (
            <Link
              href="/dashboard/admin/manage-product"
              className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 hover:bg-red-100 transition group"
            >
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-800">{outOfStockProducts} Out of Stock</p>
                <p className="text-xs text-red-600">Restock needed</p>
              </div>
              <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
          {deliveredOrders > 0 && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">{deliveredOrders} Delivered</p>
                <p className="text-xs text-emerald-600">Successfully completed</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
          <Link
            href="/dashboard/admin/orders"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center">
            <ShoppingBag className="w-9 h-9 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Order', 'Customer', 'Total', 'Date', 'Status'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-600">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900 text-xs">{order.customerName}</td>
                    <td className="px-5 py-3.5 font-bold text-gray-900 text-xs">৳{order.totalPrice.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        day: 'numeric', month: 'short',
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusColor[order.orderStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/dashboard/admin/manage-product/new', icon: Package, label: 'Add Product', desc: 'Add new product to inventory', color: 'bg-purple-50 text-purple-600' },
          { href: '/dashboard/admin/orders', icon: ShoppingBag, label: 'Manage Orders', desc: 'View and update order statuses', color: 'bg-blue-50 text-blue-600' },
          { href: '/dashboard/admin/customers', icon: Users, label: 'View Customers', desc: 'Browse all registered users', color: 'bg-orange-50 text-orange-600' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-emerald-300 hover:shadow-md transition-all group"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
