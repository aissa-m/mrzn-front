// src/screens/AddProductScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { productService } from "../services/products";
import { useTranslation } from "react-i18next";
import { styles } from "../styles/newProdStyles";
import { useAuth } from "../hooks/useAuth"; // 👈 NUEVO

export default function AddProductScreen() {
  const { t } = useTranslation();
  const { selectedStore, isStoreOwner } = useAuth(); // 👈 NUEVO

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<
    { uri: string; name: string; type: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Demander permissions
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Vous devez autoriser l’accès à la galerie pour sélectionner des images."
        );
      }
    })();
  }, []);

  const handlePickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.7,
      });

      if (result.canceled) return;

      const selected = result.assets.map((asset, index) => {
        const uri = asset.uri;
        const fileName = asset.fileName || `image_${Date.now()}_${index}.jpg`;
        const mimeType = asset.mimeType || "image/jpeg";

        return { uri, name: fileName, type: mimeType };
      });

      setImages(selected);
    } catch (e) {
      console.log("Erreur image picker :", e);
      Alert.alert("Erreur", "Impossible de sélectionner les images.");
    }
  };

  const handleSubmit = async () => {
    if (!name || !price) {
      Alert.alert("Erreur", t("addProduct.needNamePrice"));
      return;
    }

    if (images.length === 0) {
      Alert.alert("Erreur", t("addProduct.needImage"));
      return;
    }

    // 👇 NUEVO: comprobar tienda seleccionada
    if (!isStoreOwner || !selectedStore?.id) {
      Alert.alert(
        t("common.error"),
        t(
          "store.selectStoreFirst",
          "Veuillez d'abord choisir une boutique active."
        )
      );
      return;
    }

    try {
      setLoading(true);

      await productService.createProduct({
        name,
        description,
        price: Number(price),
        storeId: selectedStore.id, // 👈 AHORA USA LA TIENDA ACTUAL
        images,
      });

      Alert.alert("Succès", t("addProduct.success"));

      setName("");
      setDescription("");
      setPrice("");
      setImages([]);
    } catch (e: any) {
      console.log("Erreur création produit:", e.response?.data || e);
      Alert.alert(
        "Erreur",
        e.response?.data?.message || "Impossible de créer le produit."
      );
    } finally {
      setLoading(false);
    }
  };

  // 👇 NUEVO: si no es owner, mostrar mensaje
  if (!isStoreOwner) {
    return (
      <View style={styles.container}>
        <Text>
          {t(
            "store.onlyOwner",
            "Seuls les vendeurs peuvent créer des produits."
          )}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingBottom: 32 }]} // pequeño ajuste de layout
    >
      <View style={{ width: "100%", maxWidth: 500, alignSelf: "center" }}>
        <Text style={styles.title}>{t("addProduct.title")}</Text>

        {/* Info de tienda seleccionada */}
        <Text style={{ marginBottom: 12, opacity: 0.8 }}>
          {t("store.selectedStore", "Boutique sélectionnée :")}{" "}
          <Text style={{ fontWeight: "600" }}>
            {selectedStore?.name || "—"}
          </Text>
        </Text>

        <TextInput
          style={styles.input}
          placeholder={t("addProduct.namePlaceholder")}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder={t("addProduct.descriptionPlaceholder")}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder={t("addProduct.pricePlaceholder")}
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        {/* Botón seleccionar imágenes */}
        <TouchableOpacity style={styles.imageButton} onPress={handlePickImages}>
          <Text style={styles.imageButtonText}>
            {t("addProduct.selectImagesWithCount", { count: images.length })}
          </Text>
        </TouchableOpacity>

        {/* Previsualización */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.previewRow}
        >
          {images.map((img) => (
            <Image
              key={img.uri}
              source={{ uri: img.uri }}
              style={styles.previewImage}
            />
          ))}
        </ScrollView>

        {/* Botón Submit */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {t("addProduct.createBtn")}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
