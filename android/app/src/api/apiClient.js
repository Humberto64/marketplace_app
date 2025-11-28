// android/app/src/api/apiClient.js
import axios from 'axios';
// Si usas AsyncStorage para guardar el token:
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * ⚙️ CONFIG BASE
 * - Para emulador Android: 10.0.2.2 apunta a localhost de tu PC.
 * - Si pruebas en un celular físico, cambia por tu IP local, ej:
 *   http://192.168.0.10:8080/api
 */
const apiClient = axios.create({
    baseURL: 'http://10.0.2.2:8080/api',
    timeout: 10000,
});

// 🛡️ Interceptor para adjuntar el token JWT si existe
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('token'); // clave que usaremos en login
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

export default apiClient;
