// src/navigation/MainTabs.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddProductScreen from "../screens/AddProductScreen";
import MyProductsScreen from "../screens/MyProductsScreen";
import CartScreen from "../screens/CartScreen";

import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { MainTabsParamList } from "../types/navigation";

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const isOwnerOrAdmin =
    user && (user.role === "STORE_OWNER" || user.role === "ADMIN");

  const isBuyer = user && user.role === "USER";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#eee",
          height: 60,
          paddingBottom: 5,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Cart":
              iconName = "cart";
              break;
            case "MyProducts":
              iconName = "pricetag";
              break;
            case "Messages":
              iconName = "chatbubbles";
              break;
            case "Profile":
              iconName = "person";
              break;
            case "AddProduct":
              iconName = "add-circle";
              break;
          }

          const finalSize = route.name === "AddProduct" ? size + 8 : size;

          return <Ionicons name={iconName} color={color} size={finalSize} />;
        },
      })}
    >
      {/* HOME – todos los roles */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t("tabs.home"),
        }}
      />

      {/* CART – solo usuarios compradores (ROLE: USER) */}
      {isBuyer && (
        <Tab.Screen
          name="Cart"
          // TODO: crea CartScreen y cámbialo aquí
          component={CartScreen}
          options={{
            title: t("tabs.cart"),
          }}
        />
      )}

      {/* MY PRODUCTS – solo STORE_OWNER / ADMIN */}
      {isOwnerOrAdmin && (
        <Tab.Screen
          name="MyProducts"
          component={MyProductsScreen}
          options={{
            title: t("tabs.myProducts"),
          }}
        />
      )}

      {/* ADD PRODUCT – solo STORE_OWNER / ADMIN */}
      {isOwnerOrAdmin && (
        <Tab.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{
            tabBarLabel: "",
            title: t("tabs.add"),
          }}
        />
      )}

      {/* MESSAGES – todos */}
      <Tab.Screen
        name="Messages"
        component={ChatScreen}
        options={{
          title: t("tabs.messages"),
        }}
      />

      {/* PROFILE – todos */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t("tabs.profile"),
        }}
      />
    </Tab.Navigator>
  );
}
