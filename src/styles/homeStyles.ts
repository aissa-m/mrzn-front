import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 50) / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  empty: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    color: "#666",
  },

  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 130,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#eee",
  },

  title: {
    fontSize: 16,
    fontWeight: "500",
  },

  price: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
    marginTop: 4,
  },

  link: {
    color: "#007AFF",
    marginTop: 6,
    fontSize: 13,
    fontWeight: "500",
  },
  // en src/styles/homeStyles.ts
  primaryButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  secondaryButtonText: {
    color: "#333",
    fontWeight: "500",
    fontSize: 15,
  },
});
