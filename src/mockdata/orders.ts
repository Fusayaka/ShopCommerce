// src/mockdata/orders.ts

import { type OrderSummary } from "@/types";

const mockOrders: OrderSummary[] = [
    {
        id: "ord-01",
        userId: 1000,
        status: "completed",
        items: [
            { orderItemId: "oi-01", productId: 1, title: "Owen Blue T-Shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", size: "L", color: "Blue", quantity: 2, unitPrice: 120 }
        ],
        subtotal: 240,
        discount: 20,
        deliveryFee: 15,
        total: 235,
        promoCode: "SALE20"
    },
    {
        id: "ord-02",
        userId: 1000,
        status: "completed",
        items: [
            { orderItemId: "oi-02", productId: 2, title: "Lyn White T-Shirt", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80", size: "M", color: "White", quantity: 1, unitPrice: 144 }
        ],
        subtotal: 144,
        discount: 0,
        deliveryFee: 15,
        total: 159
    },
    {
        id: "ord-03",
        userId: 1000,
        status: "completed",
        items: [
            { orderItemId: "oi-03", productId: 5, title: "Proclub White T-Shirt", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80", size: "L", color: "White", quantity: 1, unitPrice: 200 }
        ],
        subtotal: 200,
        discount: 0,
        deliveryFee: 0,
        total: 200,
        promoCode: "FREESHIP"
    },
    {
        id: "ord-04",
        userId: 1000,
        status: "checkout",
        items: [
            { orderItemId: "oi-04", productId: 11, title: "Classic Navy T-Shirt", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80", size: "XL", color: "Blue", quantity: 3, unitPrice: 125 }
        ],
        subtotal: 375,
        discount: 30,
        deliveryFee: 15,
        total: 360,
        promoCode: "VIP30"
    },
    {
        id: "ord-05",
        userId: 1000,
        status: "cart",
        items: [
            { orderItemId: "oi-05", productId: 25, title: "Simple Black T-Shirt", image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80", size: "M", color: "Black", quantity: 1, unitPrice: 140 }
        ],
        subtotal: 140,
        discount: 0,
        deliveryFee: 15,
        total: 155
    },

    {
        id: "ord-06",
        userId: 1001,
        status: "completed",
        items: [
            { orderItemId: "oi-06", productId: 3, title: "AC White T-Shirt", image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80", size: "S", color: "White", quantity: 1, unitPrice: 180 },
            { orderItemId: "oi-07", productId: 4, title: "SC Black T-Shirt", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80", size: "S", color: "Black", quantity: 1, unitPrice: 136 }
        ],
        subtotal: 316,
        discount: 50,
        deliveryFee: 15,
        total: 281,
        promoCode: "HALFOFF"
    },
    {
        id: "ord-07",
        userId: 1001,
        status: "completed",
        items: [
            { orderItemId: "oi-08", productId: 7, title: "Essential Gray T-Shirt", image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80", size: "M", color: "Grey", quantity: 2, unitPrice: 135 }
        ],
        subtotal: 270,
        discount: 0,
        deliveryFee: 15,
        total: 285
    },
    {
        id: "ord-08",
        userId: 1001,
        status: "checkout",
        items: [
            { orderItemId: "oi-09", productId: 16, title: "Street Black T-Shirt", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80", size: "M", color: "Black", quantity: 1, unitPrice: 175 }
        ],
        subtotal: 175,
        discount: 0,
        deliveryFee: 15,
        total: 190
    },
    {
        id: "ord-09",
        userId: 1001,
        status: "cart",
        items: [
            { orderItemId: "oi-10", productId: 20, title: "Modern Green T-Shirt", image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80", size: "L", color: "Green", quantity: 1, unitPrice: 185 }
        ],
        subtotal: 185,
        discount: 10,
        deliveryFee: 15,
        total: 190,
        promoCode: "NEW10"
    },

    {
        id: "ord-10",
        userId: 1002,
        status: "completed",
        items: [
            { orderItemId: "oi-11", productId: 30, title: "Comfort Fit White T-Shirt", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80", size: "XL", color: "White", quantity: 2, unitPrice: 150 }
        ],
        subtotal: 300,
        discount: 0,
        deliveryFee: 0,
        total: 300
    },
    {
        id: "ord-11",
        userId: 1002,
        status: "completed",
        items: [
            { orderItemId: "oi-12", productId: 18, title: "Premium Blue T-Shirt", image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80", size: "L", color: "White", quantity: 1, unitPrice: 220 }
        ],
        subtotal: 220,
        discount: 0,
        deliveryFee: 15,
        total: 235
    },
    {
        id: "ord-12",
        userId: 1002,
        status: "cart",
        items: [
            { orderItemId: "oi-13", productId: 26, title: "Classic Olive T-Shirt", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80", size: "XL", color: "White", quantity: 1, unitPrice: 180 }
        ],
        subtotal: 180,
        discount: 0,
        deliveryFee: 15,
        total: 195
    },

    {
        id: "ord-13",
        userId: 1003,
        status: "completed",
        items: [
            { orderItemId: "oi-14", productId: 15, title: "Soft Cotton White T-Shirt", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80", size: "S", color: "White", quantity: 1, unitPrice: 145 }
        ],
        subtotal: 145,
        discount: 0,
        deliveryFee: 15,
        total: 160
    },
    {
        id: "ord-14",
        userId: 1003,
        status: "completed",
        items: [
            { orderItemId: "oi-15", productId: 23, title: "Sporty Blue T-Shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", size: "S", color: "Red", quantity: 2, unitPrice: 155 }
        ],
        subtotal: 310,
        discount: 30,
        deliveryFee: 0,
        total: 280,
        promoCode: "SAVE30"
    },
    {
        id: "ord-15",
        userId: 1003,
        status: "cart",
        items: [
            { orderItemId: "oi-16", productId: 5, title: "Proclub White T-Shirt", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80", size: "M", color: "Black", quantity: 1, unitPrice: 200 }
        ],
        subtotal: 200,
        discount: 0,
        deliveryFee: 15,
        total: 215
    },

    {
        id: "ord-16",
        userId: 1004,
        status: "completed",
        items: [
            { orderItemId: "oi-17", productId: 15, title: "Soft Cotton White T-Shirt", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80", size: "L", color: "White", quantity: 1, unitPrice: 145 }
        ],
        subtotal: 145,
        discount: 0,
        deliveryFee: 15,
        total: 160
    },
    {
        id: "ord-17",
        userId: 1004,
        status: "cart",
        items: [
            { orderItemId: "oi-18", productId: 18, title: "Premium Blue T-Shirt", image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80", size: "M", color: "Blue", quantity: 1, unitPrice: 220 }
        ],
        subtotal: 220,
        discount: 0,
        deliveryFee: 15,
        total: 235
    },

    {
        id: "ord-18",
        userId: 1005,
        status: "completed",
        items: [
            { orderItemId: "oi-19", productId: 21, title: "Heavy Cotton Black T-Shirt", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80", size: "S", color: "Black", quantity: 1, unitPrice: 195 }
        ],
        subtotal: 195,
        discount: 0,
        deliveryFee: 15,
        total: 210
    },

    {
        id: "ord-19",
        userId: 1006,
        status: "cart",
        items: [
            { orderItemId: "oi-20", productId: 8, title: "Urban Green T-Shirt", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80", size: "XXL", color: "Blue", quantity: 2, unitPrice: 165 }
        ],
        subtotal: 330,
        discount: 30,
        deliveryFee: 0,
        total: 300,
        promoCode: "BULK30"
    },

    {
        id: "ord-20",
        userId: 1007,
        status: "completed",
        items: [
            { orderItemId: "oi-21", productId: 20, title: "Modern Green T-Shirt", image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80", size: "L", color: "Grey", quantity: 1, unitPrice: 185 }
        ],
        subtotal: 185,
        discount: 0,
        deliveryFee: 15,
        total: 200
    }
];

export default mockOrders;

export const mockOrderItems = mockOrders.flatMap(order => order.items);
