import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// No celular físico, "localhost" é o próprio celular e não alcança o PC.
// Rode o Expo com: EXPO_PUBLIC_API_URL=http://<IP-DO-PC>:3333/api npx expo start
// (ex: EXPO_PUBLIC_API_URL=http://192.168.0.12:3333/api). No emulador/web,
// o fallback localhost funciona.
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3333/api';

export const API_BASE_URL = BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@verde:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let sessionExpiredHandler = null;

/**
 * Registra o callback disparado quando o token expira (401 em requisição
 * autenticada). O AuthContext usa isso para encerrar a sessão na interface.
 */
export const setSessionExpiredHandler = (handler) => {
  sessionExpiredHandler = handler;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401 sem token é "credenciais inválidas" no login e não deve derrubar a
    // sessão. Com token, o token expirou: encerra a sessão por completo.
    const status = error.response?.status;
    const headers = error.config?.headers;
    const sentAuth = headers?.Authorization || headers?.authorization;

    if (status === 401 && sentAuth) {
      await AsyncStorage.multiRemove(['@verde:token', '@verde:user']);
      sessionExpiredHandler?.();
    }
    return Promise.reject(error);
  }
);

export default api;
