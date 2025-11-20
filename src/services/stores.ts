// src/services/stores.ts
import api from "./api";

export interface CreateStoreDto {
  name: string;
}

export const storeService = {
  async createStore(data: CreateStoreDto) {
    const res = await api.post("/stores", data);
    return res.data; // la tienda creada
  },
};
