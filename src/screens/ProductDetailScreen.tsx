import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Product } from '../types';
import { chatService } from '../services/chat';

type RootStackParamList = {
  ProductDetail: { product: Product };
};

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.8;
const PLACEHOLDER =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmiqR_gB1aE6SmGpJvgdi6j6MZYtLpcSittA&s';

export default function ProductDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'ProductDetail'>>();
  const { product } = route.params;

  const allImages = product.images && product.images.length > 0
    ? product.images
    : [product.mainImage || PLACEHOLDER];

  const [currentImage, setCurrentImage] = useState(
    product.mainImage || allImages[0] || PLACEHOLDER,
  );

  const handleChat = async () => {
    try {
      const convo = await chatService.openConversation(
        (product as any).ownerId, // si lo tienes en el tipo, pon ownerId directamente
        product.storeId,
      );
      navigation.navigate('Chat', { conversationId: convo.id });
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        'Erreur',
        err.response?.data?.message || "Impossible d’ouvrir la conversation.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Imagen principal */}
        <Image
          source={{ uri: currentImage || PLACEHOLDER }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        {/* Miniaturas si hay varias imágenes */}
        {allImages.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbRow}
          >
            {allImages.map((img, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setCurrentImage(img)}
              >
                <Image
                  source={{ uri: img }}
                  style={[
                    styles.thumb,
                    img === currentImage && styles.thumbActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Info producto */}
        <View style={styles.infoBox}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{product.price.toFixed(2)} MRU</Text>

          {product.description ? (
            <Text style={styles.desc}>{product.description}</Text>
          ) : (
            <Text style={styles.descMuted}>
              Aucune description fournie par le vendeur.
            </Text>
          )}
        </View>

        {/* Info vendedor (placeholder por ahora) */}
        <View style={styles.sellerBox}>
          <Text style={styles.sellerLabel}>Vendeur</Text>
          <Text style={styles.sellerName}>
            Boutique #{product.storeId}
          </Text>
          <Text style={styles.sellerHint}>
            Voir le profil de la boutique et ses autres produits bientôt 👀
          </Text>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* CTA fijo abajo, como Vinted/Wallapop */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
          <Text style={styles.chatButtonText}>Contacter le vendeur 💬</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  scrollContent: {
    paddingBottom: 20,
  },

  mainImage: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#eee',
  },

  thumbRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  thumb: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: '#ddd',
  },
  thumbActive: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },

  infoBox: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 4,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  price: { fontSize: 20, fontWeight: '700', color: '#007AFF', marginBottom: 10 },
  desc: { fontSize: 16, color: '#444', lineHeight: 22 },
  descMuted: { fontSize: 15, color: '#888', fontStyle: 'italic' },

  sellerBox: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  sellerLabel: { fontSize: 14, color: '#888', marginBottom: 4 },
  sellerName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  sellerHint: { fontSize: 14, color: '#666' },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: '#ffffffee',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  chatButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
