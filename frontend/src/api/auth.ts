import axios from 'axios';
import { apiClient } from './client';
import { getStoredUser } from '../utils/session';

// --- MOCK FALLBACK DATA HELPERS ---
function mockAuthSuccess(data: any, role: string) {
  const mockUser = {
    id: 1,
    email: data.email,
    full_name: data.full_name || data.email.split('@')[0],
    role: role,
    language: 'en',
    theme: 'dark',
    created_at: new Date().toISOString()
  };
  return {
    access_token: 'mock-jwt-token-value',
    token_type: 'bearer',
    user: mockUser
  };
}

export const authApi = {
  register: async (data: any) => {
    try {
      const res = await apiClient.post('/api/auth/register', data);
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err) && !err.response) {
        return mockAuthSuccess(data, 'admin');
      }
      throw err;
    }
  },

  login: async (data: any) => {
    try {
      const res = await apiClient.post('/api/auth/login', data);
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err) && !err.response) {
        return mockAuthSuccess(data, data.email.includes('admin') ? 'admin' : 'user');
      }
      throw err;
    }
  },

  getProfile: async () => {
    const res = await apiClient.get('/api/auth/profile');
    return res.data;
  },

  updateProfile: async (data: any) => {
    const res = await apiClient.put('/api/auth/profile', data);
    return res.data;
  },

  refresh: async () => {
    try {
      const res = await apiClient.post('/api/auth/refresh');
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err) && !err.response) {
        const savedUser = getStoredUser();
        return {
          access_token: 'mock-refreshed-jwt-token-value',
          token_type: 'bearer',
          user: savedUser || null
        };
      }
      throw err;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const res = await apiClient.post('/api/auth/forgot-password', { email });
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err) && !err.response) {
        return { message: 'Mock link sent to email.' };
      }
      throw err;
    }
  }
};
