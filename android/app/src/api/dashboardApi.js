// android/app/src/api/dashboardApi.js
import apiClient from './apiClient';

/**
 * Esperamos que el backend responda algo tipo:
 * {
 *   success: true,
 *   message: "ok",
 *   data: {
 *     totalUsers: number,
 *     totalProducts: number,
 *     totalOrders: number,
 *     totalReviews: number,
 *     productsByStore: [
 *       { storeId, storeName, productCount }
 *     ]
 *   }
 * }
 *
 * Si no viene envuelto en ApiResponse, igual lo manejamos.
 */
export const getDashboardStats = async () => {
    const res = await apiClient.get('/dashboard');
    const body = res.data;
    // intentamos data.data (ApiResponse) y si no, data directo
    return body?.data ?? body;
};
