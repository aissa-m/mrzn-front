// src/screens/RegisterScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { authService } from "../services/auth";
import { styles } from "../styles/loginStyles";
import { RootStackParamList } from "../types/navigation";
import { useTranslation } from "react-i18next";
import Logo from "../../assets/logo_n.png";

export default function RegisterScreen() {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert(
        t("common.error"),
        t("auth.fillAllFields", "Veuillez remplir tous les champs.")
      );
      return;
    }

    try {
      setLoading(true);
      await authService.register({ name, email, password });

      Alert.alert(
        t("auth.registerTitle"),
        t("auth.registerSuccess", "Compte créé avec succès !")
      );

      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (error: any) {
      Alert.alert(
        t("common.error"),
        error?.response?.data?.message ||
          t("auth.genericError", "Une erreur s'est produite.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image source={Logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>{t("auth.registerTitle")} 🛒</Text>
        <Text style={styles.subtitle}>{t("auth.registerSubtitle")}</Text>

        <TextInput
          style={styles.input}
          placeholder={t("auth.name")}
          value={name}
          onChangeText={setName}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder={t("auth.email")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder={t("auth.password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t("auth.registerButton")}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>
            {t("auth.haveAccount")} {t("auth.goLogin")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
