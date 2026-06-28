import axios from 'axios';
import { apiClient } from './client';

// --- MOCK FALLBACK DATA HELPERS ---
function mockPredictSingleFallback(data: any) {
  const probRF = data.sex === 'female' ? 0.82 : 0.16;
  const probXGB = data.sex === 'female' ? 0.85 : 0.14;
  const avg = (probRF + probXGB) / 2;
  
  const explanation: Record<string, number> = {};
  if (data.sex === 'female') {
    explanation['Gender'] = 32.5;
  } else {
    explanation['Gender'] = -28.0;
  }
  
  if (data.pclass === 1) {
    explanation['Passenger Class'] = 14.5;
  } else if (data.pclass === 3) {
    explanation['Passenger Class'] = -11.0;
  } else {
    explanation['Passenger Class'] = 2.0;
  }
  
  if (data.age < 12) {
    explanation['Age'] = 18.0;
  } else if (data.age > 60) {
    explanation['Age'] = -12.5;
  } else {
    explanation['Age'] = -2.0;
  }
  
  explanation['Fare'] = data.fare > 100 ? 8.5 : (data.fare < 15 ? -6.0 : 1.2);
  explanation['Family Size'] = (data.sibsp + data.parch) === 0 ? -4.5 : 5.0;

  return {
    id: Math.floor(Math.random() * 1000),
    pclass: data.pclass,
    name: data.name || 'Passenger',
    sex: data.sex,
    age: data.age,
    sibsp: data.sibsp,
    parch: data.parch,
    fare: data.fare,
    embarked: data.embarked,
    survived_prob_rf: probRF,
    survived_prob_xgb: probXGB,
    predicted_survived: avg >= 0.5,
    explanation,
    created_at: new Date().toISOString()
  };
}

const mockHistory = [
  {
    id: 101,
    pclass: 1,
    name: 'Rose DeWitt Bukater',
    sex: 'female',
    age: 17,
    sibsp: 0,
    parch: 1,
    fare: 150.0,
    embarked: 'S',
    survived_prob_rf: 0.94,
    survived_prob_xgb: 0.96,
    predicted_survived: true,
    explanation: { 'Gender': 35.0, 'Passenger Class': 18.0, 'Age': 5.0, 'Fare': 12.0 },
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 102,
    pclass: 3,
    name: 'Jack Dawson',
    sex: 'male',
    age: 20,
    sibsp: 0,
    parch: 0,
    fare: 7.25,
    embarked: 'S',
    survived_prob_rf: 0.12,
    survived_prob_xgb: 0.08,
    predicted_survived: false,
    explanation: { 'Gender': -30.0, 'Passenger Class': -12.0, 'Fare': -8.0 },
    created_at: new Date(Date.now() - 7200000).toISOString()
  }
];

export const predictionsApi = {
  predictSingle: async (data: any) => {
    try {
      const res = await apiClient.post('/api/predictions/single', data);
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err) && !err.response) {
        return mockPredictSingleFallback(data);
      }
      throw err;
    }
  },

  predictBatch: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/api/predictions/batch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  getHistory: async () => {
    try {
      const res = await apiClient.get('/api/predictions/history');
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err) && !err.response) {
        return mockHistory;
      }
      throw err;
    }
  }
};
