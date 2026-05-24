import axios from 'axios';

const API_BASE = 'https://tarot-app-0dnk.onrender.com/api';

const adminApi = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.reload();
    }
    const message = error.response?.data?.message || '请求失败';
    return Promise.reject(new Error(message));
  }
);

export default adminApi;

export const adminAuth = {
  login: (username: string, password: string) =>
    adminApi.post('/auth/login', { username, password }),
};

export const adminEndpoints = {
  getStats: () => adminApi.get('/admin/stats'),
  getConfig: () => adminApi.get('/admin/config'),
  updateConfig: (data: Record<string, string>) => adminApi.put('/admin/config', data),
  getPackages: () => adminApi.get('/admin/packages'),
  updatePackage: (id: number, data: any) => adminApi.put(`/admin/packages/${id}`, data),
  getUsers: (limit = 50, offset = 0) => adminApi.get(`/admin/users?limit=${limit}&offset=${offset}`),
  adjustCoins: (userId: string, amount: number, reason: string) =>
    adminApi.post(`/admin/users/${userId}/coins`, { amount, reason }),
};
