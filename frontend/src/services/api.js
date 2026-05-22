import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically inject JWT token into all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    return res.data;
  },
  verify: async () => {
    const res = await api.get('/auth/verify');
    return res.data;
  },
};

export const dashboardService = {
  getStats: async () => {
    const res = await api.get('/dashboard');
    return res.data;
  },
};

export const storeService = {
  getAll: async () => {
    const res = await api.get('/stores');
    return res.data;
  },
  getOne: async (id) => {
    const res = await api.get(`/stores/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/stores', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/stores/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/stores/${id}`);
    return res.data;
  },
};

export const orderService = {
  getAll: async () => {
    const res = await api.get('/orders');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/orders', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/orders/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/orders/${id}`);
    return res.data;
  },
};

export const paymentService = {
  getAll: async () => {
    const res = await api.get('/payments');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/payments', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/payments/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/payments/${id}`);
    return res.data;
  },
};

export const financeService = {
  getRecords: async (filters = {}) => {
    const res = await api.get('/finance', { params: filters });
    return res.data;
  },
  createIncome: async (data) => {
    const res = await api.post('/finance/incomes', data);
    return res.data;
  },
  deleteIncome: async (id) => {
    const res = await api.delete(`/finance/incomes/${id}`);
    return res.data;
  },
  createExpense: async (data) => {
    const res = await api.post('/finance/expenses', data);
    return res.data;
  },
  deleteExpense: async (id) => {
    const res = await api.delete(`/finance/expenses/${id}`);
    return res.data;
  },
};

export default api;
