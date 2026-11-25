'use server';

import { revalidatePath } from 'next/cache';
import { serverFetch, serverMutation } from '../core/server';
import { ActionResponse, CreateOrderPayload, Order } from '@/types';

// Logged-in user — DB cart থেকে order
export const createOrderAction = async (
  payload: CreateOrderPayload
): Promise<ActionResponse<Order>> => {
  try {
    const res = await serverMutation('/api/orders/create', payload, 'POST');
    revalidatePath('/dashboard/user/orders');
    revalidatePath('/allcart');
    return { success: true, data: res.data, message: res.message };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Something went wrong';
    return { success: false, message: msg };
  }
};

// Guest user — localStorage items body তে পাঠাই
export const createGuestOrderAction = async (
  payload: CreateOrderPayload & { items: { productId: string; quantity: number }[] }
): Promise<ActionResponse<Order>> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) throw new Error('NEXT_PUBLIC_BASE_URL is not defined');

    const res = await fetch(`${baseUrl}/api/orders/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, message: err.message ?? 'Order failed.' };
    }

    const data = await res.json();
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Something went wrong';
    return { success: false, message: msg };
  }
};

// User নিজের orders
export const getUserOrdersAction = async (): Promise<ActionResponse<Order[]>> => {
  try {
    const res = await serverFetch('/api/orders/my-orders');
    return { success: true, data: res.data, count: res.count };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Something went wrong';
    return { success: false, message: msg };
  }
};

// Admin — সব orders
export const getAllOrdersAction = async (): Promise<ActionResponse<Order[]>> => {
  try {
    const res = await serverFetch('/api/orders/admin/all');
    return { success: true, data: res.data, count: res.count };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Something went wrong';
    return { success: false, message: msg };
  }
};

// Admin — order status update
export const updateOrderStatusAction = async (
  orderId: string,
  orderStatus: string
): Promise<ActionResponse<Order>> => {
  try {
    const res = await serverMutation(
      `/api/orders/admin/${orderId}/status`,
      { orderStatus },
      'PATCH'
    );
    revalidatePath('/dashboard/admin/orders');
    return { success: true, data: res.data, message: res.message };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Something went wrong';
    return { success: false, message: msg };
  }
};
