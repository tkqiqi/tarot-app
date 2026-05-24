import axios from 'axios';

const api = axios.create({ baseURL: 'https://tarot-app-0dnk.onrender.com/api', timeout: 90000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    // 重试一次（处理 Render 冷启动）
    if (error.config && !error.config.__retried && (!error.response || error.code === 'ECONNABORTED')) {
      error.config.__retried = true;
      return api.request(error.config);
    }
    const msg = error.response?.data?.message || error.message || '网络请求失败';
    return Promise.reject(new Error(msg));
  }
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
