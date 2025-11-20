// src/screens/CreateStoreScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../styles/createStoreStyles";
import { storeService } from "../services/stores";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

export default function CreateStoreScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { isStoreOwner, refreshUser, user } = useAuth();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert(
        t("common.error"),
        t("store.fillName", "Veuillez saisir un nom.")
      );
      return;
    }

    try {
      setLoading(true);
      await storeService.createStore({ name });
      await refreshUser();

      setName("");
      setShowModal(false);

      Alert.alert(
        t("store.createdTitle", "Boutique créée"),
        t("store.createdMessage", "Votre boutique a été créée avec succès.")
      );
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        t("common.error"),
        error?.response?.data?.message ||
          t("store.createError", "Une erreur s'est produite.")
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isStoreOwner) {
    return (
      <View style={styles.container}>
        <Text>
          {t(
            "store.onlyOwner",
            "Seuls les vendeurs peuvent créer des boutiques."
          )}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t("store.manageTitle", "Gérer vos boutiques")}
      </Text>
      <Text style={styles.subtitle}>
        {t(
          "store.manageSubtitle",
          "Consultez vos boutiques et ajoutez-en de nouvelles."
        )}
      </Text>

      {/* Lista de tiendas */}
      <ScrollView
        style={{ marginTop: 16, width: "100%" }}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {Array.isArray(user?.stores) && user.stores.length > 0 ? (
          user.stores.map((store) => (
            <View key={store.id} style={styles.storeItemCard}>
              <Text style={styles.storeItemName}>{store.name}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.itemHint}>
            {t("store.noStores", "Vous n’avez pas encore de boutique.")}
          </Text>
        )}
      </ScrollView>

      {/* Botón para abrir modal de creación */}
      <TouchableOpacity
        style={[styles.button, styles.fullWidthButton]}
        onPress={() => setShowModal(true)}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {t("store.openCreateModal", "Ajouter une boutique")}
        </Text>
      </TouchableOpacity>

      {/* Modal para crear nueva tienda */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => !loading && setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.title}>
              {t("store.createTitle", "Créer une boutique")}
            </Text>
            <Text style={styles.subtitle}>
              {t(
                "store.createSubtitle",
                "Ajoutez une nouvelle boutique à votre compte."
              )}
            </Text>

            <TextInput
              style={styles.input}
              placeholder={t("store.namePlaceholder", "Nom de la boutique")}
              value={name}
              onChangeText={setName}
              editable={!loading}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => !loading && setShowModal(false)}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>
                  {t("common.cancel", "Annuler")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.modalPrimaryButton,
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleCreate}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {t("store.createButton", "Créer la boutique")}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
