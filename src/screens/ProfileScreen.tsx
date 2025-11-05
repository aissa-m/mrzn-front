import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { authService } from '../services/auth';
import { styles } from '../styles/profileStyles';
import type { User } from '../types';

function roleLabel(role?: User['role']) {
  switch (role) {
    case 'STORE_OWNER':
      return 'Vendeur';
    case 'ADMIN':
      return 'Admin';
    case 'USER':
    default:
      return 'Acheteur';
  }
}

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        // 1) Intentar desde API (si tu backend expone /auth/me)
        const res = await api.get<User>('/auth/me');
        if (!mounted) return;
        setUser(res.data);
      } catch (_err) {
        // 2) Fallback: intentar desde AsyncStorage (por si en el futuro guardas el user)
        const cached = await authService.getCurrentUser();
        if (!mounted) return;
        setUser(cached);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const initials =
    (user?.name || '')
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'MZ';

  const handleLogout = async () => {
    await authService.logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>Chargement du profil…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header / Avatar */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{user?.name || 'Utilisateur Maurizone'}</Text>
          <Text style={styles.email}>{user?.email || '—'}</Text>
          <Text style={styles.role}>{roleLabel(user?.role)}</Text>
        </View>
      </View>

      {/* Cards / actions */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => Alert.alert('Bientôt disponible', 'Édition du profil')}
        >
          <Text style={styles.itemText}>Modifier le profil</Text>
          <Text style={styles.itemHint}>Nom, e-mail…</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => Alert.alert('Bientôt disponible', 'Préférences')}
        >
          <Text style={styles.itemText}>Préférences</Text>
          <Text style={styles.itemHint}>Langue, notifications…</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
