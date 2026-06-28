import axios from 'axios';
import { apiClient } from './client';
import { getStoredToken } from '../utils/session';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://titanic-survival-intelligence-suite.onrender.com';

const mockAdminStats = {
  total_users: 14,
  total_predictions: 1023,
  total_files: 5,
  predictions_over_time: [
    { date: 'Jun 21', predictions: 12 },
    { date: 'Jun 22', predictions: 24 },
    { date: 'Jun 23', predictions: 18 },
    { date: 'Jun 24', predictions: 32 },
    { date: 'Jun 25', predictions: 45 },
    { date: 'Jun 26', predictions: 29 },
    { date: 'Jun 27', predictions: 41 }
  ],
  active_logs: [
    { id: 1, action: 'LOGIN', details: 'User admin@titanic.ai logged in', timestamp: new Date().toISOString(), ip_address: '127.0.0.1', user_id: 1, user_email: 'admin@titanic.ai' },
    { id: 2, action: 'PREDICTION_SINGLE', details: 'Predicted survival: true (RF: 0.88, XGB: 0.91)', timestamp: new Date(Date.now() - 600000).toISOString(), ip_address: '127.0.0.1', user_id: 2, user_email: 'analyst@titanic.ai' },
    { id: 3, action: 'EXPORT_PDF', details: 'Exported system analytics PDF report', timestamp: new Date(Date.now() - 1200000).toISOString(), ip_address: '127.0.0.1', user_id: 1, user_email: 'admin@titanic.ai' }
  ]
};

export const adminApi = {
  getStats: async () => {
    try {
      const res = await apiClient.get('/api/admin/stats');
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err) && !err.response) {
        return mockAdminStats;
      }
      throw err;
    }
  },
  getUsers: async () => {
    const res = await apiClient.get('/api/admin/users');
    return res.data;
  },
  updateUserRole: async (userId: number, role: string) => {
    const res = await apiClient.put(`/api/admin/users/${userId}/role`, { role });
    return res.data;
  },
  getFiles: async () => {
    const res = await apiClient.get('/api/admin/files');
    return res.data;
  }
};

export const getDbExportUrl = () => {
  const token = getStoredToken();
  return `${API_BASE_URL}/api/admin/data/export?authorization=Bearer ${token}`;
};
