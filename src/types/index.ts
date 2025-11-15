// src/types/index.ts

// ==============================
// 👤 Usuario (para uso futuro)
// ==============================
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'STORE_OWNER' | 'ADMIN';
  avatarUrl?: string | null;
}

// ==============================
// 🔐 Login / Register DTOs
// ==============================
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

// ==============================
// 🎫 Respuesta del backend (actual)
// ==============================
export interface TokenResponse {
  access_token: string;
}

// ⚙️ Si en el futuro devuelves también el usuario:
export interface AuthResponse extends TokenResponse {
  user?: User;
}

// ==============================
// 🏪 Producto
// ==============================
export type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  storeId: number;
  createdAt: string;
  updatedAt: string;
  images: string[];
  mainImage: string | null;
};

export interface Conversation {
  id: number;
  storeId?: number;
  orderId?: number;
  createdAt: string;
  updatedAt: string;
}
