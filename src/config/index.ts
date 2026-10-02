const env = import.meta.env;

export const CONFIG = {
    API_URL: env.VITE_API_URL || 'http://localhost:3000',

    API_TIMEOUT: Number(env.VITE_API_TIMEOUT) || 10000,

    DEFAULT_PAGE_SIZE: Number(env.VITE_DEFAULT_PAGE_SIZE) || 6,

    APP_NAME: env.VITE_APP_NAME || 'ShopCommerce',
} as const;
