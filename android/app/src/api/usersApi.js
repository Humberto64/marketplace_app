// android/app/src/api/usersApi.js
import apiClient from './apiClient';

export const getUsers = async () => {
    const res = await apiClient.get('/users');
    return res.data?.data || [];
};

export const getUser = async (id) => {
    const res = await apiClient.get(`/users/${id}`);
    return res.data?.data;
};

export const createUser = async (payload) => {
    const res = await apiClient.post('/users', payload);
    return res.data?.data;
};

export const updateUser = async (id, payload) => {
    const res = await apiClient.put(`/users/${id}`, payload);
    return res.data?.data;
};

export const deleteUser = async (id) => {
    const res = await apiClient.delete(`/users/${id}`);
    return res.data; // backend devuelve String
};
