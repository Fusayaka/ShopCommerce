import { useEffect, useState } from 'react';
import type { User } from '@/types';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';
const AUTH_EVENT = 'auth-changed';

export function getToken(): string | null {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
}

export function getUser(): User | null {
    try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? (JSON.parse(raw) as User) : null;
    } catch {
        return null;
    }
}

export function isLoggedIn(): boolean {
    return !!getToken();
}

function notify() {
    window.dispatchEvent(new Event(AUTH_EVENT));
}

export function setAuth(token: string, user?: User | null) {
    try {
        localStorage.setItem(TOKEN_KEY, token);
        if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
        else localStorage.removeItem(USER_KEY);
    } catch {
        /* localStorage can be blocked */
    }
    notify();
}

/** Cập nhật mỗi access token (giữ nguyên thông tin user) - dùng khi refresh. */
export function setToken(token: string) {
    try {
        localStorage.setItem(TOKEN_KEY, token);
    } catch {
        /* Skipped */
    }
    notify();
}

export function clearAuth() {
    try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    } catch {
        /* Skipped */
    }
    notify();
}

export function onAuthChange(handler: () => void): () => void {
    window.addEventListener(AUTH_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
        window.removeEventListener(AUTH_EVENT, handler);
        window.removeEventListener('storage', handler);
    };
}


export type AuthState =
    | { loggedIn: true; user: User }
    | { loggedIn: false; user: null };

function readAuthState(): AuthState {
    const user = getUser();
    return getToken() && user
        ? { loggedIn: true, user }
        : { loggedIn: false, user: null };
}

export function useAuth(): AuthState {
    const [state, setState] = useState<AuthState>(readAuthState);

    useEffect(() => {
        return onAuthChange(() => setState(readAuthState()));
    }, []);

    return state;
}
