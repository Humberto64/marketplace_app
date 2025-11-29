// android/app/src/api/authApi.js
import apiClient, { baseURL } from './apiClient';
import axios from 'axios';

// POST /api/auth/login
export const loginRequest = ({ email, password }) => {
    return apiClient.post('/auth/login', { email, password });
};

// POST /api/auth/register
// 👉 Acepta cualquier payload con las claves correctas
export const registerRequest = (payload) => {
    return apiClient.post('/auth/register', payload);
};

// GET /api/auth/me
export const getMe = () => apiClient.get('/auth/me');

// POST /api/auth/refresh
export const refreshTokenRequest = (refreshToken) =>
    axios.post(`${baseURL}/auth/refresh`, { refreshToken });
