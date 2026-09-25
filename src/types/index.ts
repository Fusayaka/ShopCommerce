export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type Color = 'Red' | 'Green' | 'Blue' | 'Rainbow' | 'Black' | 'White' | 'Grey';
export type OrderStatus = 'cart' | 'completed' | 'checkout';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Product {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    image?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Comment {
    id: number;
    productId: string;
    userId: string;
    name?: string;
    avatar?: string;
    content: string;
    rating: number;
    created_at?: string;
    updated_at?: string;
}

export interface OrderItem {
    productId: string;
    
    title?: string;
    image?: string;
    
    size: Size;
    color: Color;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    created_at?: string;
    updated_at?: string;
}

export interface OrderSummary {
    id: string;
    userId: string;
    items: OrderItem[];
    status: OrderStatus;
    
    subtotal: number;
    discount: number;
    deliveryFee: number;
    total: number;
    
    promoCode?: string;
    created_at?: string;
    updated_at?: string;
}