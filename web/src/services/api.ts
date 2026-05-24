import axios from 'axios';

const api = axios.create({ baseURL: 'http://192.168.1.3:3000/api', timeout: 60000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (error) => Promise.reject(new Error(error.response?.data?.message || '网络请求失败'))
);

export default api;

export const authApi = {
  login: (u: string, p: string) => api.post('/auth/login', { username: u, password: p }),
  register: (u: string, e: string, p: string, n?: string) => api.post('/auth/register', { username: u, email: e, password: p, nickname: n }),
  me: () => api.get('/auth/me'),
};

export const readingApi = {
  getSpreads: () => api.get('/spreads'),
  getCards: () => api.get('/cards'),
  create: (data: any) => api.post('/readings', data),
  upgrade: (id: string) => api.post(`/readings/${id}/upgrade`),
  list: (l = 50, o = 0) => api.get(`/readings?limit=${l}&offset=${o}`),
};
