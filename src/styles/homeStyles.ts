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
});
