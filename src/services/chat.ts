import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation, Product } from '../types';

export const chatService = {
  /** Crear o abrir conversación entre comprador y vendedor */
  async openConversation(otherUserId: number, storeId?: number, orderId?: number): Promise<Conversation> {
    const token = await AsyncStorage.getItem('token');
    const res = await api.post<Conversation>(
      '/chat/conversations',
      { otherUserId, storeId, orderId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  /** Obtener mensajes de una conversación */
  async getMessages(conversationId: number) {
    const token = await AsyncStorage.getItem('token');
    const res = await api.get(`/chat/conversations/${conversationId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  },
};
