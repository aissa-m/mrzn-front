// src/screens/HomeScreen.tsx
import { View, Text, Button } from 'react-native';
import { authService } from '../services/auth';

export default function HomeScreen({ navigation }: any) {
  const handleLogout = async () => {
    await authService.logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>🏠 Bienvenue à Maurizone</Text>
      <Button title="Ouvrir le chat" onPress={() => navigation.navigate('Chat')} />
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}
