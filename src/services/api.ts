// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, API_BASE } from '@env';   // ⬅️ vienen del .env

/**
 * API_URL  → http://192.168.1.129:3000/api
 * API_BASE → http://192.168.1.129:3000
 */

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

/* ----------------------------- REQUESTS ----------------------------- */
api.interceptors.request.use(
  async (config) => {
    const isAuthRoute =
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/register');

    if (!isAuthRoute) {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ----------------------------- RESPONSES ----------------------------- */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('API error:', error.response?.status, error.response?.data);

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }

    return Promise.reject(error);
  }
);

export const API_BASE_URL = API_BASE;
export const API_URL_API = API_URL;

export default api;