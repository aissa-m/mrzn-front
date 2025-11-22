// src/services/products.ts
import api from "./api";

export interface ProductImageInput {
  uri: string;
  name: string;
  type: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  storeId: number;
  images: ProductImageInput[];
}

export const productService = {
  async createProduct(data: CreateProductDto) {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description ?? "");
    formData.append("price", data.price.toString());
    formData.append("storeId", data.storeId.toString());

    data.images.forEach((img) => {
      formData.append("images", {
        uri: img.uri,
        name: img.name,
        type: img.type,
      } as any);
    });

    const res = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  // ✅ alineado con @Get('by-store')
  getProductsByStore: async (storeId: number) => {
    const res = await api.get("/products/by-store", {
      params: { storeId },
    });
    return res.data;
  },

  getProductById: async (id: number) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  deleteProduct: async (id: number) => {
    await api.delete(`/products/${id}`);
  },
};
