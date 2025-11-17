// src/services/products.ts
import api from './api';

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

    formData.append('name', data.name);
    formData.append('description', data.description ?? '');
    formData.append('price', data.price.toString());
    formData.append('storeId', data.storeId.toString());

    data.images.forEach((img) => {
      formData.append('images', {
        uri: img.uri,
        name: img.name,
        type: img.type,
      } as any); // 👈 RN exige el cast a any
    });

    const res = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  },
};
