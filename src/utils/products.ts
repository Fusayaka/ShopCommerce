import { CONFIG } from "@/config";
import type { Product } from "@/types";

export interface PriceRange {
    min: number;
    max: number;
}

// GET /products/price -> price bounds across all variants
export async function fetchPriceRange(): Promise<PriceRange> {
    const res = await fetch(`${CONFIG.API_URL}/products/price`);
    if (!res.ok) throw new Error(`Failed to load price range: ${res.status}`);
    return res.json();
}

// GET /products/:id/related -> up to 4 related products.
export async function fetchRelatedProducts(productId: number): Promise<Product[]> {
    const res = await fetch(`${CONFIG.API_URL}/products/${productId}/related`);
    if (!res.ok) throw new Error(`Failed to load related products: ${res.status}`);
    return res.json();
}
