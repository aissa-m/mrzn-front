// src/screens/ProfileScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next"; // 👈
import i18n from "../i18n";

import api from "../services/api";
import { API_BASE } from "@env";

import { authService } from "../services/auth";
import { styles } from "../styles/profileStyles";
import type { User } from "../types";

function roleLabel(role?: User["role"], t?: (k: string) => string) {
  if (!t) return "";
  switch (role) {
    case "STORE_OWNER":
      return t("roles.seller");
    case "ADMIN":
      return t("roles.admin");
    case "USER":
    default:
      return t("roles.buyer");
  }
}

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedStore, setSelectedStore] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await api.get<User>("/users/me");
        if (!mounted) return;
        setUser(res.data);
      } catch (_err) {
        const cached = await authService.getCurrentUser();
        if (!mounted) return;
        setUser(cached);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    // si ya hay user y tiene tiendas, escogemos la primera por defecto
    const stores = (user as any)?.stores || [];
    if (stores.length > 0 && !selectedStore) {
      setSelectedStore(stores[0]);
    }
  }, [user, selectedStore]);

  const initials =
    (user?.name || "")
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "MZ";

  const getAvatarUri = () => {
    if (!user?.avatarUrl) return null;
    return `${API_BASE.replace(/\/$/, "")}${user.avatarUrl}`;
  };

  // cambiar avatar
  const handleChangeAvatar = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t("avatar.permissionDenied"),
          t("avatar.permissionExplain")
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (result.canceled) return;

      const image = result.assets[0];

      const formData = new FormData();
      formData.append("avatar", {
        uri: image.uri,
        name: "avatar.jpg",
        type: "image/jpeg",
      } as any);

      const res = await api.post<User>("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      Alert.alert("Succès", t("avatar.updated"));
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", t("avatar.updateError"));
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const handleChangeLanguage = (lang: "fr" | "en" | "ar") => {
    i18n.changeLanguage(lang);
    // FUTURO: aquí podrías guardar en AsyncStorage la elección
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>{t("profile.loading")}</Text>
      </View>
    );
  }

  const avatarUri = getAvatarUri();
  const isOwnerOrAdmin = user?.role === "STORE_OWNER" || user?.role === "ADMIN";

  return (
    <View style={styles.container}>
      {/* Header / Avatar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleChangeAvatar}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.name}>
            {user?.name || t("profile.defaultName")}
          </Text>
          <Text style={styles.email}>{user?.email || "—"}</Text>
          <Text style={styles.role}>{roleLabel(user?.role, t)}</Text>
        </View>
      </View>

      {/* Cards / actions */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => Alert.alert("Bientôt disponible", "Édition du profil")}
        >
          <Text style={styles.itemText}>{t("profile.editProfile")}</Text>
          <Text style={styles.itemHint}>{t("profile.editProfileHint")}</Text>
        </TouchableOpacity>

        {/* Preferencias + selector idioma */}
        <View style={styles.item}>
          <Text style={styles.itemText}>{t("profile.preferences")}</Text>
          <Text style={styles.itemHint}>{t("profile.preferencesHint")}</Text>

          {/* Selector lenguaje simple */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 8,
              gap: 8,
            }}
          >
            <TouchableOpacity
              style={styles.langBtn}
              onPress={() => handleChangeLanguage("fr")}
            >
              <Text style={styles.langBtnText}>{t("profile.lang_fr")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.langBtn}
              onPress={() => handleChangeLanguage("en")}
            >
              <Text style={styles.langBtnText}>{t("profile.lang_en")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.langBtn}
              onPress={() => handleChangeLanguage("ar")}
            >
              <Text style={styles.langBtnText}>{t("profile.lang_ar")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mes produits -> solo OWNER / ADMIN */}
        {isOwnerOrAdmin && (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("MyProducts")}
          >
            <Text style={styles.itemText}>{t("profile.myProducts")}</Text>
            <Text style={styles.itemHint}>{t("profile.myProductsHint")}</Text>
          </TouchableOpacity>
        )}
        {/* Store management for STORE_OWNER */}
        {user?.role === "STORE_OWNER" && (
          <View style={styles.item}>
            <Text style={styles.itemText}>{t("profile.storeTitle")}</Text>

            {Array.isArray((user as any).stores) &&
            (user as any).stores.length > 0 ? (
              <>
                <Text style={styles.itemHint}>
                  {t("profile.selectedStore")} {selectedStore?.name || "—"}
                </Text>

                {(user as any).stores.map((store: any) => (
                  <TouchableOpacity
                    key={store.id}
                    style={{ marginTop: 8 }}
                    onPress={() => setSelectedStore(store)}
                  >
                    <Text
                      style={{
                        fontWeight:
                          selectedStore?.id === store.id ? "bold" : "normal",
                      }}
                    >
                      {store.name}{" "}
                      {selectedStore?.id === store.id
                        ? ` (${t("profile.storeSelected")})`
                        : ""}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <>
                <Text style={styles.itemHint}>{t("profile.noStores")}</Text>
              </>
            )}

            {/* botón siempre disponible para ir a la pantalla de gestión */}
            <TouchableOpacity
              style={{ marginTop: 12 }}
              onPress={() => navigation.navigate("CreateStore")}
            >
              <Text style={{ color: "#007AFF" }}>
                {t("store.manageTitle")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t("profile.logout")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
