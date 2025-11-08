// screens/ChatsListScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { socket } from '../services/socket';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatsList'>;

interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  lastAt?: string; // ISO
  unread?: number;
}

export default function ChatsListScreen({ navigation }: Props) {
  const [chats, setChats] = useState<Conversation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChats = useCallback(() => {
    // Pide la lista al backend por socket
    socket.emit('chat:list');
  }, []);

  useEffect(() => {
    socket.connect();

    const onChatList = (list: Conversation[]) => {
      // ordénalos por fecha del último mensaje desc
      const sorted = [...list].sort((a, b) =>
        (b.lastAt || '').localeCompare(a.lastAt || '')
      );
      setChats(sorted);
      setRefreshing(false);
    };

    const onNewMessage = (msg: { chatId: string; text: string; at?: string }) => {
      // Actualiza preview + unread
      setChats(prev => {
        const found = prev.find(c => c.id === msg.chatId);
        if (!found) return prev; // si tu backend no manda el chat nuevo, puedes fetchChats()

        const updated: Conversation = {
          ...found,
          lastMessage: msg.text,
          lastAt: msg.at || new Date().toISOString(),
          unread: (found.unread || 0) + 1,
        };
        const rest = prev.filter(c => c.id !== msg.chatId);
        const next = [updated, ...rest];
        // reordenar por lastAt
        next.sort((a, b) => (b.lastAt || '').localeCompare(a.lastAt || ''));
        return next;
      });
    };

    socket.on('chat:list:result', onChatList);
    socket.on('message:new', onNewMessage);

    // primera carga
    fetchChats();

    return () => {
      socket.off('chat:list:result', onChatList);
      socket.off('message:new', onNewMessage);
      socket.disconnect();
    };
  }, [fetchChats]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
  };

  const openChat = (c: Conversation) => {
    // Reinicia unread localmente (opcional)
    setChats(prev => prev.map(x => (x.id === c.id ? { ...x, unread: 0 } : x)));
    navigation.navigate('Chat', { chatId: c.id, title: c.title });
  };

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity style={styles.item} onPress={() => openChat(item)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        {!!item.lastMessage && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        )}
      </View>

      <View style={styles.right}>
        {!!item.lastAt && (
          <Text style={styles.time}>
            {new Date(item.lastAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
        {!!item.unread && item.unread > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(c) => c.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F14' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  title: { color: '#E5E7EB', fontSize: 16, fontWeight: '600' },
  subtitle: { color: '#94A3B8', marginTop: 2 },
  right: { alignItems: 'flex-end', marginLeft: 10 },
  time: { color: '#9CA3AF', fontSize: 12, marginBottom: 6 },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F43F5E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginLeft: 14 },
});
