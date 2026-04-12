import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('[v0] API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('[v0] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('[v0] API Response:', response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    console.error('[v0] API Error:', error.message, error.config?.url);
    return Promise.reject(error);
  }
);

export const dishApi = {
  getAll: async () => {
    const response = await apiClient.get('/dishes');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await apiClient.get(`/dishes/${id}`);
    return response.data;
  },
  getByCategory: async (category: string) => {
    const response = await apiClient.get(`/dishes/category/${category}`);
    return response.data;
  },
};

export const reservationApi = {
  create: async (reservation: any) => {
    const response = await apiClient.post('/reservations', reservation);
    return response.data;
  },
  getAll: async () => {
    const response = await apiClient.get('/reservations');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await apiClient.get(`/reservations/${id}`);
    return response.data;
  },
  update: async (id: number, reservation: any) => {
    const response = await apiClient.put(`/reservations/${id}`, reservation);
    return response.data;
  },
  delete: async (id: number) => {
    await apiClient.delete(`/reservations/${id}`);
  },
};

export const chatApi = {
  sendMessage: async (userMessage: string) => {
    const response = await apiClient.post('/chat', {
      userMessage,
    });
    return response.data;
  },
};

export default apiClient;
