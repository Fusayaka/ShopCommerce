import { useEffect, useState } from 'react';
import { cartApi } from '@/api/cartApi';
import { isLoggedIn, onAuthChange } from '@/utils/auth';

const CART_EVENT = 'cart-changed';

export function notifyCartChanged() {
    window.dispatchEvent(new Event(CART_EVENT));
}

function onCartChange(handler: () => void): () => void {
    window.addEventListener(CART_EVENT, handler);
    return () => window.removeEventListener(CART_EVENT, handler);
}

export function useCartCount(): number {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let active = true;

        const refresh = async () => {
            if (!isLoggedIn()) {
                if (active) setCount(0);
                return;
            }
            try {
                const total = await cartApi.getTotalItems();
                if (active) setCount(typeof total === 'number' ? total : 0);
            } catch {
                if (active) setCount(0);
            }
        };

        refresh();
        const unsubscribeCart = onCartChange(refresh);
        const unsubscribeAuth = onAuthChange(refresh);

        return () => {
            active = false;
            unsubscribeCart();
            unsubscribeAuth();
        };
    }, []);

    return count;
}
