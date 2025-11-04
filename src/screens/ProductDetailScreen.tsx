import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Product } from '../types';
import { chatService } from '../services/chat';

type RouteParams = { params: { product: Product } };

export default function ProductDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const { product } = route.params;

  const handleChat = async () => {
    try {
      const convo = await chatService.openConversation(product.ownerId, product.storeId);
      navigation.navigate('Chat', { conversationId: convo.id });
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erreur', err.response?.data?.message || 'Impossible d’ouvrir la conversation.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price} MRU</Text>
      <Text style={styles.desc}>{product.description}</Text>

      <TouchableOpacity style={styles.button} onPress={handleChat}>
        <Text style={styles.buttonText}>Contacter le vendeur 💬</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  price: { fontSize: 20, color: '#007AFF', marginBottom: 10 },
  desc: { fontSize: 16, color: '#555', marginBottom: 30 },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
