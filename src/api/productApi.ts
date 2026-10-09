import type { Color, Paginated, Product, ProductStock, Size } from "@/types";
import axiosClient from "./axiosClient";

export interface GetStockQuery {
    size: Size;
    color: Color;
}

export interface GetProductsQuery {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    hasDiscount?: boolean;
    rating?: number;
    page?: number;
    limit?: number;
}

export interface PriceRange {
    min: number;
    max: number;
}

export const productApi = {
    getProducts(params?: GetProductsQuery) {
        return axiosClient.get<Paginated<Product>, Paginated<Product>>(`/products`, {
            params,
        });
    },

    getRoundRange() {
        return axiosClient.get<PriceRange, PriceRange>(`/products/price`);
    },

    getRelatedProducts(productId: number) {
        return axiosClient.get<Product[], Product[]>(`/products/${productId}/related`);
    },

    getProduct(productId: number) {
        return axiosClient.get<Product, Product>(`/products/${productId}`);
    },

    getProductStock(productId: number, params: GetStockQuery) {
        return axiosClient.get<ProductStock | null, ProductStock | null>(
            `/products/${productId}/stock`,
            { params },
        );
    },
};
