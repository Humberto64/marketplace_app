// android/app/src/api/orderItemsApi.js
import apiClient from './apiClient';

/**
 * La API del backend envuelve todo en ApiResponse<T>:
 * {
 *   success: true,
 *   message: "ok",
 *   data: [...],
 *   timestamp: "..."
 * }
 * Así que aquí devolvemos directamente "data".
 */

export const getOrderItems = async () => {
    const res = await apiClient.get('/orderItems');
    return res.data?.data || [];
};

export const getOrderItem = async (id) => {
    const res = await apiClient.get(`/orderItems/${id}`);
    return res.data?.data;
};

export const createOrderItem = async (payload) => {
    const res = await apiClient.post('/orderItems', payload);
    return res.data?.data;
};

export const updateOrderItem = async (id, payload) => {
    const res = await apiClient.put(`/orderItems/${id}`, payload);
    return res.data?.data;
};

export const deleteOrderItem = async (id) => {
    const res = await apiClient.delete(`/orderItems/${id}`);
    // este endpoint devuelve solo un String, sin ApiResponse
    return res.data;
};
