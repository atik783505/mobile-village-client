'use server';

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";
import { ActionResponse, ProductData } from "@/types";

export const createProduct = async (productData: ProductData): Promise<ActionResponse> => {
    try {
        const res = await serverMutation('/api/products', productData);
        revalidatePath('/dashboard/admin/manage-product');
        return { success: true, data: res.data, message: res.message };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
        return { success: false, message: errorMessage };
    }
};

export const updateProduct = async (id: string, productData: Partial<ProductData>): Promise<ActionResponse> => {
    try {
        const res = await serverMutation(`/api/products/${id}`, productData, 'PATCH');
        revalidatePath('/dashboard/admin/manage-product');
        revalidatePath(`/dashboard/admin/manage-product/${id}`);
        return { success: true, data: res.data, message: res.message };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
        return { success: false, message: errorMessage };
    }
};

export const deleteProduct = async (id: string): Promise<ActionResponse> => {
    try {
        const res = await serverMutation(`/api/products/${id}`, undefined, 'DELETE');
        revalidatePath('/dashboard/admin/manage-product');
        return { success: true, message: res.message ?? 'Product deleted successfully.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
        return { success: false, message: errorMessage };
    }
};
