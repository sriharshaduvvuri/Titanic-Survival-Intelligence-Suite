import React from 'react';
import { Dashboard } from '../dashboard/Dashboard';
import { PredictionCenter } from '../pages/PredictionCenter';
import { ExplainableAI } from '../pages/ExplainableAI';
import { BatchPrediction } from '../pages/BatchPrediction';
import { AnalyticsLab } from '../pages/AnalyticsLab';
import { Reports } from '../pages/Reports';
import { AdminPanel } from '../pages/AdminPanel';
import { Settings } from '../pages/Settings';
import { AboutProject } from '../pages/AboutProject';
import { DatasetExplorer } from '../pages/DatasetExplorer';
import { ComparePassengers } from '../pages/ComparePassengers';
import { ModelMetrics } from '../pages/ModelMetrics';
import { ContactFeedback } from '../pages/ContactFeedback';

export interface RouteConfig {
  id: string;
  label: string;
  protected: boolean;
  adminOnly?: boolean;
  component: React.ComponentType<any>;
}

export const routes: RouteConfig[] = [
  { id: 'about', label: 'About Project', protected: false, component: AboutProject },
  { id: 'dashboard', label: 'Dashboard', protected: true, component: Dashboard },
  { id: 'prediction', label: 'Prediction Center', protected: true, component: PredictionCenter },
  { id: 'eai', label: 'Explainable AI', protected: true, component: ExplainableAI },
  { id: 'batch', label: 'Batch Prediction', protected: true, component: BatchPrediction },
  { id: 'analytics', label: 'Analytics Lab', protected: true, component: AnalyticsLab },
  { id: 'dataset', label: 'Dataset Explorer', protected: true, component: DatasetExplorer },
  { id: 'compare', label: 'Compare Passengers', protected: true, component: ComparePassengers },
  { id: 'metrics', label: 'Model Metrics', protected: true, component: ModelMetrics },
  { id: 'reports', label: 'Reports', protected: true, component: Reports },
  { id: 'contact', label: 'Contact & Feedback', protected: false, component: ContactFeedback },
  { id: 'admin', label: 'Admin Panel', protected: true, adminOnly: true, component: AdminPanel },
  { id: 'settings', label: 'Settings', protected: true, component: Settings },
];

