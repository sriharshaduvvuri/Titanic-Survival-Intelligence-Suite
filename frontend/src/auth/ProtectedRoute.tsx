import React, { useEffect } from 'react';
import { getStoredToken } from '../utils/session';

interface ProtectedRouteProps {
  user: any;
  setCurrentTab: (tab: string) => void;
  children: React.ReactElement;
  showToast: (msg: string, type?: any) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  user,
  setCurrentTab,
  children,
  showToast
}) => {
  const token = getStoredToken();

  useEffect(() => {
    if (!user || !token) {
      showToast('Access Denied. Please sign in to view this diagnostic area.', 'warning');
      setCurrentTab('login');
    }
  }, [user, token, setCurrentTab, showToast]);

  if (user && token) {
    return children;
  }

  // Loader placeholder while redirecting
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950 text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold">Redirecting to Authentication Portal...</span>
      </div>
    </div>
  );
};
