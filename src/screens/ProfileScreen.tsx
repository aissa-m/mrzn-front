import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image, // 🆕
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // 🆕
import { useNavigation } from "@react-navigation/native";
import api from "../services/api";
import { API_BASE } from "@env"; // 🆕 añade esta línea

import { authService } from "../services/auth";
import { styles } from "../styles/profileStyles";
import type { User } from "../types";

function roleLabel(role?: User["role"]) {
  switch (role) {
    case "STORE_OWNER":
      return "Vendeur";
    case "ADMIN":
      return "Admin";
    case "USER":
    default:
      return "Acheteur";
  }
}

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await api.get<User>("/auth/me");
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

  const initials =
    (user?.name || "")
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "MZ";

  const getAvatarUri = () => {
    if (!user?.avatarUrl) return null;
    // user.avatarUrl viene como "/uploads/avatars/xxxxx.jpg"
    return `${API_BASE.replace(/\/$/, "")}${user.avatarUrl}`;
  };

  // 🆕 cambiar avatar
  const handleChangeAvatar = async () => {
    try {
      // 1. pedir permisos + abrir galería
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission refusée", "Autorisez l’accès à la galerie.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (result.canceled) return;

      const image = result.assets[0];

      // 2. preparar FormData
      const formData = new FormData();
      formData.append("avatar", {
        uri: image.uri,
        name: "avatar.jpg",
        type: "image/jpeg",
      } as any);

      // 3. enviar al backend
      const res = await api.post<User>("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 4. actualizar usuario en el estado
      setUser(res.data);
      Alert.alert("Succès", "Photo de profil mise à jour.");
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de mettre à jour l'avatar.");
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
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
        <Text style={{ marginTop: 10 }}>Chargement du profil…</Text>
      </View>
    );
  }

  const avatarUri = getAvatarUri();

  return (
    <View style={styles.container}>
      {/* Header / Avatar */}
      <View style={styles.header}>
        {/* 🆕 pulsar en el avatar para cambiar foto */}
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
            {user?.name || "Utilisateur Maurizone"}
          </Text>
          <Text style={styles.email}>{user?.email || "—"}</Text>
          <Text style={styles.role}>{roleLabel(user?.role)}</Text>
        </View>
      </View>

      {/* Cards / actions */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => Alert.alert("Bientôt disponible", "Édition du profil")}
        >
          <Text style={styles.itemText}>Modifier le profil</Text>
          <Text style={styles.itemHint}>Nom, e-mail…</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => Alert.alert("Bientôt disponible", "Préférences")}
        >
          <Text style={styles.itemText}>Préférences</Text>
          <Text style={styles.itemHint}>Langue, notifications…</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
