// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";

import api from "../services/api";
import { Product } from "../types";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 50) / 2;

export default function HomeScreen() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.items || []);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      {/* Imagen */}
      <Image
        source={{
          uri:
            item.mainImage ||
            item.images?.[0] ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmiqR_gB1aE6SmGpJvgdi6j6MZYtLpcSittA&s",
        }}
        style={styles.image}
      />

      {/* Nombre */}
      <Text style={styles.title} numberOfLines={1}>
        {item.name}
      </Text>

      {/* Precio */}
      <Text style={styles.price}>{item.price.toFixed(2)} MRU</Text>

      {/* Botón ver detalles → traducido */}
      <Text style={styles.link}>{t("home.seeDetails")}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t("home.title")} 🛍️</Text>

      {/* Si no hay productos */}
      {products.length === 0 && (
        <Text style={styles.empty}>{t("home.empty")}</Text>
      )}

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(p) => p.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ gap: 10 }}
        contentContainerStyle={{ gap: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// -------------------
// 🎨 ESTILOS
// -------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 35,
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  empty: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    color: "#666",
  },

  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 130,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#eee",
  },

  title: {
    fontSize: 16,
    fontWeight: "500",
  },

  price: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
    marginTop: 4,
  },

  link: {
    color: "#007AFF",
    marginTop: 6,
    fontSize: 13,
    fontWeight: "500",
  },
});
