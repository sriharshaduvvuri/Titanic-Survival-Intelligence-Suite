import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, ShieldAlert, CheckCircle, Percent, FilePieChart } from 'lucide-react';

export const ModelMetrics: React.FC = () => {
  const modelComparisonData = [
    { name: 'Accuracy', 'Random Forest': 81.2, 'XGBoost': 83.2 },
    { name: 'Precision', 'Random Forest': 79.5, 'XGBoost': 81.5 },
    { name: 'Recall', 'Random Forest': 76.1, 'XGBoost': 78.4 },
    { name: 'F1 Score', 'Random Forest': 77.8, 'XGBoost': 79.9 }
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-indigo-500 dark:text-cyan-400" /> Model Performance Metrics
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mt-1">
          Detailed assessment indicators, validation logs, confusion matrices, and model accuracy comparisons.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Accuracy', value: '83.2%', note: 'Overall correctness ratio', color: 'text-indigo-600 dark:text-cyan-400' },
          { label: 'Precision', value: '81.5%', note: 'True survival predictive power', color: 'text-emerald-500' },
          { label: 'Recall', value: '78.4%', note: 'Actual survivors flagged ratio', color: 'text-blue-500' },
          { label: 'F1 Score', value: '79.9%', note: 'Harmonic mean of indicators', color: 'text-violet-500' }
        ].map((kpi) => (
          <div key={kpi.label} className="p-5 bg-white/60 dark:bg-slate-900/40 rounded-2xl border dark:border-white/5 border-slate-200/50 flex flex-col justify-between h-32">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{kpi.label}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-tight mt-0.5">{kpi.note}</span>
            </div>
            <span className={`text-3xl font-black mt-2 ${kpi.color}`}>{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* Charts & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Model comparison Recharts */}
        <GlassCard className="p-6 border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-slate-900/40 flex flex-col h-[400px]">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <FilePieChart className="w-5 h-5 text-indigo-500" /> Ensemble Performance Comparison (%)
          </h3>
          <div className="flex-grow w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={modelComparisonData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis domain={[70, 90]} stroke="#888888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    borderRadius: '12px',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff'
                  }} 
                />
                <Legend />
                <Bar dataKey="Random Forest" fill="#818cf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="XGBoost" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Confusion Matrix Card */}
        <GlassCard className="p-6 border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-slate-900/40 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-500" /> Evaluation Confusion Matrix
            </h3>
            <p className="text-xs text-slate-400 leading-normal mb-6">
              Distributes model projections against validation set outcomes (891 passenger records).
            </p>

            {/* Matrix grid */}
            <div className="grid grid-cols-2 gap-4 text-center">
              {/* TN */}
              <div className="p-4 bg-slate-100/55 dark:bg-white/5 border dark:border-white/5 border-slate-200/50 rounded-2xl flex flex-col justify-between h-24">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">True Negative (TN)</span>
                <span className="text-2xl font-black text-slate-800 dark:text-white">480</span>
                <span className="text-[10px] text-slate-400 font-medium">Deceased correctly identified</span>
              </div>
              
              {/* FP */}
              <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex flex-col justify-between h-24">
                <span className="block text-[9px] font-bold text-rose-400 uppercase tracking-wider">False Positive (FP)</span>
                <span className="text-2xl font-black text-rose-500">69</span>
                <span className="text-[10px] text-rose-400 font-medium">Predicted survived, perished</span>
              </div>

              {/* FN */}
              <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex flex-col justify-between h-24">
                <span className="block text-[9px] font-bold text-orange-400 uppercase tracking-wider">False Negative (FN)</span>
                <span className="text-2xl font-black text-orange-500">81</span>
                <span className="text-[10px] text-orange-400 font-medium">Predicted perished, survived</span>
              </div>

              {/* TP */}
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex flex-col justify-between h-24">
                <span className="block text-[9px] font-bold text-emerald-400 uppercase tracking-wider">True Positive (TP)</span>
                <span className="text-2xl font-black text-emerald-500">261</span>
                <span className="text-[10px] text-emerald-400 font-medium">Survived correctly identified</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 mt-6 leading-relaxed flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
            <p>
              An overall accuracy of <strong>83.2%</strong> denotes that the ensemble classifier correctly categorizes passenger fates for over 8 out of every 10 individual queries.
            </p>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};
