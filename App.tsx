// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { AuthProvider } from "./src/hooks/useAuth";
import { CartProvider } from "./src/hooks/useCart";
import AppNavigator from "./src/navigation/AppNavigator";
import "./src/i18n";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <CartProvider>
            {/* 👇 Esto aplica el margen seguro top/left/right a TODA la app */}
            <SafeAreaView
              style={{ flex: 1 }}
              edges={["top", "left", "right"]}
            >
              <AppNavigator />
            </SafeAreaView>
          </CartProvider>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
