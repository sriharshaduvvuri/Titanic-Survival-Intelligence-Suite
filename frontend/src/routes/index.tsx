import React from 'react';
import { Dashboard } from '../dashboard/Dashboard';
import { PredictionCenter } from '../pages/PredictionCenter';
import { ExplainableAI } from '../pages/ExplainableAI';
import { BatchPrediction } from '../pages/BatchPrediction';
import { AnalyticsLab } from '../pages/AnalyticsLab';
import { Reports } from '../pages/Reports';
import { AdminPanel } from '../pages/AdminPanel';
import { Settings } from '../pages/Settings';

export interface RouteConfig {
  id: string;
  label: string;
  protected: boolean;
  adminOnly?: boolean;
  component: React.ComponentType<any>;
}

export const routes: RouteConfig[] = [
  { id: 'dashboard', label: 'Dashboard', protected: true, component: Dashboard },
  { id: 'prediction', label: 'Prediction Center', protected: true, component: PredictionCenter },
  { id: 'eai', label: 'Explainable AI', protected: true, component: ExplainableAI },
  { id: 'batch', label: 'Batch Prediction', protected: true, component: BatchPrediction },
  { id: 'analytics', label: 'Analytics Lab', protected: true, component: AnalyticsLab },
  { id: 'reports', label: 'Reports', protected: true, component: Reports },
  { id: 'admin', label: 'Admin Panel', protected: true, adminOnly: true, component: AdminPanel },
  { id: 'settings', label: 'Settings', protected: true, component: Settings },
];
