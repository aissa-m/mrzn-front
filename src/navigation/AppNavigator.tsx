// navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// TIPOS de rutas
export type RootStackParamList = {
  ChatsList: undefined;
  Chat: { chatId: string; title?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Screens
import ChatsListScreen from '../screens/ChatsListScreen';
import ChatScreen from '../screens/ChatScreen'; // tu pantalla individual (la que ya tienes)

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ChatsList"
          component={ChatsListScreen}
          options={{ title: 'Chats' }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ route }) => ({ title: route.params?.title || 'Chat' })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
