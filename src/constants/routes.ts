export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    PRODUCTS: '/products',
    PRODUCT_DETAILS: (id: number | string) => `/product/${id}`,
    CART: '/cart',
    CHECKOUT: '/checkout',
    ORDERS: '/orders',
    ORDER_DETAIL: (id: number | string) => `/order/${id}`,              // Not implement yet
    PROFILE: '/profile',
    DASHBOARD: '/dashboard',
} as const;