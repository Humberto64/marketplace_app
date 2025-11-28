// android/app/src/api/productsApi.js
import apiClient from './apiClient';

export const getProducts = async () => {
    const res = await apiClient.get('/products');
    return res.data?.data || [];
};

export const getProduct = async (id) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data?.data;
};

export const createProduct = async (payload) => {
    const res = await apiClient.post('/products', payload);
    return res.data?.data;
};

export const updateProduct = async (id, payload) => {
    const res = await apiClient.put(`/products/${id}`, payload);
    return res.data?.data;
};

export const deleteProduct = async (id) => {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data; // tu backend devuelve String
};
