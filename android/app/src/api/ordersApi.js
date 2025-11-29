// android/app/src/api/ordersApi.js
import apiClient from './apiClient';

// GET /orders
export const getOrders = async () => {
    const res = await apiClient.get('/orders');
    return res.data?.data || [];
};

// GET /orders/{id}
export const getOrder = async (id) => {
    const res = await apiClient.get(`/orders/${id}`);
    return res.data?.data;
};

// POST /orders
export const createOrder = async (payload) => {
    const res = await apiClient.post('/orders', payload);
    return res.data?.data;
};

// PUT /orders/{id}
export const updateOrder = async (id, payload) => {
    const res = await apiClient.put(`/orders/${id}`, payload);
    return res.data?.data;
};

// DELETE /orders/{id}
export const deleteOrder = async (id) => {
    const res = await apiClient.delete(`/orders/${id}`);
    return res.data; // tu backend devuelve solo un String
};
