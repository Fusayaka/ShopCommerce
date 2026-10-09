import type { Comment } from "@/types";
import axiosClient from "./axiosClient";

export interface CreateCommentPayload {
    productId: number;
    userId: number;
    content: string;
    rating: number;
}

export const commentApi = {
    getAllComment() {
        return axiosClient.get<Comment[], Comment[]>(`/comments`);
    },
    
    getProductComment(productId: number) {
        return axiosClient.get<Comment[], Comment[]>(`/comments`, {
            params: { productId },
        });
    },

    createComment(data: CreateCommentPayload) {
        return axiosClient.post<Comment, Comment>(`/comments`, data);
    },
};
