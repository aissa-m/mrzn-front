// 🎨 ESTILO
import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = width * 0.8;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContent: {
    padding: 16,
  },
  mainImage: {
    width: "100%",
    height: IMAGE_HEIGHT,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
  thumbRow: {
    marginTop: 8,
  },
  thumb: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "#e5e7eb",
  },
  thumbActive: {
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  infoBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#16a34a",
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: "#374151",
    marginTop: 4,
  },
  descMuted: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  sellerBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
  },
  sellerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  sellerHint: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: "#ffffffee",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  chatButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  chatButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
