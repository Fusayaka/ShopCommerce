import axiosClient from "./axiosClient";
import type { PromoCode } from "@/types";

export interface ValidatePromoResponse {
  isValid: boolean;
  message: string;
  discount: number;
}
export interface PromoPayload {
  code: string;
  discountNum: number | null;
  discountPer: number | null;
  maxDiscountNum: number | null;
  minToApply: number | null;
  expiredAt: string | null;
}

export const promoApi = {
  list() {
    return axiosClient.get<PromoCode[], PromoCode[]>(`/promos`);
  },

  create(payload: PromoPayload) {
    return axiosClient.post<PromoCode, PromoCode>(`/promos`, payload);
  },

  update(payload: PromoPayload) {
    return axiosClient.patch<PromoCode, PromoCode>(`/promos`, payload);
  },

  remove(code: string) {
    return axiosClient.delete(`/promos/${encodeURIComponent(code)}`);
  },

  validateCode(code: string, subtotal: number) {
    return axiosClient.post<ValidatePromoResponse, ValidatePromoResponse>(`/promos/validate`, { code, subtotal });
  },
};
