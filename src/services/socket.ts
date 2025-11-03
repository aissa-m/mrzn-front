import { io } from 'socket.io-client';

// ⚠️ Usa la IP de tu backend NestJS (igual que en api.ts)
const SOCKET_URL = 'http://192.168.1.129:3000';

export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
});
