// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";

import api from "../services/api";
import { Product } from "../types";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { styles } from "../styles/homeStyles";

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
