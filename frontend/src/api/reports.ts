import { getStoredToken } from '../utils/session';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://titanic-survival-intelligence-suite.onrender.com';

export const getPdfReportUrl = () => {
  const token = getStoredToken();
  return `${API_BASE_URL}/api/reports/pdf?authorization=Bearer ${token}`;
};

export const getCsvReportUrl = () => {
  const token = getStoredToken();
  return `${API_BASE_URL}/api/reports/csv?authorization=Bearer ${token}`;
};
