// src/screens/MyProductsScreen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

export default function MyProductsScreen() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("myProducts.title")}</Text>
      <Text style={styles.message}>{t("myProducts.info")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  subMessage: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
    paddingHorizontal: 20,
    marginTop: 6,
  },
});
