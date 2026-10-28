'use server'

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";
import { ActionResponse, ProductData } from "@/types";

export const createProduct = async (productData: ProductData): Promise<ActionResponse> => {
    try {
        const res = await serverMutation('/api/products', productData);
        revalidatePath('/dashboard/products');

        return { success: true, data: res };
    } catch (error) {
        // TypeScript catch block-e error dhorar jonno standard way
        const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
        
        console.error(error);
        return { success: false, message: errorMessage };
    }
}
export const updateProduct = async (id: string, productData: ProductData): Promise<ActionResponse> => {
    try {
        const res = await serverMutation(`/api/products/${id}`, productData , 'PATCH');
        revalidatePath('/dashboard/products');

        return { success: true, data: res };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
        
        console.error(error);
        return { success: false, message: errorMessage };
    }
}