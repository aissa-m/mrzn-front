// src/types/models.ts

// ==============================
// 👤 Usuario
// ==============================
export interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "STORE_OWNER" | "ADMIN";
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
// 🎫 Respuesta auth backend
// ==============================
export interface TokenResponse {
  access_token: string;
}

// Si en el futuro devuelves también el usuario:
export interface AuthResponse extends TokenResponse {
  user?: User;
}

// ==============================
// 🏪 Producto
// ==============================
// Ajustado al tipo que mostraste en index.ts (backend Maurizone)
export type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  storeId: number;
  createdAt: string;
  updatedAt: string;
  images: string[];          // rutas relativas de imágenes
  mainImage: string | null;  // ruta de la imagen principal
};

// Si algún día cambias a objetos en vez de strings:
// export interface ProductImage {
//   id: number;
//   url: string;
// }

// ==============================
// 💬 Mensajes y conversaciones
// ==============================
export interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt?: string;
}

// Conversación tal y como puede venir de la BD (relacionada con pedidos/tienda)
export interface Conversation {
  id: number;
  storeId?: number;
  orderId?: number;
  createdAt: string;
  updatedAt: string;
}

// Resumen de conversación para UI de chats (lista de chats)
export interface ChatSummary {
  id: string;
  title: string;
  lastMessage?: string;
  lastAt?: string;  // ISO
  unread?: number;
}

// ==============================
// 🔐 Contexto de autenticación
// ==============================
export interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
}