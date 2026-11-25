import { getAllOrdersAction } from '@/lib/actions/order';
import { Order } from '@/types';
import { unstable_noStore as noStore } from 'next/cache';
import AdminOrdersClient from './AdminOrdersClient';

export default async function AdminOrdersPage() {
  noStore();
  const res = await getAllOrdersAction();
  const orders: Order[] = res.success ? (res.data ?? []) : [];
  return <AdminOrdersClient initialOrders={orders} />;
}
