export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type Color = 'Red' | 'Green' | 'Blue' | 'Rainbow' | 'Black' | 'White' | 'Grey';
export type OrderStatus = 'cart' | 'completed' | 'checkout';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    description?: string;
    updated_at?: string;
}

export interface Product {
    id: number;
    title: string;
    description?: string;
    originalPrice: number;
    promotionPrice?: number;
    discount?: number;
    rating: number;
    numReviews: number;
    image?: string;
    updated_at?: string;
}

export interface Comment {
    id: number;
    productId: number;
    userId: number;
    name?: string;
    avatar?: string;
    content: string;
    rating: number;
    updated_at?: string;
}

export interface OrderItem {
    orderItemId: string;
    productId: number;

    title?: string;
    image?: string;

    size: Size;
    color: Color;
    quantity: number;
    unitPrice: number;
    updated_at?: string;
}

export interface OrderSummary {
    id: string;
    userId: number;
    items: OrderItem[];
    status: OrderStatus;

    subtotal: number;
    discount: number;
    deliveryFee: number;
    total: number;

    promoCode?: string;
    updated_at?: string;
}
