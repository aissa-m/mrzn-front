// src/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

const resources = {
  fr: {
    translation: {
      // -----------------------
      // Textos comunes / global
      // -----------------------
      common: {
        loading: "Chargement…",
        error: "Une erreur s’est produite",
        retry: "Réessayer",
        cancel: "Annuler",
        confirm: "Confirmer",
      },

      // -----------------------
      // Tabs principales
      // -----------------------
      tabs: {
        home: "Accueil",
        messages: "Messages",
        add: "Ajouter",
        profile: "Profil",
      },

      // -----------------------
      // Auth (Login / Register)
      // -----------------------
      auth: {
        loginTitle: "Connexion",
        registerTitle: "Inscription",
        email: "E-mail",
        password: "Mot de passe",
        name: "Nom complet",
        loginButton: "Se connecter",
        registerButton: "Créer un compte",
        noAccount: "Pas de compte ?",
        haveAccount: "Vous avez déjà un compte ?",
        goRegister: "Créer un compte",
        goLogin: "Se connecter",
        fillAllFields: "Veuillez remplir tous les champs.",
        registerSuccess: "Compte créé avec succès !",
        genericError: "Une erreur s'est produite.",
      },

      // -----------------------
      // Home
      // -----------------------
      home: {
        title: "Produits",
        empty: "Aucun produit disponible pour le moment.",
        seeDetails: "Voir les détails",
      },

      // -----------------------
      // Détail produit
      // -----------------------
      productDetail: {
        title: "Détails du produit",
        price: "Prix",
        description: "Description",
        store: "Boutique",
        noDescription: "Aucune description fournie par le vendeur.",
        sellerLabel: "Vendeur",
        sellerHint:
          "Voir le profil de la boutique et ses autres produits bientôt 👀",
        contactSeller: "Contacter le vendeur",
      },

      // -----------------------
      // Ajouter un produit
      // -----------------------
      addProduct: {
        title: "Ajouter un produit",
        namePlaceholder: "Nom du produit",
        descriptionPlaceholder: "Description",
        pricePlaceholder: "Prix (ex: 9.99)",
        selectImages: "Sélectionner des images",
        selectImagesWithCount: "Sélectionner des images ({{count}})",
        createBtn: "Créer le produit",
        success: "Produit créé avec succès.",
        errorCreate: "Impossible de créer le produit.",
        needNamePrice: "Nom et prix sont obligatoires.",
        needImage: "Veuillez sélectionner au moins une image.",
      },

      // -----------------------
      // Profil
      // -----------------------
      profile: {
        loading: "Chargement du profil…",
        defaultName: "Utilisateur Maurizone",
        editProfile: "Modifier le profil",
        editProfileHint: "Nom, e-mail…",
        preferences: "Préférences",
        preferencesHint: "Langue, notifications…",
        myProducts: "Mes produits",
        myProductsHint: "Voir, modifier et supprimer vos produits",
        logout: "Se déconnecter",
        language: "Langue",
        languageHint: "Choisissez la langue de l'application",
        lang_fr: "Français",
        lang_en: "Anglais",
        lang_ar: "Arabe",
      },

      roles: {
        buyer: "Acheteur",
        seller: "Vendeur",
        admin: "Admin",
      },

      avatar: {
        permissionDenied: "Permission refusée",
        permissionExplain: "Autorisez l’accès à la galerie.",
        updated: "Photo de profil mise à jour.",
        updateError: "Impossible de mettre à jour l'avatar.",
      },

      // -----------------------
      // Mes produits
      // -----------------------
      myProducts: {
        title: "Mes produits",
        info: "Cette section sera disponible lorsque votre boutique sera créée.",
      },

      // -----------------------
      // Chat / Messages
      // -----------------------
      chat: {
        listTitle: "Mes messages",
        emptyConversations: "Vous n’avez pas encore de conversations.",
        openChat: "Ouvrir le chat",
        send: "Envoyer",
        errorOpen: "Impossible d’ouvrir la conversation pour le moment.",
      },
    },
  },

  // ================= ENGLISH =================
  en: {
    translation: {
      common: {
        loading: "Loading…",
        error: "An error occurred",
        retry: "Retry",
        cancel: "Cancel",
        confirm: "Confirm",
      },
      tabs: {
        home: "Home",
        messages: "Messages",
        add: "Add",
        profile: "Profile",
      },
      auth: {
        loginTitle: "Login",
        registerTitle: "Sign up",
        email: "Email",
        password: "Password",
        name: "Full name",
        loginButton: "Log in",
        registerButton: "Create account",
        noAccount: "Don't have an account?",

        haveAccount: "Already have an account?",
        goRegister: "Create an account",
        goLogin: "Log in",

        fillAllFields: "Please fill in all fields.",
        registerSuccess: "Account created successfully!",
        genericError: "An error occurred.",
      },
      home: {
        title: "Products",
        empty: "No products available yet.",
        seeDetails: "See details",
      },
      productDetail: {
        title: "Product details",
        price: "Price",
        description: "Description",
        store: "Store",
        noDescription: "No description provided by the seller.",
        sellerLabel: "Seller",
        sellerHint: "Store profile and other products available soon 👀",
        contactSeller: "Contact the seller",
      },
      addProduct: {
        title: "Add a product",
        namePlaceholder: "Product name",
        descriptionPlaceholder: "Description",
        pricePlaceholder: "Price (e.g. 9.99)",
        selectImages: "Select images",
        selectImagesWithCount: "Select images ({{count}})",
        createBtn: "Create product",
        success: "Product created successfully.",
        errorCreate: "Could not create product.",
        needNamePrice: "Name and price are required.",
        needImage: "Please select at least one image.",
      },
      profile: {
        loading: "Loading profile…",
        defaultName: "Maurizone user",
        editProfile: "Edit profile",
        editProfileHint: "Name, e-mail…",
        preferences: "Preferences",
        preferencesHint: "Language, notifications…",
        myProducts: "My products",
        myProductsHint: "View, edit and delete your products",
        logout: "Log out",
        language: "Language",
        languageHint: "Choose the app language",
        lang_fr: "French",
        lang_en: "English",
        lang_ar: "Arabic",
      },
      roles: {
        buyer: "Buyer",
        seller: "Seller",
        admin: "Admin",
      },
      avatar: {
        permissionDenied: "Permission denied",
        permissionExplain: "Allow gallery access.",
        updated: "Profile photo updated.",
        updateError: "Could not update avatar.",
      },
      myProducts: {
        title: "My products",
        info: "This section will be available once your store has been created.",
      },
      chat: {
        listTitle: "My messages",
        emptyConversations: "You don't have any conversations yet.",
        openChat: "Open chat",
        send: "Send",
        errorOpen: "Unable to open the conversation at the moment.",
      },
    },
  },

  // ================= ARABIC (básico) =================
  ar: {
    translation: {
      common: {
        loading: "جاري التحميل…",
        error: "حدث خطأ",
        retry: "إعادة المحاولة",
        cancel: "إلغاء",
        confirm: "تأكيد",
      },
      tabs: {
        home: "الرئيسية",
        messages: "الرسائل",
        add: "إضافة",
        profile: "الملف الشخصي",
      },
      auth: {
        loginTitle: "تسجيل الدخول",
        registerTitle: "إنشاء حساب",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        name: "الاسم الكامل",
        loginButton: "تسجيل الدخول",
        registerButton: "إنشاء حساب",
        noAccount: "ليس لديك حساب؟",
        
        haveAccount: "هل لديك حساب بالفعل؟",
        goRegister: "إنشاء حساب جديد",
        goLogin: "تسجيل الدخول",

        fillAllFields: "يرجى تعبئة جميع الحقول.",
        registerSuccess: "تم إنشاء الحساب بنجاح!",
        genericError: "حدث خطأ ما.",
      },
      home: {
        title: "المنتجات",
        empty: "لا توجد منتجات حالياً.",
        seeDetails: "عرض التفاصيل",
      },
      productDetail: {
        title: "تفاصيل المنتج",
        price: "السعر",
        description: "الوصف",
        store: "المتجر",
        noDescription: "لا توجد أي معلومات قدمها البائع عن هذا المنتج.",
        sellerLabel: "البائع",
        sellerHint: "سيتم عرض ملف المتجر ومنتجاته الأخرى قريبًا 👀",
        contactSeller: "التواصل مع البائع",
      },
      addProduct: {
        title: "إضافة منتج",
        namePlaceholder: "اسم المنتج",
        descriptionPlaceholder: "الوصف",
        pricePlaceholder: "السعر (مثال: 9.99)",
        selectImages: "اختيار الصور",
        selectImagesWithCount: "اختيار الصور ({{count}})",
        createBtn: "إنشاء المنتج",
        success: "تم إنشاء المنتج بنجاح.",
        errorCreate: "تعذر إنشاء المنتج.",
        needNamePrice: "الاسم والسعر مطلوبان.",
        needImage: "الرجاء اختيار صورة واحدة على الأقل.",
      },
      profile: {
        loading: "جاري تحميل الملف الشخصي…",
        defaultName: "مستخدم Maurizone",
        editProfile: "تعديل الملف الشخصي",
        editProfileHint: "الاسم، البريد الإلكتروني…",
        preferences: "الإعدادات",
        preferencesHint: "اللغة، الإشعارات…",
        myProducts: "منتجاتي",
        myProductsHint: "عرض، تعديل وحذف منتجاتك",
        logout: "تسجيل الخروج",
        language: "اللغة",
        languageHint: "اختر لغة التطبيق",
        lang_fr: "الفرنسية",
        lang_en: "الإنجليزية",
        lang_ar: "العربية",
      },
      roles: {
        buyer: "مشتري",
        seller: "بائع",
        admin: "مدير",
      },
      avatar: {
        permissionDenied: "تم رفض الإذن",
        permissionExplain: "اسمح بالوصول إلى المعرض.",
        updated: "تم تحديث صورة الملف الشخصي.",
        updateError: "تعذر تحديث صورة الملف الشخصي.",
      },
      myProducts: {
        title: "منتجاتي",
        info: "ستكون هذه القسم متاحاً عند إنشاء متجرك.",
      },
      chat: {
        listTitle: "رسائلي",
        emptyConversations: "لا توجد محادثات حتى الآن.",
        openChat: "فتح المحادثة",
        send: "إرسال",
        errorOpen: "تعذر فتح المحادثة في الوقت الحالي.",
      },
    },
  },
};

const deviceLang = Localization.getLocales()[0]?.languageCode || "fr";

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLang,
  fallbackLng: "fr",
  compatibilityJSON: "v4",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
