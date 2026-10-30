import axiosClient from "./axiosClient";

export interface ValidatePromoResponse {
  isValid: boolean;
  message: string;
  discount: number;
}

export const promoApi = {
    getPromoCodes() {
        return axiosClient.get<{ code: string }, { code: string }>(`/promos`);
    },

    validateCode(code: string, subtotal: number){
        return axiosClient.post<ValidatePromoResponse, ValidatePromoResponse>(`/promos/validate`, {code, subtotal});
    }
}