'use server';

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";
import { ActionResponse, CreateOrderPayload } from "@/types";


export const createOrderAction = async (payload: CreateOrderPayload): Promise<ActionResponse> => {
    try {
        const res = await serverMutation('/api/orders/create', payload, 'POST');
        revalidatePath('/cart');
        revalidatePath('/orders');

        return { 
            success: true, 
            data: res.data, 
            message: res.message || 'Order placed successfully!' 
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Something went wrong while placing the order';
        return { success: false, message: errorMessage };
    }
}