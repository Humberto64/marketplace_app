// android/app/src/api/authApi.js
import apiClient from './apiClient';

// POST /api/auth/login
export const loginRequest = ({ email, password }) => {
    return apiClient.post('/auth/login', { email, password });
};

// POST /api/auth/register
export const registerRequest = ({ firstName, lastName, email, password }) => {
    return apiClient.post('/auth/register', {
        firstName,
        lastName,
        email,
        password,
    });
};

// GET /api/auth/me
export const getMe = () => {
    return apiClient.get('/auth/me');
};

// POST /api/auth/refresh
export const refreshTokenRequest = (refreshToken) =>
    axios.post(`${BASE_URL}/auth/refresh/token`, { refreshToken });
