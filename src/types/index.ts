export interface ProductData {
    id: string;
    name: string;
    shortDescription?: string;
    fullDescription?: string;
    category: string;
    price: number;
    stock?: number;
    images?: string[];
    brand?: string | null;
    sku: string;
    discountPrice?: number | null;
    specifications?: Record<string, string | number | boolean> | null; 
}

// Action response-er generics type ('any'-er jagay 'unknown')
export type ActionResponse<T = unknown> = 
    | { success: true; data: T }
    | { success: false; message: string };