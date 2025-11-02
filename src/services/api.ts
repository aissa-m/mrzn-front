// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔧 CAMBIA ESTA IP por la IP de tu computadora
// Para encontrarla: ipconfig en Windows (busca IPv4)
const API_URL = 'http://192.168.1.129:3000'; // ← Cambia la X

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: añade JWT a todas las peticiones
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor: maneja errores globalmente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token inválido → logout
      await AsyncStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;