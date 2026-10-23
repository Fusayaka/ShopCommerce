import type { User } from "@/types";
import axiosClient from "./axiosClient";

export interface UpdateProfilePayload {
    name?: string;
    email?: string;
    avatar?: string;
    contact?: string;
    address?: string;
    description?: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export const userApi = {
    getMe() {
        return axiosClient.get<User, User>(`/users/me`);
    },

    updateProfile(data: UpdateProfilePayload) {
        return axiosClient.patch<User, User>(`/users/me`, data);
    },

    changePassword(data: ChangePasswordPayload) {
        return axiosClient.patch<User, User>(`/users/me`, data);
    },

    uploadAvatar(file: File) {
        const form = new FormData();
        form.append('file', file);
        // axios sets the multipart boundary automatically for FormData bodies.
        return axiosClient.post<{ url: string }, { url: string }>(`/users/me/avatar`, form);
    },
};
