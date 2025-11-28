// android/app/src/api/storesApi.js
import apiClient from './apiClient';

export const getStores = async () => {
    const res = await apiClient.get('/stores');
    return res.data?.data || [];
};

export const getStore = async (id) => {
    const res = await apiClient.get(`/stores/${id}`);
    return res.data?.data;
};

export const createStore = async (payload) => {
    const res = await apiClient.post('/stores', payload);
    return res.data?.data;
};

export const updateStore = async (id, payload) => {
    const res = await apiClient.put(`/stores/${id}`, payload);
    return res.data?.data;
};

export const deleteStore = async (id) => {
    const res = await apiClient.delete(`/stores/${id}`);
    return res.data; // backend devuelve String
};
