import axios, { AxiosResponse } from 'axios';
import {
  AuthResponse,
  Dataset,
  GenerateDataRequest,
  LoginRequest,
  RegisterRequest,
  DataRecord
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', data);
    return response.data;
  },
};

// Data API
export const dataAPI = {
  generateData: async (data: GenerateDataRequest): Promise<Dataset> => {
    const response: AxiosResponse<Dataset> = await api.post('/data/generate', data);
    return response.data;
  },

  getDatasets: async (): Promise<Dataset[]> => {
    const response: AxiosResponse<Dataset[]> = await api.get('/data/datasets');
    return response.data;
  },

  getDataset: async (id: string): Promise<Dataset> => {
    const response: AxiosResponse<Dataset> = await api.get(`/data/datasets/${id}`);
    return response.data;
  },

  updateDataset: async (id: string, data: DataRecord[]): Promise<void> => {
    await api.put(`/data/datasets/${id}`, { data });
  },

  deleteDataset: async (id: string): Promise<void> => {
    await api.delete(`/data/datasets/${id}`);
  },
};

export default api;
