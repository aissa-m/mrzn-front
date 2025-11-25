// src/screens/MyProductsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { productService } from "../services/products";
import { styles } from "../styles/myProdsStyles";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { API_BASE } from "@env";

export default function MyProductsScreen() {
  const { t } = useTranslation();
  const { selectedStore, isStoreOwner } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!isStoreOwner || !selectedStore?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await productService.getProductsByStore(selectedStore.id);
        setProducts(res || []);
      } catch (e) {
        console.error("Error loading products", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [selectedStore, isStoreOwner]);

  const getImageUrl = (p: any) => {
    const firstImage = p.images?.[0];
    if (!firstImage?.url) return null;

    if (firstImage.url.startsWith("http")) return firstImage.url;
    return `${API_BASE.replace(/\/$/, "")}${firstImage.url}`;
  };

  const handleOpenProduct = (productId: number) => {
    // Reutilizamos la pantalla de detalle general
    navigation.navigate("ProductDetail", { productId /*, fromOwner: true */ });
  };

  return (
    <View style={styles.container}>
      {/* ⛔ No es owner */}
      {!isStoreOwner && (
        <View style={styles.centerBox}>
          <Text style={styles.message}>
            {t(
              "store.onlyOwner",
              "Seuls les vendeurs ont accès à cette section."
            )}
          </Text>
        </View>
      )}

      {/* ⛔ No hay tienda seleccionada */}
      {isStoreOwner && !selectedStore && (
        <View style={styles.centerBox}>
          <Text style={styles.message}>
            {t(
              "store.selectStoreFirst",
              "Veuillez choisir une boutique active."
            )}
          </Text>
        </View>
      )}

      {/* ⏳ Cargando */}
      {isStoreOwner && selectedStore && loading && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 12 }}>{t("common.loading")}</Text>
        </View>
      )}

      {/* 📭 Sin productos */}
      {isStoreOwner &&
        selectedStore &&
        !loading &&
        products.length === 0 && (
          <View style={styles.centerBox}>
            <Text style={styles.title}>{t("myProducts.title")}</Text>
            <Text style={styles.message}>
              {t("myProducts.empty", "Aucun produit dans cette boutique.")}
            </Text>
          </View>
        )}

      {/* ✅ Lista en grid 2 columnas */}
      {isStoreOwner &&
        selectedStore &&
        !loading &&
        products.length > 0 && (
          <ScrollView contentContainerStyle={styles.listContainer}>
            <Text style={styles.title}>
              {t("myProducts.title")} – {selectedStore.name}
            </Text>

            <View style={styles.grid}>
              {products.map((p) => {
                const imageUrl = getImageUrl(p);

                return (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.productCard}
                    onPress={() => handleOpenProduct(p.id)}
                    activeOpacity={0.8}
                  >
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.productImage}
                      />
                    ) : (
                      <View style={styles.productImagePlaceholder}>
                        <Text style={styles.productImagePlaceholderText}>
                          MZ
                        </Text>
                      </View>
                    )}

                    <Text style={styles.productName} numberOfLines={2}>
                      {p.name}
                    </Text>

                    <Text style={styles.productPrice}>
                      {Number(p.price)} MRU
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )}
    </View>
  );
}
