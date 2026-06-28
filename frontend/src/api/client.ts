import axios from 'axios';
import { getStoredToken, clearSession } from '../utils/session';

// Base URL configuration (Render production API URL is the default fallback)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://titanic-survival-intelligence-suite.onrender.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token in all API requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to automatically handle 401 Unauthorized responses (session expiry)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    const isRegisterRequest = error.config?.url?.includes('/auth/register');
    
    if (error.response && error.response.status === 401 && !isLoginRequest && !isRegisterRequest) {
      clearSession();
      // Dispatch custom event to let the main React app handle redirect and warning toast
      window.dispatchEvent(new Event('auth-expired'));
    }
    return Promise.reject(error);
  }
);
