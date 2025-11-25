// src/screens/OwnerHomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { useAuth } from "../hooks/useAuth";
import { productService } from "../services/products";
import { RootStackParamList } from "../types/navigation";
import { styles as homeStyles } from "../styles/homeStyles";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function OwnerHomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const { selectedStore } = useAuth();

  const [productCount, setProductCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [unreadChatsCount, setUnreadChatsCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!selectedStore?.id) return;

      try {
        const products = await productService.getProductsByStore(
          selectedStore.id
        );
        setProductCount(products?.length || 0);

        // TODO: cuando tengas endpoint real de orders + chats:
        // setPendingOrdersCount(...)
        // setUnreadChatsCount(...)
      } catch (e) {
        console.error("Error loading owner home data", e);
      }
    };

    load();
  }, [selectedStore?.id]);

  if (!selectedStore) {
    return (
      <View style={homeStyles.container}>
        <Text style={homeStyles.header}>
          {t("owner.noStore", "No active store selected")}
        </Text>
        <Text style={homeStyles.empty}>
          {t(
            "owner.selectStoreHint",
            "Please select a store in your profile or settings."
          )}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={homeStyles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Header tienda */}
      <Text style={homeStyles.header}>
        {t("owner.homeTitle", "Seller dashboard")} 🏪
      </Text>
      <Text style={{ marginBottom: 16, opacity: 0.8 }}>
        {t("owner.currentStore", "Current store")}:{" "}
        <Text style={{ fontWeight: "600" }}>{selectedStore.name}</Text>
      </Text>

      {/* KPIs rápidos */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 12,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 14, opacity: 0.7 }}>
            {t("owner.products", "Products")}
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "700" }}>
            {productCount}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 12,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 14, opacity: 0.7 }}>
            {t("owner.pendingOrders", "Pending orders")}
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "700" }}>
            {pendingOrdersCount}
          </Text>
        </View>
      </View>

      {/* Acciones rápidas */}
      <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
        {t("owner.quickActions", "Quick actions")}
      </Text>

      <View style={{ gap: 10, marginBottom: 24 }}>
        <TouchableOpacity
          style={homeStyles.primaryButton}
          onPress={() => navigation.navigate("AddProduct")}
        >
          <Text style={homeStyles.primaryButtonText}>
            {t("owner.addProduct", "Add new product")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={homeStyles.secondaryButton}
          onPress={() => navigation.navigate("MyProducts")}
        >
          <Text style={homeStyles.secondaryButtonText}>
            {t("owner.myProducts", "View my products")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={homeStyles.secondaryButton}
          onPress={() => navigation.navigate("ChatsList")}
        >
          <Text style={homeStyles.secondaryButtonText}>
            {t("owner.chats", "Customer chats")}
          </Text>
        </TouchableOpacity>

        {/* Más adelante: pedidos */}
        {/* <TouchableOpacity
          style={homeStyles.secondaryButton}
          onPress={() => navigation.navigate("Orders")}
        >
          <Text style={homeStyles.secondaryButtonText}>
            {t("owner.orders", "Orders")}
          </Text>
        </TouchableOpacity> */}
      </View>

      {/* Aquí más adelante: últimos chats, últimos pedidos, stats simples, etc. */}
    </ScrollView>
  );
}
