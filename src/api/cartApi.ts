import axiosClient from "./axiosClient";
import type { CartItem, Size, Color } from "@/types";


export interface CartItemResponse {
    id: number;
    stockId: number;
    quantity: number;
    stock: {
        productId: number;
        size: Size;
        color: Color;
        originalPrice: number;
        promotionPrice?: number | null;
        product: {
            title: string;
            image?: string | null;
        };
    };
}

export interface CartResponse {
    id: number;
    userId: number;
    items: CartItemResponse[];
}

export const cartApi = {
    getCart(userId: number) {
        return axiosClient.get<CartResponse, CartResponse>(`/carts`, {
            params: { userId },
        });
    },

    updateQuantity(userId: number, data: { stockId: number; quantity: number }) {
        return axiosClient.patch<CartItem, CartItem>(`/carts/items`, data, {
            params: { userId },
        });
    },

    addToCart(userId: number, data: { stockId: number; quantity: number }) {
        return axiosClient.post<CartItem, CartItem>(`/carts/items`, data, {
            params: { userId },
        });
    },

    removeItem(userId: number, stockId: number) {
        return axiosClient.delete<CartItem, CartItem>(`/carts/items`, {
            params: { userId },
            data: { stockId },
        });
    },
};
