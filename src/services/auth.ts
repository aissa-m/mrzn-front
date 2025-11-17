// src/services/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { LoginDto, RegisterDto, TokenResponse } from "../types";

export const authService = {
  // === LOGIN ===
  async login(data: LoginDto): Promise<TokenResponse> {
    const res = await api.post<TokenResponse>("/auth/login", data);
    const { access_token } = res.data;

    // guardar token
    await AsyncStorage.setItem("token", access_token);

    // pedir datos del usuario
    const me = await api.get("/users/me");

    // guardar usuario
    await AsyncStorage.setItem("user", JSON.stringify(me.data));

    return res.data;
  },

  // === REGISTER ===
  async register(data: RegisterDto): Promise<TokenResponse> {
    const res = await api.post<TokenResponse>("/auth/register", data);
    const { access_token } = res.data;

    await AsyncStorage.setItem("token", access_token);
    const me = await api.get("/users/me");
    await AsyncStorage.setItem("user", JSON.stringify(me.data));

    return res.data;
  },
  // === LOGOUT ===
  async logout(): Promise<void> {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user"); // por compatibilidad futura
  },

  // === GET CURRENT USER (si decides guardarlo en el futuro) ===
  async getCurrentUser(): Promise<any | null> {
    const userStr = await AsyncStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // === IS AUTHENTICATED ===
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem("token");
    return !!token;
  },
};
