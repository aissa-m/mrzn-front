// src/types/navigation.ts

import { Product } from "./models";

// Stack raíz (AppNavigator)
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;

  // Productos
  // ProductDetail: { productId: number };
  ProductDetail: { product: Product }; // 👈 importante que sea así
  MyProducts: undefined;

  // Chat
  ChatsList: undefined;
  Chat: { chatId: string; title?: string };

  // Añadir producto
  AddProduct: undefined;
  
};

// Bottom tabs (MainTabs)
export type MainTabsParamList = {
  Home: undefined;
  Cart: undefined;        // 👈 nueva
  MyProducts: undefined;  // 👈 nueva
  AddProduct: undefined;
  Messages: undefined;
  Profile: undefined;
};

