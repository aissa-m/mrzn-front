// src/hooks/useAuth.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../services/auth";
import type { LoginDto, TokenResponse, User, Store } from "../types"; // ajusta la ruta si hace falta
import api from "../services/api";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  selectedStore: Store | null;
  initializing: boolean; // mientras carga desde AsyncStorage
  loading: boolean; // mientras hace login/logout
  isStoreOwner: boolean;
  login: (data: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  setSelectedStore: (store: Store | null) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedStore, setSelectedStoreState] = useState<Store | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  // 🔁 Cargar sesión desde AsyncStorage al arrancar la app
  useEffect(() => {
    const loadSession = async () => {
      try {
        const [storedToken, storedUserStr, storedStoreStr] = await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("user"),
          AsyncStorage.getItem("selectedStore"),
        ]);

        if (storedToken && storedUserStr) {
          const parsedUser: User = JSON.parse(storedUserStr);
          setToken(storedToken);
          setUser(parsedUser);

          if (storedStoreStr) {
            // si ya había una tienda seleccionada, la usamos
            const parsedStore: Store = JSON.parse(storedStoreStr);
            setSelectedStoreState(parsedStore);
          } else if (
            parsedUser.role === "STORE_OWNER" &&
            parsedUser.stores &&
            parsedUser.stores.length > 0
          ) {
            // si no hay selectedStore guardada pero el owner tiene tiendas,
            // seleccionamos la primera por defecto
            const firstStore = parsedUser.stores[0];
            setSelectedStoreState(firstStore);
            await AsyncStorage.setItem(
              "selectedStore",
              JSON.stringify(firstStore)
            );
          }
        }
      } catch (error) {
        console.error("Error loading session", error);
      } finally {
        setInitializing(false);
      }
    };

    loadSession();
  }, []);

  // 👉 setter que también persiste en AsyncStorage
  const setSelectedStore = async (store: Store | null) => {
    setSelectedStoreState(store);
    if (store) {
      await AsyncStorage.setItem("selectedStore", JSON.stringify(store));
    } else {
      await AsyncStorage.removeItem("selectedStore");
    }
  };

  const login = async (data: LoginDto) => {
    setLoading(true);
    try {
      const res: TokenResponse = await authService.login(data);
      const { access_token, user } = res;

      // aunque authService ya guarda token y user en AsyncStorage,
      // aquí actualizamos el estado en memoria
      setToken(access_token);
      setUser(user);

      // lógica de tienda por defecto si es STORE_OWNER
      if (
        user.role === "STORE_OWNER" &&
        user.stores &&
        user.stores.length > 0
      ) {
        console.log(user.stores);
        const firstStore = user.stores[0];
        await setSelectedStore(firstStore);
      } else {
        await setSelectedStore(null);
      }
    } catch (error) {
      console.error("Error logging in", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
      setSelectedStoreState(null);
      await AsyncStorage.removeItem("selectedStore");
    } catch (error) {
      console.error("Error logging out", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get("/users/me");
      const newUser = res.data;

      setUser(newUser);
      await AsyncStorage.setItem("user", JSON.stringify(newUser));

      // actualizar selectedStore si tiene tiendas nuevas
      if (
        newUser.role === "STORE_OWNER" &&
        newUser.stores &&
        newUser.stores.length > 0
      ) {
        // si la tienda seleccionada ya existe → mantenla
        const current = selectedStore;
        const stillExists = newUser.stores.find((s: { id: number | undefined; }) => s.id === current?.id);

        if (stillExists) {
          setSelectedStore(stillExists);
        } else {
          // si la tienda seleccionada ya no existe o está vacía → primera
          await setSelectedStore(newUser.stores[0]);
        }
      }
    } catch (err) {
      console.error("Error refreshing user", err);
    }
  };

  const isStoreOwner = user?.role === "STORE_OWNER";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        selectedStore,
        initializing,
        loading,
        isStoreOwner,
        login,
        logout,
        setSelectedStore,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
