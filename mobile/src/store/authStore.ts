import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../services/api';
import type { User } from '@tarot/shared';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, nickname?: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (username, password) => {
    const res = await authApi.login(username, password) as any;
    const { token, refreshToken, user } = res.data;
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('refresh_token', refreshToken);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  register: async (username, email, password, nickname) => {
    const res = await authApi.register(username, email, password, nickname) as any;
    const { token, refreshToken, user } = res.data;
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('refresh_token', refreshToken);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['auth_token', 'refresh_token']);
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  restoreSession: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        set({ isLoading: false });
        return;
      }
      const res = await authApi.getMe() as any;
      set({ user: res.data, token, isAuthenticated: true, isLoading: false });
    } catch {
      await AsyncStorage.multiRemove(['auth_token', 'refresh_token']);
      set({ isLoading: false });
    }
  },

  refreshUser: async () => {
    try {
      const res = await authApi.getMe() as any;
      set({ user: res.data });
    } catch {
      // silent fail
    }
  },
}));
