// src/mockdata/productStocks.ts
// Per-variant stock + price, mirroring the `product_stocks` seed. Not every
// product has all 15 variants: some are missing sizes/colors, some variants are
// out of stock (stock = 0), and XL/XXL cost more than S/M/L. Combos referenced
// by the cart/order mocks are always kept (see PROTECTED).

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

const SIZE_RANK: Record<Size, number> = { S: 1, M: 2, L: 3, XL: 4, XXL: 5 };
const COLOR_RANK: Record<Color, number> = { Red: 1, Green: 2, Blue: 3 };

// Variants referenced by the cart/order mocks must always exist, otherwise
// getStockId() throws when those modules load.
const PROTECTED = new Set<string>([
    // cart items
    "25:M:Blue", "20:L:Green", "26:XL:Red", "5:M:Blue", "18:M:Blue", "8:XXL:Blue",
    // order items
    "1:L:Blue", "2:M:Green", "5:L:Green", "11:XL:Blue", "3:S:Green", "4:S:Blue",
    "7:M:Red", "16:M:Blue", "30:XL:Green", "18:L:Green", "15:S:Green", "23:S:Red",
    "15:L:Green", "21:S:Blue", "20:L:Red",
]);

const variantKey = (productId: number, size: Size, color: Color) =>
    `${productId}:${size}:${color}`;

// Some products intentionally drop a size and/or a color, for variety.
function isMissing(productId: number, size: Size, color: Color): boolean {
    if (size === "XXL" && productId % 3 === 0) return true;
    if (size === "XL" && productId % 5 === 0) return true;
    if (color === "Red" && productId % 4 === 0) return true;
    if (color === "Blue" && productId % 7 === 0) return true;
    return false;
}

// S/M/L share the base price; XL and XXL cost more.
const sizeSurcharge = (size: Size): number =>
    size === "XL" ? 15 : size === "XXL" ? 30 : 0;

const mockProductStocks: ProductStock[] = [];
let stockId = 1;

for (let productId = 1; productId <= 30; productId++) {
    const [originalPrice, promotionPrice] = PRICES[productId];
    for (const size of SIZES) {
        for (const color of COLORS) {
            if (
                isMissing(productId, size, color) &&
                !PROTECTED.has(variantKey(productId, size, color))
            ) {
                continue;
            }

            const surcharge = sizeSurcharge(size);
            const rankSum = SIZE_RANK[size] + COLOR_RANK[color];
            const stock =
                (productId * 5 + rankSum) % 9 === 0
                    ? 0
                    : 10 + ((productId * 7 + rankSum) % 40);

            mockProductStocks.push({
                id: stockId++,
                productId,
                size,
                color,
                originalPrice: originalPrice + surcharge,
                ...(promotionPrice !== null
                    ? { promotionPrice: promotionPrice + surcharge }
                    : {}),
                stock,
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
