import type { User } from "@/types";
import axiosClient from "./axiosClient";

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export const userApi = {
    getMe() {
        return axiosClient.get<User, User>(`/users/me`);
    },

    updateProfile: async (
        data: {
            name?: string;
            email?: string;
            currentPassword?: string;
            newPassword?: string;
            contact?: string;
            address?: string;
            description?: string;
        }, 
        file?: File | null
    ) => {
        const formData = new FormData();
        
        if (data.name !== undefined) formData.append('name', data.name);
        if (data.email !== undefined) formData.append('email', data.email);
        if (data.currentPassword) formData.append('currentPassword', data.currentPassword);
        if (data.newPassword) formData.append('newPassword', data.newPassword);
        if (data.contact !== undefined) formData.append('contact', data.contact);
        if (data.address !== undefined) formData.append('address', data.address);
        if (data.description !== undefined) formData.append('description', data.description);
        if (file) formData.append('file', file);
        
        return axiosClient.patch<User, User>(`/users/me`, formData);
    },

    changePassword(data: ChangePasswordPayload) {
        return axiosClient.patch<User, User>(`/users/me`, data);
    },

};
