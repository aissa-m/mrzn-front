// src/styles/myProdsStyles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },

  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    color: "#4b5563",
  },

  listContainer: {
    paddingBottom: 40,
  },

  // GRID 2 columnas
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  productCard: {
    width: "48%", // 2 por fila con un poco de margen
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  productImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 8,
  },

  productImagePlaceholder: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },

  productImagePlaceholderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#9ca3af",
  },

  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },

  productPrice: {
    fontSize: 13,
    fontWeight: "500",
    color: "#047857",
  },
});
