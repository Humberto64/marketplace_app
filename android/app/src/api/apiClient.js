// android/app/src/api/apiClient.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { refreshTokenRequest } from './authApi';
import { resetToAuth } from '../navigation/navigationRef';
export const baseURL = 'https://marketplace-bakend-production.up.railway.app/api';
const apiClient = axios.create({
    baseURL,
    timeout: 10000,
});

// ====== REQUEST INTERCEPTOR: adjuntar token ======
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            console.log('Error leyendo token de AsyncStorage', e);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ====== RESPONSE INTERCEPTOR: refresh + logout ======
let isRefreshing = false;
let pendingQueue = [];

// Para reintentar las peticiones que llegaron mientras refrescábamos
const processQueue = (error, newToken = null) => {
    pendingQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(newToken);
        }
    });
    pendingQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error?.response?.status;
        const originalRequest = error.config;

        // Si no es 401 o ya reintentamos, lo dejamos pasar
        if (status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

            // Si ni siquiera hay refreshToken -> logout directo
            if (!storedRefreshToken) {
                await AsyncStorage.multiRemove([
                    'token',
                    'refreshToken',
                    'authuserId',
                    'email',
                    'firstname',
                    'lastname',
                    'role',
                ]);
                resetToAuth();
                return Promise.reject(error);
            }

            // Si ya hay un refresh en curso, ponemos esta request en cola
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pendingQueue.push({
                        resolve: (newToken) => {
                            if (!newToken) {
                                reject(error);
                            } else {
                                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                                resolve(apiClient(originalRequest));
                            }
                        },
                        reject,
                    });
                });
            }

            isRefreshing = true;

            // 👉 Llamamos al endpoint /auth/refresh/token (sin apiClient)
            const refreshResponse = await refreshTokenRequest(storedRefreshToken);
            const newToken = refreshResponse.data.token;
            const newRefreshToken = refreshResponse.data.refreshToken || storedRefreshToken;

            // Guardar tokens nuevos
            await AsyncStorage.multiSet([
                ['token', newToken],
                ['refreshToken', newRefreshToken],
            ]);

            // Actualizar default header de apiClient
            apiClient.defaults.headers.Authorization = `Bearer ${newToken}`;

            // Resolver todas las requests que estaban esperando
            processQueue(null, newToken);
            isRefreshing = false;

            // Repetir la request original ahora con token nuevo
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
        } catch (refreshError) {
            console.log('Error refrescando token', refreshError?.response?.data || refreshError);

            processQueue(refreshError, null);
            isRefreshing = false;

            // Falló el refresh: cerramos sesión
            await AsyncStorage.multiRemove([
                'token',
                'refreshToken',
                'authuserId',
                'email',
                'firstname',
                'lastname',
                'role',
            ]);

            resetToAuth();
            return Promise.reject(refreshError);
        }
    }
);

export default apiClient;
