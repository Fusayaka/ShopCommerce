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

// userId được lấy từ JWT ở backend (@CurrentUser), không gửi từ client nữa.
export const cartApi = {
    getCart() {
        return axiosClient.get<CartResponse, CartResponse>(`/carts`);
    },

    updateQuantity(data: { stockId: number; quantity: number }) {
        return axiosClient.patch<CartItem, CartItem>(`/carts/items`, data);
    },

    addToCart(data: { stockId: number; quantity: number }) {
        return axiosClient.post<CartItem, CartItem>(`/carts/items`, data);
    },

    removeItem(stockId: number) {
        return axiosClient.delete<CartItem, CartItem>(`/carts/items`, {
            data: { stockId },
        });
    },
};
