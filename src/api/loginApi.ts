import type { User } from "@/types";
import axiosClient from "./axiosClient";

export interface AuthMessage {
    message: string;
}

export interface LoginResponse {
    message: string;
    accessToken: string;
}

const withCookie = { withCredentials: true };

const authHeader = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const loginApi = {
    register(data: { name: string; email: string; password: string }) {
        return axiosClient.post<AuthMessage, AuthMessage>(`/auth/register`, data);
    },

    login(data: { email: string; password: string }) {
        return axiosClient.post<LoginResponse, LoginResponse>(`/auth/login`, data, withCookie);
    },

    refresh() {
        return axiosClient.post<{ accessToken: string }, { accessToken: string }>(`/auth/refresh`, {}, withCookie);
    },

    logout() {
        return axiosClient.post<AuthMessage, AuthMessage>(`/auth/logout`, {}, withCookie);
    },

    logoutAll() {
        return axiosClient.post<AuthMessage, AuthMessage>(`/auth/logout-all`, {}, {
            ...withCookie,
            ...authHeader(),
        });
    },

    getMe() {
        return axiosClient.get<User, User>(`/auth/me`, authHeader());
    },
};
