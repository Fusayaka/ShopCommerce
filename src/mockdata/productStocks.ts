// src/mockdata/productStocks.ts
// Per-variant stock + price, mirroring the `product_stocks` seed:
// each product gets one row per size x color (5 sizes x 3 colors = 15 variants),
// priced from the product base-price list and with a deterministic stock count.

export type Size = "S" | "M" | "L" | "XL" | "XXL";
export type Color = "Red" | "Green" | "Blue";

export interface ProductStock {
    id: number;
    productId: number;
    size: Size;
    color: Color;
    originalPrice: number;
    promotionPrice?: number;
    stock: number;
}

const SIZES: Size[] = ["S", "M", "L", "XL", "XXL"];
const COLORS: Color[] = ["Red", "Green", "Blue"];

// productId -> [originalPrice, promotionPrice | null]
const PRICES: Record<number, [number, number | null]> = {
    1: [126, 120],
    2: [169, 144],
    3: [200, 180],
    4: [148, 136],
    5: [222, 200],
    6: [150, null],
    7: [135, null],
    8: [183, 165],
    9: [206, 175],
    10: [190, null],
    11: [140, 125],
    12: [180, 155],
    13: [130, null],
    14: [190, 165],
    15: [145, null],
    16: [200, 175],
    17: [160, null],
    18: [250, 220],
    19: [110, null],
    20: [210, 185],
    21: [220, 195],
    22: [125, null],
    23: [175, 155],
    24: [195, 170],
    25: [140, null],
    26: [205, 180],
    27: [240, 210],
    28: [135, null],
    29: [185, 165],
    30: [175, 150],
};

const mockProductStocks: ProductStock[] = [];
let stockId = 1;

for (let productId = 1; productId <= 30; productId++) {
    const [originalPrice, promotionPrice] = PRICES[productId];
    for (const size of SIZES) {
        for (const color of COLORS) {
            mockProductStocks.push({
                id: stockId++,
                productId,
                size,
                color,
                originalPrice,
                ...(promotionPrice !== null ? { promotionPrice } : {}),
                stock: 10 + ((productId * 7 + size.length + color.length) % 40),
            });
        }
    }
}

/** Resolve a variant's id by product + size + color (as the seed does via JOIN). */
export function getStockId(productId: number, size: Size, color: Color): number {
    const match = mockProductStocks.find(
        (s) => s.productId === productId && s.size === size && s.color === color,
    );
    if (!match) {
        throw new Error(`No stock variant for product ${productId} ${size}/${color}`);
    }
    return match.id;
}

export default mockProductStocks;
