import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const SOCKET_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

let socket = null;

/**
 * Get or initialize singleton Socket.IO client instance
 */
export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      // Re-register user if logged in
      try {
        const storedUser = localStorage.getItem('maxevog_user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          if (userObj?.id) {
            socket.emit('join_user', userObj.id);
          }
          if (userObj?.role === 'AGENT') {
            socket.emit('join_agents');
          } else if (userObj?.role === 'ADMIN') {
            socket.emit('join_admin');
          }
        }
      } catch (err) {
        // Ignore parsing errors
      }
    });

    socket.on('connect_error', (err) => {
      // Soft log connection error without crashing UI
      console.warn('[Socket.IO] Real-time connection error:', err?.message || err);
    });
  }

  return socket;
};

export default getSocket;
