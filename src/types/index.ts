export interface Paginated<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type Color = 'Red' | 'Green' | 'Blue';
export type OrderStatus = 'pending' | 'checkout' | 'completed' | 'cancelled';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    contact?: string;
    address?: string;
    description?: string;
    updatedAt?: string;
}

export interface Authen {
    id: number;
    userId: number;
    username?: string;
    email: string;
}

export interface Product {
    id: number;
    title: string;
    description?: string;
    rating: number;
    numReviews: number;
    image?: string;
    updatedAt?: string;
    stocks?: ProductStock[];
}
export interface ProductStock {
    id: number;
    productId: number;
    size: Size;
    color: Color;
    originalPrice: number;
    promotionPrice?: number;
    stock: number;
    product?: Product;
}

export interface Comment {
    id: number;
    productId: number;
    userId: number;
    content: string;
    rating: number;
    updatedAt?: string;
    user?: {
        id: number;
        name: string;
        avatar?: string;
    };
}

export interface CartItem {
    id: number;
    cartId: number;
    stockId: number;
    quantity: number;
    updatedAt?: string;
    stock?: ProductStock;
}

export interface Cart {
    id: number;
    userId: number;
    items: CartItem[];
    updatedAt?: string;
}

// Flattened cart line for display, derived from the API's nested cart item
// (item -> stock -> product).
export interface CartLineItem {
    id: number;        // cart item id
    stockId: number;   // variant id, used for update / remove
    productId: number; // for linking to the product page
    title: string;
    image?: string;
    size: Size;
    color: Color;
    unitPrice: number;
    quantity: number;
}

export interface OrderItem {
    id: number;
    orderId: number;
    stockId?: number;
    title: string;
    image?: string;
    quantity: number;
    priceAtPurchase: number;
    totalPrice: number;
    updatedAt?: string;
}

export interface Order {
    id: number;
    userId: number;
    items: OrderItem[];
    status: OrderStatus;

    subtotal: number;
    discount: number;
    deliveryFee: number;
    total: number;

    promoCode?: string;
    createdAt?: string;
    updatedAt?: string;
}