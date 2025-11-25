// src/types/navigation.ts

import { Product } from "./models";

// Stack raíz (AppNavigator)
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  CreateStore: undefined;

  ProductDetail: { productId?: number; product?: Product };

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
  Cart: undefined; // 👈 nueva
  MyProducts: undefined; // 👈 nueva
  AddProduct: undefined;
  Messages: undefined;
  Profile: undefined;
  // CreateStore: undefined;
};
