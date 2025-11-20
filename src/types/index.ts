// src/types/index.ts
export * from "./navigation";
export * from "./models";
export interface TokenResponse {
  access_token: string;
  user: import("./models").User; // o simplemente User si lo reexportas
}