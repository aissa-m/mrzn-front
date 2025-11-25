// src/screens/ProductDetailScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { Product, RootStackParamList } from "../types";
import { chatService } from "../services/chat";
import { productService } from "../services/products";
import { styles } from "../styles/prodDetailStyles";
import { API_BASE } from "@env";
import { useAuth } from "../hooks/useAuth";

const PLACEHOLDER =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmiqR_gB1aE6SmGpJvgdi6j6MZYtLpcSittA&s";

export default function ProductDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, "ProductDetail">>();
  const { t } = useTranslation();
  const { user, isStoreOwner, selectedStore } = useAuth();

  const paramProduct = route.params?.product;
  const paramProductId = route.params?.productId ?? paramProduct?.id;

  const [product, setProduct] = useState<Product | null>(
    (paramProduct as Product) || null
  );
  const [allImages, setAllImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<string>(PLACEHOLDER);
  const [loading, setLoading] = useState(!paramProduct); // si viene product, cargamos más rápido

  // función para normalizar las imágenes
  const prepareImages = (data: any): string[] => {
    const urls: string[] = [];

    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      for (const img of data.images as any[]) {
        if (typeof img === "string") {
          urls.push(img);
        } else if (img?.url) {
          const url: string = img.url;
          if (url.startsWith("http")) {
            urls.push(url);
          } else {
            urls.push(`${API_BASE.replace(/\/$/, "")}${url}`);
          }
        }
      }
    }

    if (urls.length === 0 && (data as any).mainImage) {
      urls.push((data as any).mainImage);
    }

    if (urls.length === 0) {
      urls.push(PLACEHOLDER);
    }

    return urls;
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        let finalProduct: any = paramProduct || null;

        // si no viene el producto, pero sí el id → lo pedimos
        if (!finalProduct && paramProductId) {
          finalProduct = await productService.getProductById(paramProductId);
        }

        // si viene producto y además tenemos id → podemos refrescar
        if (paramProduct && paramProduct.id) {
          try {
            const fresh = await productService.getProductById(paramProduct.id);
            if (fresh) finalProduct = fresh;
          } catch {
            // si falla el refresh, nos quedamos con el paramProduct
          }
        }

        if (!mounted) return;

        if (!finalProduct) {
          setProduct(null);
          return;
        }

        setProduct(finalProduct);

        const urls = prepareImages(finalProduct);
        setAllImages(urls);
        setCurrentImage(urls[0] || PLACEHOLDER);
      } catch (err) {
        console.error("Error loading product", err);
        if (mounted) {
          Alert.alert(
            t("common.error"),
            t("productDetail.errorLoad", "Impossible de charger le produit.")
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [paramProductId, paramProduct, t]);

  const handleChat = async () => {
    if (!product) return;

    try {
      const convo = await chatService.openConversation(
        (product as any).ownerId, // TODO: añade ownerId al tipo Product cuando lo tengas
        product.storeId
      );

      navigation.navigate("Chat", {
        chatId: String(convo.id),
        title: product.name,
      });
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        t("common.error"),
        err?.response?.data?.message || t("chat.errorOpen")
      );
    }
  };

  const handleDelete = () => {
    if (!product) return;

    Alert.alert(
      t("common.confirm"),
      t(
        "myProducts.confirmDelete",
        "Voulez-vous vraiment supprimer ce produit ?"
      ),
      [
        {
          text: t("common.cancel", "Annuler"),
          style: "cancel",
        },
        {
          text: t("myProducts.delete", "Supprimer"),
          style: "destructive",
          onPress: async () => {
            try {
              await productService.deleteProduct(product.id);
              Alert.alert(
                t("myProducts.deletedTitle", "Produit supprimé"),
                t(
                  "myProducts.deletedMessage",
                  "Le produit a été supprimé avec succès."
                )
              );
              navigation.goBack();
            } catch (err) {
              console.error(err);
              Alert.alert(
                t("common.error"),
                t(
                  "myProducts.deleteError",
                  "Impossible de supprimer le produit."
                )
              );
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    // aquí luego podemos navegar a una pantalla de edición
    Alert.alert("TODO", "Édition du produit à implémenter.");
  };

  const getPriceText = () => {
    if (!product) return "";
    const raw: any = (product as any).price;
    let n: number | null = null;

    if (typeof raw === "number") {
      n = raw;
    } else if (raw && typeof raw === "object" && typeof raw.toNumber === "function") {
      n = raw.toNumber();
    } else {
      const maybe = Number(raw);
      if (!isNaN(maybe)) n = maybe;
    }

    return n !== null ? `${n.toFixed(2)} MRU` : "";
  };

  const canManage =
    isStoreOwner &&
    product &&
    selectedStore &&
    selectedStore.id === product.storeId;

  if (loading) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.name}>{t("common.loading")}</Text>
        </ScrollView>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.name}>
            {t("productDetail.errorLoad", "Produit introuvable.")}
          </Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Imagen principal */}
        <Image
          source={{ uri: currentImage || PLACEHOLDER }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        {/* Miniaturas si hay varias imágenes */}
        {allImages.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbRow}
          >
            {allImages.map((img: string, idx: number) => (
              <TouchableOpacity key={idx} onPress={() => setCurrentImage(img)}>
                <Image
                  source={{ uri: img }}
                  style={[
                    styles.thumb,
                    img === currentImage && styles.thumbActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Info producto */}
        <View style={styles.infoBox}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{getPriceText()}</Text>

          {product.description ? (
            <Text style={styles.desc}>{product.description}</Text>
          ) : (
            <Text style={styles.descMuted}>
              {t("productDetail.noDescription")}
            </Text>
          )}
        </View>

        {/* Info vendedor (simple por ahora) */}
        <View style={styles.sellerBox}>
          <Text style={styles.sellerLabel}>
            {t("productDetail.sellerLabel")}
          </Text>
          <Text style={styles.sellerName}>Boutique #{product.storeId}</Text>
          <Text style={styles.sellerHint}>
            {t("productDetail.sellerHint")}
          </Text>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Footer: acciones owner + chat */}
      <View style={styles.footer}>
        {canManage && (
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              marginBottom: 8,
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={[styles.chatButton, { backgroundColor: "#111827", flex: 1 }]}
              onPress={handleEdit}
            >
              <Text style={styles.chatButtonText}>
                {t("myProducts.edit", "Modifier")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.chatButton, { backgroundColor: "#b91c1c", flex: 1 }]}
              onPress={handleDelete}
            >
              <Text style={styles.chatButtonText}>
                {t("myProducts.delete", "Supprimer")}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
          <Text style={styles.chatButtonText}>
            {t("productDetail.contactSeller")} 💬
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
