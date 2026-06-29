import React, { useEffect, useState } from 'react';
import { 
  Users, 
  BrainCircuit, 
  Percent, 
  History, 
  ArrowUpRight, 
  Activity, 
  Clock, 
  Ship,
  Eye,
  PlusCircle,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { StatsWidget } from '../components/StatsWidget';
import { GlassCard } from '../components/GlassCard';
import { useToast } from '../components/NotificationToast';
import { analyticsApi, predictionsApi } from '../api';
import { SkeletonLoader, ErrorState, EmptyState } from '../components/StateViews';

interface DashboardProps {
  onNavigateToEAI?: (predictionData: any) => void;
  setCurrentTab?: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateToEAI, setCurrentTab }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState(false);
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      setError(false);
      const [analyticsRes, historyRes] = await Promise.all([
        analyticsApi.getAnalytics(),
        predictionsApi.getHistory()
      ]);
      setData(analyticsRes);
      setHistory(historyRes);
    } catch (err: any) {
      showToast('Error syncing with diagnostic endpoints.', 'error');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [showToast]);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="h-6 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-850 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="p-6 bg-white/40 dark:bg-slate-900/10 rounded-2xl border dark:border-white/5 border-slate-200 h-80 flex flex-col justify-between">
            <SkeletonLoader rows={4} />
          </div>
          <div className="p-6 bg-white/40 dark:bg-slate-900/10 rounded-2xl border dark:border-white/5 border-slate-200 h-80 flex flex-col justify-between">
            <SkeletonLoader rows={4} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <ErrorState 
          message="Failed to synchronize diagnostic aggregates with the REST backend." 
          onRetry={handleRetry}
        />
      </div>
    );
  }

  const { kpis, gender_analysis, class_analysis, age_groups } = data;

  // Format age groups for Recharts
  const ageChartData = Object.entries(age_groups).map(([key, value]: [string, any]) => ({
    name: key.split(' ')[0], // Shorten label (e.g. Child)
    Survived: value.survived,
    Perished: value.perished,
    Rate: value.rate
  }));

  // Pie chart colors for Passenger Class
  const COLORS = ['#6366f1', '#06b6d4', '#f43f5e'];

  // Calculate recent predictions in last 24h
  const getRecentCount = () => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return history.filter(item => new Date(item.created_at).getTime() > oneDayAgo).length;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto animate-fade-in bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/60 dark:border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
            Predictive Analytics Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Real-time aggregates of Titanic passenger survival estimations and ML core outputs.
          </p>
        </div>
        {setCurrentTab && (
          <button
            onClick={() => setCurrentTab('prediction')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all duration-300 w-fit self-start md:self-auto"
          >
            <PlusCircle className="w-4.5 h-4.5" />
            <span>New Prediction</span>
          </button>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsWidget 
          label="Total Predictions" 
          value={kpis.total_predictions} 
          trend="+8%" 
          trendType="positive"
          accentColor="indigo"
          icon={<BrainCircuit className="w-6 h-6" />}
        />
        <StatsWidget 
          label="Survival Rate" 
          value={`${kpis.survival_rate.toFixed(1)}%`} 
          trend="-2.1%" 
          trendType="negative"
          accentColor="rose"
          icon={<Activity className="w-6 h-6" />}
        />
        <StatsWidget 
          label="Recent Count (24h)" 
          value={getRecentCount()} 
          trend={history.length > 0 ? `+${history.length} total` : '0 total'}
          trendType="positive"
          accentColor="cyan"
          icon={<Clock className="w-6 h-6" />}
        />
        <StatsWidget 
          label="Ensemble Accuracy" 
          value={`${(kpis.accuracy_score * 100).toFixed(1)}%`} 
          trend="+0.4%" 
          trendType="positive"
          accentColor="emerald"
          icon={<Percent className="w-6 h-6" />}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Breakdown (BarChart comparing Survived vs Perished) */}
        <GlassCard className="p-6 border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-900/40">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-md font-bold text-slate-800 dark:text-white flex items-center gap-2">
              Gender Survival Distribution
            </h3>
            <span className="text-xs font-semibold text-indigo-600 dark:text-cyan-400">Random Forest & XGBoost</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gender_analysis} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="survived" name="Survived" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="perished" name="Perished" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Age Groups Analysis */}
        <GlassCard className="p-6 border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-900/40">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-md font-bold text-slate-800 dark:text-white">
              Age Group Survival Demographics
            </h3>
            <span className="text-xs text-slate-400 font-semibold uppercase">Surv. rate per band</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="Survived" name="Survived" fill="#6366f1" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Perished" name="Perished" fill="#e2e8f0" dark-fill="#334155" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Passenger Class Insights (Pie Donut Chart) */}
        <GlassCard className="col-span-1 p-6 border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between">
          <div>
            <h3 className="text-md font-bold text-slate-800 dark:text-white mb-6">Passenger Class Breakdown</h3>
            <div className="h-64 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={class_analysis}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="survived"
                    nameKey="category"
                  >
                    {class_analysis.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Total Survived</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white">
                  {class_analysis.reduce((sum: number, item: any) => sum + item.survived, 0)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 flex-wrap mt-4 border-t border-slate-100 dark:border-white/5 pt-4">
            {class_analysis.map((entry: any, index: number) => (
              <div key={entry.category} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="font-bold text-slate-800 dark:text-slate-200">{entry.category}</span>
                <span>({entry.rate}%)</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Prediction History Table Card */}
        <GlassCard className="col-span-1 lg:col-span-2 p-6 border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-md font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-500" /> Passenger Prediction History
              </h3>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-cyan-400 uppercase bg-indigo-500/10 dark:bg-cyan-400/10 px-2.5 py-1 rounded-full">
                Active Audit Log
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Passenger Profile</th>
                    <th className="pb-3 font-semibold text-center">Class</th>
                    <th className="pb-3 font-semibold text-right">Result</th>
                    <th className="pb-3 font-semibold text-right">Confidence</th>
                    <th className="pb-3 font-semibold text-center">SHAP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {history.slice(0, 5).map((item) => {
                    const avgProb = (item.survived_prob_rf + item.survived_prob_xgb) / 2;
                    return (
                      <tr key={item.id} className="hover:bg-slate-100/30 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 text-slate-400 dark:text-slate-500 font-medium">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="py-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium capitalize">
                              {item.sex} &bull; Age {item.age}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-center font-bold text-slate-700 dark:text-slate-300">
                          {item.pclass}
                        </td>
                        <td className="py-3 text-right">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide
                            ${item.predicted_survived 
                              ? 'text-emerald-600 bg-emerald-500/10' 
                              : 'text-rose-600 bg-rose-500/10'}`}
                          >
                            {item.predicted_survived ? 'Survived' : 'Perished'}
                          </span>
                        </td>
                        <td className="py-3 text-right font-black text-slate-800 dark:text-white font-mono">
                          {(avgProb * 100).toFixed(0)}%
                        </td>
                        <td className="py-3 text-center">
                          {onNavigateToEAI && (
                            <button
                              onClick={() => onNavigateToEAI(item)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:border-indigo-500 dark:border-white/5 dark:hover:border-cyan-400 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400 hover:text-indigo-500 dark:hover:text-cyan-400 transition-all"
                              title="Explainable AI Analysis"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {history.length === 0 && (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                  <Clock className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-50 animate-pulse" />
                  No predictions processed yet. Use the Inference Engine to start.
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Recent Activity Timeline Card */}
        <GlassCard className="col-span-1 p-6 border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-md font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" /> Recent Activity
              </h3>
            </div>
            
            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-250/85 dark:before:bg-white/5">
              
              {/* Event 1: User Registered */}
              <div className="relative">
                <div className="absolute -left-7 top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900" />
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Registration Gate</span>
                <span className="font-bold text-xs text-slate-700 dark:text-slate-200 block mt-0.5">Validation account registered</span>
                <span className="text-[10px] text-slate-400 font-mono">10m ago &bull; IP: 127.0.0.1</span>
              </div>

              {/* Event 2: Prediction Created */}
              <div className="relative">
                <div className="absolute -left-7 top-1 w-3 h-3 rounded-full bg-cyan-500 border-2 border-white dark:border-slate-900" />
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Inference Engine</span>
                <span className="font-bold text-xs text-slate-700 dark:text-slate-200 block mt-0.5">Passenger survival score evaluated</span>
                <span className="text-[10px] text-slate-400 font-mono">6m ago &bull; RF vs XGB</span>
              </div>

              {/* Event 3: Report Exported */}
              <div className="relative">
                <div className="absolute -left-7 top-1 w-3 h-3 rounded-full bg-purple-500 border-2 border-white dark:border-slate-900" />
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reports Center</span>
                <span className="font-bold text-xs text-slate-700 dark:text-slate-200 block mt-0.5">Helvetic PDF document compiled</span>
                <span className="text-[10px] text-slate-400 font-mono">Just now &bull; 891 rows log</span>
              </div>

            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
