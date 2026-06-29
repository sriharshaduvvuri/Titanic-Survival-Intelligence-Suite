import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { useToast } from '../components/NotificationToast';
import { predictionsApi } from '../api';
import { Brain, ArrowRight, UserPlus, Info, Check, Shield, AlertCircle, ArrowLeftRight } from 'lucide-react';

interface PassengerInput {
  name: string;
  pclass: number;
  sex: string;
  age: number;
  sibsp: number;
  parch: number;
  fare: number;
  embarked: string;
}

export const ComparePassengers: React.FC = () => {
  const { showToast } = useToast();

  const [passengerA, setPassengerA] = useState<PassengerInput>({
    name: 'Jack Dawson',
    pclass: 3,
    sex: 'male',
    age: 20,
    sibsp: 0,
    parch: 0,
    fare: 7.25,
    embarked: 'S'
  });

  const [passengerB, setPassengerB] = useState<PassengerInput>({
    name: 'Rose DeWitt Bukater',
    pclass: 1,
    sex: 'female',
    age: 17,
    sibsp: 0,
    parch: 1,
    fare: 150.00,
    embarked: 'S'
  });

  const [loading, setLoading] = useState(false);
  const [resultA, setResultA] = useState<any>(null);
  const [resultB, setResultB] = useState<any>(null);

  // Field validation helper
  const validateInputs = (passenger: PassengerInput, label: string) => {
    if (!passenger.name.trim()) {
      showToast(`${label} name cannot be empty`, 'warning');
      return false;
    }
    if (passenger.fare < 0) {
      showToast(`${label} fare cannot be negative`, 'warning');
      return false;
    }
    return true;
  };

  const handleCompare = async () => {
    if (!validateInputs(passengerA, 'Passenger A') || !validateInputs(passengerB, 'Passenger B')) {
      return;
    }

    setLoading(true);
    setResultA(null);
    setResultB(null);

    try {
      // Query both endpoints concurrently
      const [resA, resB] = await Promise.all([
        predictionsApi.predictSingle(passengerA),
        predictionsApi.predictSingle(passengerB)
      ]);

      setResultA(resA);
      setResultB(resB);
      showToast('Comparative analysis finished successfully!', 'success');
    } catch (err: any) {
      showToast('Error during comparison query. Please review inputs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper for computing combined probability
  const getProbability = (res: any) => {
    if (!res) return 0;
    const rf = res.survived_prob_rf !== undefined ? res.survived_prob_rf : 0;
    const xgb = res.survived_prob_xgb !== undefined ? res.survived_prob_xgb : 0;
    return ((rf + xgb) / 2) * 100;
  };

  const probA = getProbability(resultA);
  const probB = getProbability(resultB);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <ArrowLeftRight className="w-8 h-8 text-indigo-500 dark:text-cyan-400" /> Compare Passengers
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mt-1">
          Perform a side-by-side comparative simulation of survival probability between two custom passenger records.
        </p>
      </div>

      {/* Inputs side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Passenger A Panel */}
        <GlassCard className="p-6 border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-slate-900/40">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xs font-bold">A</span>
            Passenger A Inputs
          </h3>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Passenger Name</label>
              <input
                type="text"
                value={passengerA.name}
                onChange={(e) => setPassengerA({ ...passengerA, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none focus:ring-1 focus:ring-indigo-500/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Class */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Class</label>
                <select
                  value={passengerA.pclass}
                  onChange={(e) => setPassengerA({ ...passengerA, pclass: parseInt(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none"
                >
                  <option value={1}>1st Class</option>
                  <option value={2}>2nd Class</option>
                  <option value={3}>3rd Class</option>
                </select>
              </div>

              {/* Sex */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Gender</label>
                <select
                  value={passengerA.sex}
                  onChange={(e) => setPassengerA({ ...passengerA, sex: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Age */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Age</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={passengerA.age}
                  onChange={(e) => setPassengerA({ ...passengerA, age: parseInt(e.target.value) || 20 })}
                  className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none"
                />
              </div>

              {/* SibSp */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Siblings</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={passengerA.sibsp}
                  onChange={(e) => setPassengerA({ ...passengerA, sibsp: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none"
                />
              </div>

              {/* Parch */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Parents</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={passengerA.parch}
                  onChange={(e) => setPassengerA({ ...passengerA, parch: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Fare */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Fare (£)</label>
                <input
                  type="number"
                  step="0.01"
                  value={passengerA.fare}
                  onChange={(e) => setPassengerA({ ...passengerA, fare: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none"
                />
              </div>

              {/* Embarked */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Embarkation</label>
                <select
                  value={passengerA.embarked}
                  onChange={(e) => setPassengerA({ ...passengerA, embarked: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none"
                >
                  <option value="C">Cherbourg</option>
                  <option value="Q">Queenstown</option>
                  <option value="S">Southampton</option>
                </select>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Passenger B Panel */}
        <GlassCard className="p-6 border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-slate-900/40">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xs font-bold">B</span>
            Passenger B Inputs
          </h3>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Passenger Name</label>
              <input
                type="text"
                value={passengerB.name}
                onChange={(e) => setPassengerB({ ...passengerB, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none focus:ring-1 focus:ring-indigo-500/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Class */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Class</label>
                <select
                  value={passengerB.pclass}
                  onChange={(e) => setPassengerB({ ...passengerB, pclass: parseInt(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none"
                >
                  <option value={1}>1st Class</option>
                  <option value={2}>2nd Class</option>
                  <option value={3}>3rd Class</option>
                </select>
              </div>

              {/* Sex */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Gender</label>
                <select
                  value={passengerB.sex}
                  onChange={(e) => setPassengerB({ ...passengerB, sex: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Age */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Age</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={passengerB.age}
                  onChange={(e) => setPassengerB({ ...passengerB, age: parseInt(e.target.value) || 20 })}
                  className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none"
                />
              </div>

              {/* SibSp */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Siblings</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={passengerB.sibsp}
                  onChange={(e) => setPassengerB({ ...passengerB, sibsp: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none"
                />
              </div>

              {/* Parch */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Parents</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={passengerB.parch}
                  onChange={(e) => setPassengerB({ ...passengerB, parch: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Fare */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Fare (£)</label>
                <input
                  type="number"
                  step="0.01"
                  value={passengerB.fare}
                  onChange={(e) => setPassengerB({ ...passengerB, fare: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none"
                />
              </div>

              {/* Embarked */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Embarkation</label>
                <select
                  value={passengerB.embarked}
                  onChange={(e) => setPassengerB({ ...passengerB, embarked: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none"
                >
                  <option value="C">Cherbourg</option>
                  <option value="Q">Queenstown</option>
                  <option value="S">Southampton</option>
                </select>
              </div>
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Actions */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleCompare}
          disabled={loading}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 disabled:opacity-50 transition-all duration-300 flex items-center gap-3 group"
        >
          <Brain className="w-5 h-5" />
          <span>{loading ? 'Executing Comparative Assessment...' : 'Run Comparative Assessment'}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Comparison results */}
      {(resultA && resultB) && (
        <GlassCard className="p-8 border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-slate-900/40 animate-fade-in space-y-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center">
            Survival Assessment Report
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x dark:divide-white/5 divide-slate-200">
            {/* Passenger A Result */}
            <div className="space-y-6 flex flex-col items-center text-center">
              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">{resultA.name || 'Passenger A'}</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Passenger A</span>
              </div>

              {/* Speedometer ring */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="60" stroke="rgba(99, 102, 241, 0.05)" strokeWidth="12" fill="transparent" />
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="60" 
                    stroke="url(#indigoCyanGrad)" 
                    strokeWidth="12" 
                    fill="transparent" 
                    strokeDasharray={377}
                    strokeDashoffset={377 - (377 * probA) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-800 dark:text-white">{probA.toFixed(0)}%</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Probability</span>
                </div>
              </div>

              <div className="space-y-2 w-full max-w-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Classification Outcome</span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5
                  ${resultA.predicted_survived 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }
                `}>
                  {resultA.predicted_survived ? '✓ Predicted to Survive' : '✗ Predicted to Perish'}
                </span>
              </div>
            </div>

            {/* Passenger B Result */}
            <div className="space-y-6 flex flex-col items-center text-center pt-8 md:pt-0 md:pl-8">
              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">{resultB.name || 'Passenger B'}</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Passenger B</span>
              </div>

              {/* Speedometer ring */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="60" stroke="rgba(99, 102, 241, 0.05)" strokeWidth="12" fill="transparent" />
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="60" 
                    stroke="url(#indigoCyanGrad)" 
                    strokeWidth="12" 
                    fill="transparent" 
                    strokeDasharray={377}
                    strokeDashoffset={377 - (377 * probB) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-800 dark:text-white">{probB.toFixed(0)}%</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Probability</span>
                </div>
              </div>

              <div className="space-y-2 w-full max-w-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Classification Outcome</span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5
                  ${resultB.predicted_survived 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }
                `}>
                  {resultB.predicted_survived ? '✓ Predicted to Survive' : '✗ Predicted to Perish'}
                </span>
              </div>
            </div>

          </div>

          {/* Variance Analysis Box */}
          <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl max-w-xl mx-auto text-center text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            {probA > probB ? (
              <p>
                📈 <strong>{passengerA.name}</strong> has a <span className="text-indigo-600 dark:text-cyan-400 font-black">{(probA - probB).toFixed(1)}% higher</span> survival probability compared to <strong>{passengerB.name}</strong>, primarily driven by class and gender socio-demographics.
              </p>
            ) : probB > probA ? (
              <p>
                📈 <strong>{passengerB.name}</strong> has a <span className="text-indigo-600 dark:text-cyan-400 font-black">{(probB - probA).toFixed(1)}% higher</span> survival probability compared to <strong>{passengerA.name}</strong>, primarily driven by class and gender socio-demographics.
              </p>
            ) : (
              <p>
                ⚖️ Both passengers share identical demographic indicators, yielding an equal survival forecast projection.
              </p>
            )}
          </div>

          {/* Color Gradient definitions for SVG */}
          <svg className="absolute w-0 h-0">
            <defs>
              <linearGradient id="indigoCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </GlassCard>
      )}
    </div>
  );
};
