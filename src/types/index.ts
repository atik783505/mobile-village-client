export interface ProductData {
    id?: string; // create-e lagbe na, update-e lagbe
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

export interface AddToCartButtonProps {
    productId: string;
    stock: number;
    isAvailable: boolean;
    // Guest cart er jonno product details
    productName: string;
    productPrice: number;
    productDiscountPrice?: number | null;
    productImages: string[];
}

export interface CartItem {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        discountPrice?: number | null;
        images: string[];
        stock: number;
    };
}

export interface CartData {
    id: string;
    items: CartItem[];
}

export type ActionResponse<T = unknown> = {
    success: boolean;
    data?: T;
    message?: string;
    count?: number;
};

export interface CreateOrderPayload {
    shippingAddress: string;
    customerName?: string;
    phone: string;
    paymentMethod?: string;
}

export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        name: string;
        images: string[];
        category: string;
    };
}

export interface Order {
    id: string;
    customerName: string;
    shippingAddress: string;
    phone: string;
    totalPrice: number;
    paymentMethod: string;
    orderStatus: string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}
