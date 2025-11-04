import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../services/api';
import { Product } from '../types';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        console.log('Fetched products:', res.data);
        setProducts(res.data.items); // ✅ usa el array "items"
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };
    fetchProducts();
  }, []);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.price}>
        {parseFloat(item.price?.d?.[0] || 0).toFixed(2)} MRU
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Produits récents 🛍️</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(p) => p.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: '600' },
  price: { fontSize: 16, color: '#007AFF' },
});
