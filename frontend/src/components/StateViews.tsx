import React from 'react';
import { AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import { GlassCard } from './GlassCard';

// Reusable pulsing skeletons for loading states
export const SkeletonLoader: React.FC<{ rows?: number; height?: string }> = ({ 
  rows = 4, 
  height = 'h-5' 
}) => {
  return (
    <div className="space-y-4 w-full animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div 
          key={i} 
          className={`bg-slate-200 dark:bg-slate-800 rounded-xl w-full ${height}
            ${i === rows - 1 ? 'w-4/5' : ''} 
            ${i === 0 ? 'w-11/12' : ''}`} 
        />
      ))}
    </div>
  );
};

// Reusable card grid loading placeholders
export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <GlassCard key={i} className="p-6 h-48 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </GlassCard>
      ))}
    </div>
  );
};

// Unified Empty state visualizer
export const EmptyState: React.FC<{ 
  title?: string; 
  description?: string; 
  icon?: React.ReactNode 
}> = ({ 
  title = "No data available", 
  description = "There are no records matching your request at this moment.",
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl bg-white/40 dark:bg-slate-900/10 backdrop-blur-md max-w-lg mx-auto my-8">
      <div className="p-4 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 mb-4">
        {icon || <AlertCircle className="w-8 h-8 text-indigo-500 dark:text-cyan-400" />}
      </div>
      <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{title}</h4>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">{description}</p>
    </div>
  );
};

// Unified Error state visualizer with dynamic retry callback
export const ErrorState: React.FC<{ 
  message?: string; 
  onRetry?: () => void;
  isLoading?: boolean;
}> = ({ 
  message = "Something went wrong while synchronizing metrics.", 
  onRetry,
  isLoading = false
}) => {
  return (
    <div className="p-6 border border-rose-500/20 rounded-2xl bg-rose-500/5 backdrop-blur-md max-w-md mx-auto my-8 text-center flex flex-col items-center">
      <div className="p-3.5 rounded-full bg-rose-500/10 text-rose-500 mb-4 animate-bounce-slow">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h4 className="text-md font-bold text-slate-800 dark:text-white mb-1.5">Connection Outage</h4>
      <p className="text-slate-500 dark:text-slate-400 text-xs mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-rose-500/15 disabled:opacity-50 transition-all duration-300"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Retrying Connection...' : 'Retry Handshake'}
        </button>
      )}
    </div>
  );
};
