// src/screens/HomeScreen.tsx
import React from "react";
import { useAuth } from "../hooks/useAuth";
import OwnerHome from "./OwnerHomeScreen";
import CustomerHome from "./CustomerHomeScreen";

export default function HomeScreen() {
  const { isStoreOwner } = useAuth();

  if (isStoreOwner) {
    return <OwnerHome />;
  }

  return <CustomerHome />;
}
