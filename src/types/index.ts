// src/types/index.ts

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'STORE_OWNER' | 'ADMIN';
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}