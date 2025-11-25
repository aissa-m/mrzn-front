// src/navigation/AppNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import MainTabs from "./MainTabs";

// Productos
import ProductDetailScreen from "../screens/ProductDetailScreen";
import MyProductsScreen from "../screens/MyProductsScreen";
import AddProductScreen from "../screens/AddProductScreen";

// Chat
import ChatsListScreen from "../screens/ChatsListScreen";
import ChatScreen from "../screens/ChatScreen";

// Stores
import CreateStoreScreen from "../screens/CreateStoreScreen";

import SplashScreen from "../screens/SplashScreen"; // 👈 NUEVO
import { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator initialRouteName="Splash">
      {/* Splash */}
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />

      {/* Auth */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: t("auth.registerTitle") }}
      />

      {/* Área principal */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />

      {/* Productos */}
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: t("productDetail.title") }}
      />
      <Stack.Screen
        name="MyProducts"
        component={MyProductsScreen}
        options={{ title: t("myProducts.title") }}
      />

      {/* Chat */}
      <Stack.Screen
        name="ChatsList"
        component={ChatsListScreen}
        options={{ title: t("chat.listTitle") }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params?.title || t("chat.listTitle"),
        })}
      />

      {/* AddProduct / Store */}
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ title: t("addProduct.title") }}
      />

      <Stack.Screen
        name="CreateStore"
        component={CreateStoreScreen}
        options={{ title: "Create store" }}
      />
    </Stack.Navigator>
  );
}
