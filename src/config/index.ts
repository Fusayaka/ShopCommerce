const env = import.meta.env;

export const CONFIG = {
    API_URL: env.VITE_API_URL || 'http://localhost:3000',

    API_TIMEOUT: Number(env.VITE_API_TIMEOUT) || 10000,

    APP_NAME: env.VITE_APP_NAME || 'ShopCommerce',

    DEFAULT_PAGE_SIZE: Number(env.VITE_DEFAULT_PAGE_SIZE) || 10,
    
    SEARCH_LIMIT:     Number(env.VITE_SEARCH_LIMIT) || 10,
} as const;
