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
    sortBy?: string;
    page?: number;
    limit?: number;
}

export interface PriceRange {
    min: number;
    max: number;
}

export interface UpsertStockDto {
    size: Size;
    color: Color;
    originalPrice?: number;
    promotionPrice?: number;
    stock?: number;
}

export interface CreateProductDto {
    title: string;
    description?: string;
    image?: string;
    stocks?: UpsertStockDto[];
    rating?: number;
    numReviews?: number;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface UpdateStockDto {
    stock?: number;
    originalPrice?: number;
    promotionPrice?: number | null;
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

    uploadImage(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return axiosClient.post<{ url: string }, { url: string }>(`/products/image`, formData);
    },

    createProduct(dto: CreateProductDto) {
        return axiosClient.post<Product, Product>(`/products`, dto);
    },

    updateProduct(productId: number, dto: UpdateProductDto) {
        return axiosClient.patch<Product, Product>(`/products/${productId}`, dto);
    },

    updateProductStock(productId: number, dto: UpsertStockDto) {
        return axiosClient.post<ProductStock, ProductStock>(`/products/${productId}/stocks`, dto);
    },

    updateStock(productId: number, stockId: number, dto: UpdateStockDto) {
        return axiosClient.patch<ProductStock, ProductStock>(
            `/products/${productId}/stocks/${stockId}`,
            dto,
        );
    },

    deleteProduct(productId: number) {
        return axiosClient.delete<{ message?: string }, { message?: string }>(`/products/${productId}`);
    },

    deleteVariant(productId: number, stockId: number) {
        return axiosClient.delete<ProductStock, ProductStock>(
            `/products/${productId}/${stockId}`,
        );
    },
};
