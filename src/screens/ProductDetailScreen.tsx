// src/screens/ProductDetailScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { Product, RootStackParamList } from "../types";
import { chatService } from "../services/chat";

const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = width * 0.8;
const PLACEHOLDER =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmiqR_gB1aE6SmGpJvgdi6j6MZYtLpcSittA&s";

export default function ProductDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, "ProductDetail">>();
  const { t } = useTranslation();

  const { product } = route.params;

  const allImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.mainImage || PLACEHOLDER];

  const [currentImage, setCurrentImage] = useState(
    product.mainImage || allImages[0] || PLACEHOLDER
  );

  const handleChat = async () => {
    try {
      const convo = await chatService.openConversation(
        (product as any).ownerId, // TODO: pon ownerId en el tipo Product cuando lo tengas
        product.storeId
      );

      // 👇 usamos la firma del stack: Chat: { chatId: string; title?: string }
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
            {allImages.map((img, idx) => (
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
          <Text style={styles.price}>
            {product.price.toFixed(2)} MRU
          </Text>

          {product.description ? (
            <Text style={styles.desc}>{product.description}</Text>
          ) : (
            <Text style={styles.descMuted}>
              {t("productDetail.noDescription")}
            </Text>
          )}
        </View>

        {/* Info vendedor (placeholder por ahora) */}
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

      {/* CTA fijo abajo, tipo Vinted/Wallapop */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
          <Text style={styles.chatButtonText}>
            {t("productDetail.contactSeller")} 💬
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 🎨 ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContent: {
    padding: 16,
  },
  mainImage: {
    width: "100%",
    height: IMAGE_HEIGHT,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
  thumbRow: {
    marginTop: 8,
  },
  thumb: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "#e5e7eb",
  },
  thumbActive: {
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  infoBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#16a34a",
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: "#374151",
    marginTop: 4,
  },
  descMuted: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  sellerBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
  },
  sellerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  sellerHint: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: "#ffffffee",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  chatButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  chatButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
