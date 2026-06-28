import axios from 'axios';
import { apiClient } from './client';

// --- MOCK FALLBACK DATA HELPERS ---
const mockAnalyticsReport = {
  kpis: {
    total_predictions: 1023,
    survival_rate: 38.3,
    accuracy_score: 0.824,
    active_users: 14,
  },
  gender_analysis: [
    { category: 'Female', survived: 233, perished: 81, rate: 74.2 },
    { category: 'Male', survived: 109, perished: 468, rate: 18.9 }
  ],
  class_analysis: [
    { category: 'Class 1', survived: 136, perished: 80, rate: 63.0 },
    { category: 'Class 2', survived: 87, perished: 97, rate: 47.3 },
    { category: 'Class 3', survived: 119, perished: 372, rate: 24.2 }
  ],
  embarked_analysis: [
    { category: 'Southampton', survived: 217, perished: 427, rate: 33.7 },
    { category: 'Cherbourg', survived: 93, perished: 75, rate: 55.4 },
    { category: 'Queenstown', survived: 30, perished: 47, rate: 39.0 }
  ],
  age_groups: {
    'Child (0-12)': { survived: 40, perished: 29, rate: 58.0 },
    'Teenager (13-19)': { survived: 39, perished: 56, rate: 41.1 },
    'Adult (20-59)': { survived: 250, perished: 430, rate: 36.8 },
    'Senior (60+)': { survived: 5, perished: 21, rate: 19.2 }
  },
  correlation: [
    { feature1: 'Pclass', feature2: 'Fare', value: -0.55 },
    { feature1: 'Pclass', feature2: 'Survived', value: -0.34 },
    { feature1: 'Sex', feature2: 'Survived', value: 0.54 },
    { feature1: 'Age', feature2: 'Survived', value: -0.08 },
    { feature1: 'SibSp', feature2: 'Parch', value: 0.41 },
    { feature1: 'Fare', feature2: 'Survived', value: 0.26 }
  ]
};

export const analyticsApi = {
  getAnalytics: async () => {
    try {
      const res = await apiClient.get('/api/analytics');
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err) && !err.response) {
        return mockAnalyticsReport;
      }
      throw err;
    }
  }
};
