'use server';

import { ActionResponse } from "@/types";
import { serverFetch } from "../core/server";

export const getCartAction = async (): Promise<ActionResponse> => {
    try {
        const res = await serverFetch('/api/cart');
        return { success: true, data: res.data };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
        return { success: false, message: errorMessage };
    }
}
