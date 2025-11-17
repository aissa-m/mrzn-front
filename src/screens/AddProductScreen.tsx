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
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { productService } from "../services/products";
import { useTranslation } from "react-i18next";

export default function AddProductScreen() {
  const { t } = useTranslation();
  // ⚠️ ocultamos el storeId al usuario (de momento fijo)
  const STORE_ID = 1;

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

    try {
      setLoading(true);

      await productService.createProduct({
        name,
        description,
        price: Number(price),
        storeId: STORE_ID,
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t("addProduct.title")}</Text>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#fff",
    flexGrow: 1,
    marginTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  imageButton: {
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  imageButtonText: {
    color: "#333",
  },
  previewRow: {
    marginBottom: 16,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
