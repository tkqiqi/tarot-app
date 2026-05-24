import { create } from 'zustand';
import { authApi } from '../services/api';

export const useAuth = create<any>((set: any) => ({
  user: null, token: localStorage.getItem('token'), loading: true, authed: !!localStorage.getItem('token'),
  login: async (u: string, p: string) => {
    const res: any = await authApi.login(u, p);
    localStorage.setItem('token', res.data.token);
    set({ user: res.data.user, token: res.data.token, authed: true });
  },
  register: async (u: string, e: string, p: string, n?: string) => {
    const res: any = await authApi.register(u, e, p, n);
    localStorage.setItem('token', res.data.token);
    set({ user: res.data.user, token: res.data.token, authed: true });
  },
  logout: () => { localStorage.removeItem('token'); set({ user: null, token: null, authed: false }); },
  restore: async () => {
    const token = localStorage.getItem('token');
    if (!token) { set({ loading: false }); return; }
    try {
      const res: any = await authApi.me();
      set({ user: res.data, token, authed: true, loading: false });
    } catch { localStorage.removeItem('token'); set({ loading: false }); }
  },
  refresh: async () => { try { const res: any = await authApi.me(); set({ user: res.data }); } catch {} },
}));
