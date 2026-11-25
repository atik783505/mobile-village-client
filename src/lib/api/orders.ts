'use server';

import { serverFetch } from "../core/server";
import { ActionResponse } from "@/types";

export const getUserOrdersAction = async (): Promise<ActionResponse> => {
    try {
        const res = await serverFetch('/api/orders/my-orders');
        return { 
            success: true, 
            data: res.data, 
            count: res.count 
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Something went wrong while fetching your orders';
        return { success: false, message: errorMessage };
    }
}

export const getAllOrdersForAdminAction = async (): Promise<ActionResponse> => {
    try {
        const res = await serverFetch('/api/orders/admin/all');
        return { 
            success: true, 
            data: res.data, 
            count: res.count 
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Something went wrong while fetching all orders';
        return { success: false, message: errorMessage };
    }
}