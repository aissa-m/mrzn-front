// src/styles/createStoreStyles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f6f6f6",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
    color: "#222",
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },

  // ====== LISTA DE TIENDAS ======
  storeItemCard: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    elevation: 2,
  },

  storeItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  itemHint: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    color: "#888",
  },

  // ====== BOTÓN PRINCIPAL ======
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  fullWidthButton: {
    alignSelf: "stretch",
    marginTop: 16,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  // ====== MODAL ======
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },

  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 15,
    marginTop: 12,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },

  // secundario (cancelar)
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#e9e9e9",
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "600",
  },

  // botón de crear dentro del modal
  modalPrimaryButton: {
    marginLeft: 10,
  },
});
