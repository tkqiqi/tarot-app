import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const message = error.response?.data?.message || '网络请求失败';
    return Promise.reject(new Error(message));
  }
);

export default api;

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  register: (username: string, email: string, password: string, nickname?: string) =>
    api.post('/auth/register', { username, email, password, nickname }),
  getMe: () => api.get('/auth/me'),
};

// Reading API
export const readingApi = {
  getSpreads: () => api.get('/spreads'),
  createReading: (data: {
    question: string;
    category: string;
    spreadType: string;
    tier: string;
  }) => api.post('/readings', data),
  upgradeReading: (id: string) => api.post(`/readings/${id}/upgrade`),
  getReadings: (limit = 20, offset = 0) =>
    api.get(`/readings?limit=${limit}&offset=${offset}`),
  getReading: (id: string) => api.get(`/readings/${id}`),
};

// Cards API
export const cardsApi = {
  getCards: () => api.get('/cards'),
};
