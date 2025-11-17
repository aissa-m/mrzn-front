// src/navigation/MainTabs.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddProductScreen from "../screens/AddProductScreen";

import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { MainTabsParamList } from "../types/navigation";

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const canCreateProduct =
    user && (user.role === "STORE_OWNER" || user.role === "ADMIN");

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

          // Hacemos el + un poco más grande
          const finalSize = route.name === "AddProduct" ? size + 8 : size;

          return <Ionicons name={iconName} color={color} size={finalSize} />;
        },
      })}
    >
      {/* HOME */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t("tabs.home"),
        }}
      />

      {/* ADD PRODUCT - solo OWNER / ADMIN */}
      {canCreateProduct && (
        <Tab.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{
            // No label debajo del icono
            tabBarLabel: "",
            title: t("tabs.add"),
          }}
        />
      )}

      {/* MESSAGES */}
      <Tab.Screen
        name="Messages"
        component={ChatScreen}
        options={{
          title: t("tabs.messages"),
        }}
      />

      {/* PROFILE */}
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
