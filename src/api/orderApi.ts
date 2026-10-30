import axiosClient from "./axiosClient";
import { type Order, type OrderStatus, type PaymentMethod } from "@/types";

export interface CreateOrderDto {
  paymentMethod: PaymentMethod;
  promoCode?: string | undefined;
  deliveryFee?: number;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
}

export const orderApi = {
  createOrder(data: CreateOrderDto) {
    return axiosClient.post<Order, Order>(`/orders`, data);
  },

  getUserOrders() {
    return axiosClient.get<Order[], Order[]>(`/orders`);
  },

  getOrderById(orderId: number) {
    return axiosClient.get<Order, Order>(`/orders/${orderId}`);
  },

  updateOrder(orderId: number, data: UpdateOrderDto) {
    return axiosClient.patch<Order, Order>(`/orders/${orderId}`, data);
  },
};