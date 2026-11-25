import axiosClient from "./axiosClient";
import { type Order, type OrderStatus, type Paginated, type PaymentMethod, type RedeliveryOrder } from "@/types";

export interface GetAllOrdersQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateOrderDto {
  paymentMethod: PaymentMethod;
  promoCode?: string | undefined;
  deliveryFee?: number;
  address?: string;
  contact?: string;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
}

export interface CreateRedeliveryDto {
  reason: string;
  note?: string;
  address?: string;
  contact?: string;
  paymentMethod?: PaymentMethod;
}

export interface UpdateRedeliveryDto {
  status?: OrderStatus;
  reason?: string;
  note?: string;
  address?: string;
  contact?: string;
  paymentMethod?: PaymentMethod;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const orderApi = {
  createOrder(data: CreateOrderDto) {
    return axiosClient.post<Order, Order>(`/orders`, data);
  },

  getUserOrders() {
    return axiosClient.get<Order[], Order[]>(`/orders/me`);
  },

  getAllOrders(params?: GetAllOrdersQuery) {
    return axiosClient.get<Paginated<Order>, Paginated<Order>>(`/orders`, {
      params,
    });
  },

  getOrderById(orderId: number) {
    return axiosClient.get<Order, Order>(`/orders/${orderId}`);
  },

  updateOrder(orderId: number, data: UpdateOrderDto) {
    return axiosClient.patch<Order, Order>(`/orders/${orderId}`, data);
  },

  createRedelivery(orderId: number, data: CreateRedeliveryDto) {
    return axiosClient.post<RedeliveryOrder, RedeliveryOrder>(
      `/orders/${orderId}/redelivery`,
      data,
    );
  },

  getOrderRedeliveries(orderId: number) {
    return axiosClient.get<ApiEnvelope<RedeliveryOrder[]>, ApiEnvelope<RedeliveryOrder[]>>(
      `/orders/${orderId}/redelivery`,
    );
  },

  getRedeliveryById(redeliveryId: number) {
    return axiosClient.get<ApiEnvelope<RedeliveryOrder>, ApiEnvelope<RedeliveryOrder>>(
      `/orders/redelivery/${redeliveryId}`,
    );
  },

  updateRedelivery(redeliveryId: number, data: UpdateRedeliveryDto) {
    return axiosClient.patch<RedeliveryOrder, RedeliveryOrder>(
      `/orders/redelivery/${redeliveryId}`,
      data,
    );
  },
};
