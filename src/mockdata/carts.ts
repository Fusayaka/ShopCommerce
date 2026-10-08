// src/mockdata/carts.ts
// Mirrors the `carts` + `cart_items` seed. Cart items now reference a product
// variant via stockId (resolved from product/size/color).

import { getStockId, type Size, type Color } from "./productStocks";

export interface CartItem {
    id: number;
    cartId: number;
    stockId: number;
    quantity: number;
}

export interface Cart {
    id: number;
    userId: number;
    items: CartItem[];
}

// [cartId, userId, [productId, size, color, quantity][]]
const RAW_CARTS: [number, number, [number, Size, Color, number][]][] = [
    [1, 1000, [[25, "M", "Blue", 1]]],
    [2, 1001, [[20, "L", "Green", 1]]],
    [3, 1002, [[26, "XL", "Red", 1]]],
    [4, 1003, [[5, "M", "Blue", 1]]],
    [5, 1004, [[18, "M", "Blue", 1]]],
    [6, 1006, [[8, "XXL", "Blue", 2]]],
];

let cartItemId = 1;

const mockCarts: Cart[] = RAW_CARTS.map(([id, userId, rows]) => ({
    id,
    userId,
    items: rows.map(([productId, size, color, quantity]) => ({
        id: cartItemId++,
        cartId: id,
        stockId: getStockId(productId, size, color),
        quantity,
    })),
}));

export default mockCarts;

export const mockCartItems = mockCarts.flatMap((cart) => cart.items);
