import type { Comment } from "@/types";
import axiosClient from "./axiosClient";

export interface CreateCommentPayload {
    productId: number;
    userId: number;
    content: string;
    rating: number;
}

export interface ReviewEligibility {
    canReview: boolean;
    reason?: string;
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

    checkReviewEligibility(userId: number, productId: number) {
        return axiosClient.get<ReviewEligibility, ReviewEligibility>(`/comments/eligibility`, {
            params: { userId, productId },
        });
    },

    createComment(data: CreateCommentPayload) {
        return axiosClient.post<Comment, Comment>(`/comments`, data);
    },

    deleteComment(commentId: number) {
        return axiosClient.delete<Comment, Comment>(`/comments/${commentId}`);
    },
};
