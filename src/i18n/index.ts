// src/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import { I18nManager } from "react-native";

// 👇 Importamos los JSON desde la carpeta `langs`
import fr from "./langs/fr.json";
import en from "./langs/en.json";
import ar from "./langs/ar.json";

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  ar: { translation: ar },
};

const deviceLang = Localization.getLocales()[0]?.languageCode || "fr";
const fallbackLng = "fr";

// Idiomas RTL (por ahora solo árabe)
const rtlLanguages = ["ar"];

// Aplica / desactiva RTL según el idioma
function applyRTL(lng: string) {
  const isRTL = rtlLanguages.includes(lng);

  // Solo cambiamos si hace falta
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);

    // ⚠️ IMPORTANTE:
    // Después de cambiar RTL normalmente hay que reiniciar la app
    // (por ejemplo, cerrarla y abrirla, o usar algún mecanismo de reload).
    // Aquí no lo hacemos automáticamente, pero lo puedes manejar
    // donde cambies el idioma (mostrar aviso y cerrar app, etc.).
  }
}

// Aplicar RTL según el idioma del dispositivo al inicio
applyRTL(deviceLang);

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLang,
    fallbackLng,
    compatibilityJSON: "v4",
    interpolation: {
      escapeValue: false,
    },
  });

// Cada vez que cambie de idioma, actualizamos RTL
i18n.on("languageChanged", (lng) => {
  applyRTL(lng);
});

export default i18n;
