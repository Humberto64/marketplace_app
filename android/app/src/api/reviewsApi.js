// android/app/src/api/reviewsApi.js
import apiClient from './apiClient';

export const getReviews = async () => {
    const res = await apiClient.get('/reviews');
    return res.data?.data || [];
};

export const getReview = async (id) => {
    const res = await apiClient.get(`/reviews/${id}`);
    return res.data?.data;
};

export const createReview = async (payload) => {
    const res = await apiClient.post('/reviews', payload);
    return res.data?.data;
};

export const updateReview = async (id, payload) => {
    const res = await apiClient.put(`/reviews/${id}`, payload);
    return res.data?.data;
};

export const deleteReview = async (id) => {
    const res = await apiClient.delete(`/reviews/${id}`);
    return res.data; // backend devuelve String
};
