'use server'

import { revalidatePath } from "next/cache";
import { serverMutation} from "../core/server";
import { ActionResponse } from "@/types";


export const addToCartAction = async (productId: string, quantity: number = 1): Promise<ActionResponse> => {
    try {
        const res = await serverMutation('/api/cart/add', { productId, quantity });
        revalidatePath('/cart');
        return { success: true, data: res.data, message: res.message };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
        return { success: false, message: errorMessage };
    }
}

export const removeFromCartAction = async (itemId: string): Promise<ActionResponse> => {
    try {
        const res = await serverMutation(`/api/cart/item/${itemId}`, {}, 'DELETE');
        revalidatePath('/cart');
        return { success: true, data: res.data, message: res.message };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
        return { success: false, message: errorMessage };
    }
}

export const syncCartAction = async (items: { productId: string; quantity: number }[]): Promise<ActionResponse> => {
    try {
        const res = await serverMutation('/api/cart/sync', { items }, 'POST');
        revalidatePath('/cart');
        return { success: true, data: res.data };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
        return { success: false, message: errorMessage };
    }
}