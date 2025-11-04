// src/types/index.ts

// ==============================
// 👤 Usuario (para uso futuro)
// ==============================
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'STORE_OWNER' | 'ADMIN'; // puedes ampliar más adelante
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


export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  storeId: number;
  ownerId: number;
  owner?: { id: number; name: string };
}

export interface Conversation {
  id: number;
  storeId?: number;
  orderId?: number;
  createdAt: string;
  updatedAt: string;
}
