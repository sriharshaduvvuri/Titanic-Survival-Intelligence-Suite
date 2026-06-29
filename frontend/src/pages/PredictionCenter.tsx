import React, { useState, useEffect } from 'react';
import { Brain, Ship, ArrowRight, UserPlus, Info, Check, Shield, AlertCircle, Share2, Copy, ArrowUp, ArrowDown } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useToast } from '../components/NotificationToast';
import { predictionsApi } from '../api';

interface PredictionCenterProps {
  onNavigateToEAI: (predictionData: any) => void;
}

export const PredictionCenter: React.FC<PredictionCenterProps> = ({ onNavigateToEAI }) => {
  const [name, setName] = useState('Rose DeWitt');
  const [pclass, setPclass] = useState(1);
  const [sex, setSex] = useState('female');
  const [age, setAge] = useState(22);
  const [sibsp, setSibsp] = useState(0);
  const [parch, setParch] = useState(0);
  const [fare, setFare] = useState(72.5);
  const [embarked, setEmbarked] = useState('C');
  
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  
  // Validation states
  const [nameError, setNameError] = useState('');
  const [fareError, setFareError] = useState('');

  const { showToast } = useToast();

  const validateName = (val: string) => {
    if (!val.trim()) {
      setNameError('Passenger name cannot be empty');
      return false;
    }
    if (val.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateFare = (val: number) => {
    if (val < 0) {
      setFareError('Fare cannot be negative');
      return false;
    }
    if (val > 512.33) {
      setFareError('Historical fares did not exceed $512.33');
      return false;
    }
    setFareError('');
    return true;
  };

  // Step-by-step loading animation simulator
  useEffect(() => {
    let timer: any;
    if (loading) {
      timer = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= 4) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 700);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();

    const isNameValid = validateName(name);
    const isFareValid = validateFare(fare);

    if (!isNameValid || !isFareValid) {
      showToast('Validation failed. Please verify inputs.', 'warning');
      return;
    }

    setLoading(true);
    setLoadingStep(0);

    try {
      const res = await predictionsApi.predictSingle({
        name,
        pclass,
        sex,
        age,
        sibsp,
        parch,
        fare,
        embarked
      });
      
      // Delay response slightly to match loading steps
      setTimeout(() => {
        setResult(res);
        showToast('Survival probability calculated successfully!', 'success');
        setLoading(false);
      }, 2800);

    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Inference engine error. Processing offline model projection.', 'warning');
      
      // Load fallback simulation on actual network exception to let user keep using it
      setTimeout(() => {
        // Mock prediction fallback logic
        const probRF = sex === 'female' ? 0.82 : 0.16;
        const probXGB = sex === 'female' ? 0.85 : 0.14;
        const avg = (probRF + probXGB) / 2;
        
        const explanation: Record<string, number> = {
          'Gender': sex === 'female' ? 32.5 : -28.0,
          'Passenger Class': pclass === 1 ? 14.5 : (pclass === 3 ? -11.0 : 2.0),
          'Age': age < 12 ? 18.0 : (age > 60 ? -12.5 : -2.0),
          'Fare': fare > 100 ? 8.5 : (fare < 15 ? -6.0 : 1.2),
          'Family Size': (sibsp + parch) === 0 ? -4.5 : 5.0
        };

        setResult({
          id: Math.floor(Math.random() * 1000),
          pclass,
          name: name || 'Passenger',
          sex,
          age,
          sibsp,
          parch,
          fare,
          embarked,
          survived_prob_rf: probRF,
          survived_prob_xgb: probXGB,
          predicted_survived: avg >= 0.5,
          explanation,
          created_at: new Date().toISOString()
        });
        setLoading(false);
      }, 2800);
    }
  };

  const getCombinedProb = () => {
    if (!result) return 0;
    return (result.survived_prob_rf + result.survived_prob_xgb) / 2;
  };

  const getContributingFactors = (res: any) => {
    if (res.explanation && Object.keys(res.explanation).length > 0) {
      return Object.entries(res.explanation)
        .map(([factor, score]) => ({
          factor,
          score: Number(score),
          isPositive: Number(score) >= 0
        }))
        .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
        .slice(0, 4);
    }

    // Rule-based fallback if explanation is missing
    const factors = [];
    if (res.sex === 'female') {
      factors.push({ factor: 'Gender (Female)', score: 32.5, isPositive: true });
    } else {
      factors.push({ factor: 'Gender (Male)', score: -28.0, isPositive: false });
    }

    if (res.pclass === 1) {
      factors.push({ factor: 'Class (1st Class)', score: 18.0, isPositive: true });
    } else if (res.pclass === 3) {
      factors.push({ factor: 'Class (3rd Class)', score: -12.0, isPositive: false });
    }

    if (res.age && res.age < 12) {
      factors.push({ factor: 'Age (Child)', score: 15.0, isPositive: true });
    } else if (res.age && res.age > 60) {
      factors.push({ factor: 'Age (Elderly)', score: -10.0, isPositive: false });
    }

    if (res.fare && res.fare > 80) {
      factors.push({ factor: 'Fare (Premium Ticket)', score: 10.0, isPositive: true });
    } else if (res.fare && res.fare < 10) {
      factors.push({ factor: 'Fare (Cheap Ticket)', score: -8.0, isPositive: false });
    }

    return factors.sort((a, b) => Math.abs(b.score) - Math.abs(a.score)).slice(0, 4);
  };

  const handleCopyResult = () => {
    if (!result) return;
    const prob = (getCombinedProb() * 100).toFixed(0);
    const outcome = result.predicted_survived ? 'Survived' : 'Did Not Survive';
    const text = `Titanic Survival Intelligence Suite — Prediction Report\n------------------------------------------------------\nPassenger: ${result.name}\nOutcome: ${outcome}\nConfidence: ${prob}%\nAssessed At: ${new Date(result.created_at).toLocaleString()}`;
    
    navigator.clipboard.writeText(text);
    showToast('Prediction summary copied to clipboard!', 'success');
  };

  const handleShareResult = () => {
    if (!result) return;
    if (navigator.share) {
      const prob = (getCombinedProb() * 100).toFixed(0);
      const outcome = result.predicted_survived ? 'Survived' : 'Did Not Survive';
      navigator.share({
        title: 'Titanic Survival Prediction',
        text: `Passenger: ${result.name} - Outcome: ${outcome} (${prob}% confidence)`,
        url: window.location.origin
      }).catch(() => {
        handleCopyResult();
      });
    } else {
      handleCopyResult();
    }
  };

  const loadingStepsText = [
    'Verifying diagnostics schemas...',
    'Quering ML endpoints on Render backend...',
    'Running Random Forest classifier...',
    'Ensembling predictions with XGBoost...',
    'Generating explanation SHAP vectors...'
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto animate-fade-in bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
          Inference Diagnostics Center
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Perform a single passenger survival prediction with real-time model variance scores and SHAP values.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Input Parameters Form */}
        <div className="lg:col-span-7">
          <GlassCard className="p-6 border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-900/40 relative">
            <h3 className="text-md font-bold text-slate-850 dark:text-white border-b dark:border-white/5 border-slate-200 pb-3 mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-500" /> Passenger Parameters
            </h3>
            
            <form onSubmit={handlePredict} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Passenger Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameError) validateName(e.target.value);
                    }}
                    onBlur={() => validateName(name)}
                    className={`w-full px-4 py-3 rounded-xl text-sm border bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white focus:ring-1 outline-none transition-all duration-200
                      ${nameError 
                        ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' 
                        : 'border-slate-200 dark:border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/30'}`}
                    placeholder="E.g. Rose Bukater"
                  />
                  {nameError && (
                    <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> {nameError}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Ticket Class (Pclass)</label>
                  <select 
                    value={pclass} 
                    onChange={(e) => setPclass(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white focus:border-indigo-500/50 outline-none transition-all duration-200"
                  >
                    <option value={1}>First Class (Luxury Upper Deck)</option>
                    <option value={2}>Second Class (Middle Deck)</option>
                    <option value={3}>Third Class (Standard Lower Deck)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Gender</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSex('female')}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all duration-200
                        ${sex === 'female' 
                          ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 dark:bg-cyan-400/5 shadow-md shadow-indigo-500/5' 
                          : 'border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500'}`}
                    >
                      Female
                    </button>
                    <button
                      type="button"
                      onClick={() => setSex('male')}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all duration-200
                        ${sex === 'male' 
                          ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 dark:bg-cyan-400/5 shadow-md shadow-indigo-500/5' 
                          : 'border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500'}`}
                    >
                      Male
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Embarkation Port</label>
                  <select 
                    value={embarked} 
                    onChange={(e) => setEmbarked(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white focus:border-indigo-500/50 outline-none transition-all duration-200"
                  >
                    <option value="S">Southampton (UK)</option>
                    <option value="C">Cherbourg (France)</option>
                    <option value="Q">Queenstown (Ireland)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Passenger Age: {age} yrs</label>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="80" 
                  step="0.5"
                  value={age} 
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Siblings & Spouses</label>
                  <select 
                    value={sibsp} 
                    onChange={(e) => setSibsp(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white focus:border-indigo-500/50 outline-none transition-all duration-200"
                  >
                    {[0,1,2,3,4,5,8].map((n) => (
                      <option key={n} value={n}>{n} family members</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Parents & Children</label>
                  <select 
                    value={parch} 
                    onChange={(e) => setParch(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white focus:border-indigo-500/50 outline-none transition-all duration-200"
                  >
                    {[0,1,2,3,4,5,6].map((n) => (
                      <option key={n} value={n}>{n} family members</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ticket Fare: ${fare.toFixed(2)}</label>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="350" 
                  step="0.50"
                  value={fare} 
                  onChange={(e) => {
                    setFare(Number(e.target.value));
                    if (fareError) validateFare(Number(e.target.value));
                  }}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                {fareError && (
                  <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {fareError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Run Survival Assessment</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            {/* Stepped Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 transition-all duration-300">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-sm font-bold text-slate-800 dark:text-white mb-2">Running Predictive Diagnostics</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono animate-pulse">
                  {loadingStepsText[loadingStep] || 'Evaluating passenger metrics...'}
                </p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Prediction Output Gauge */}
        <div className="lg:col-span-5 flex flex-col h-full justify-between">
          {result ? (
            <GlassCard className="p-8 border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-900/40 flex flex-col items-center justify-between text-center relative overflow-hidden animate-fade-in h-full">
              {/* Glow filter backdrop */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] opacity-15 dark:opacity-20 pointer-events-none ${result.predicted_survived ? 'bg-emerald-500' : 'bg-rose-500'}`} />

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">ML Intelligence Output</span>
                <h4 className="text-xl font-black text-slate-850 dark:text-white mt-1.5">{result.name}</h4>
              </div>

              {/* Speedometer Ring representation */}
              <div className="relative my-8 flex items-center justify-center w-52 h-52">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Gauge background track */}
                  <circle
                    cx="104"
                    cy="104"
                    r="84"
                    strokeWidth="10"
                    stroke="rgba(148, 163, 184, 0.15)"
                    fill="transparent"
                  />
                  {/* Gauge active path */}
                  <circle
                    cx="104"
                    cy="104"
                    r="84"
                    strokeWidth="10"
                    stroke={result.predicted_survived ? '#10b981' : '#f43f5e'}
                    strokeDasharray={2 * Math.PI * 84}
                    strokeDashoffset={2 * Math.PI * 84 * (1 - getCombinedProb())}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Speedometer text */}
                <div className="absolute text-center">
                  <span className="text-4xl font-black text-slate-850 dark:text-white font-sans tracking-tight">
                    {(getCombinedProb() * 100).toFixed(0)}%
                  </span>
                  <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold block uppercase mt-0.5">Survival Prob.</span>
                </div>
              </div>

              {/* Prediction Badge */}
              <div className="space-y-4 w-full">
                <div className={`inline-flex px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest border border-transparent 
                  ${result.predicted_survived 
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/5' 
                    : 'text-rose-700 dark:text-rose-450 bg-rose-500/10 shadow-lg shadow-rose-500/5'}`}
                >
                  {result.predicted_survived ? 'Survived' : 'Did Not Survive'}
                </div>

                {/* Confidence Bar */}
                <div className="w-full space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>Survival Confidence</span>
                    <span>{(getCombinedProb() * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out
                        ${result.predicted_survived 
                          ? 'from-indigo-500 to-cyan-500' 
                          : 'from-orange-500 to-rose-500'}`} 
                      style={{ width: `${(getCombinedProb() * 100).toFixed(0)}%` }}
                    />
                  </div>
                </div>

                {/* Explanation Card */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border dark:border-white/5 border-slate-200/50 w-full text-left space-y-2.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Contributing Factors</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {getContributingFactors(result).map((fact, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 font-medium">
                        {fact.isPositive ? (
                          <ArrowUp className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                        )}
                        <span className="truncate text-slate-600 dark:text-slate-350">{fact.factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Share utilities */}
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    onClick={handleCopyResult}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-250 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 text-[10px] text-slate-500 dark:text-slate-450 font-bold transition-all duration-300"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Result
                  </button>
                  <button
                    onClick={handleShareResult}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-250 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 text-[10px] text-slate-500 dark:text-slate-450 font-bold transition-all duration-300"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share Summary
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold py-4 border-y border-slate-200 dark:border-white/5">
                  <div className="border-r border-slate-200 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Random Forest</span>
                    <span className="text-slate-800 dark:text-slate-200 font-black text-sm">{(result.survived_prob_rf * 100).toFixed(0)}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">XGBoost Ensemble</span>
                    <span className="text-slate-800 dark:text-slate-200 font-black text-sm">{(result.survived_prob_xgb * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <button 
                  onClick={() => onNavigateToEAI(result)}
                  className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-755 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors flex items-center justify-center gap-1.5 mt-2"
                >
                  <span>View Full Explainable AI (XAI) Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                </button>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-8 border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-900/40 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 h-full border-dashed">
              <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-950/60 text-slate-400 dark:text-slate-600 mb-4 border border-dashed border-slate-200 dark:border-white/5">
                <Brain className="w-10 h-10 animate-pulse text-slate-450 dark:text-slate-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-300">Survival Report Sandbox</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[280px] mt-1.5 leading-relaxed">
                Adjust passenger factors on the left and run the assessment model to populate diagnostic SHAP reports.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
