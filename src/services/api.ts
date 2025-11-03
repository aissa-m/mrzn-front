// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.129:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  async (config) => {
    // Rutas que NO deben llevar Authorization
    const isAuthRoute =
      config.url?.includes('/auth/login') || config.url?.includes('/auth/register');

    if (!isAuthRoute) {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Asegúrate de inicializar headers si viene undefined
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log útil para ver el motivo exacto del 400
    console.log('API error:', error.response?.status, error.response?.data);

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
