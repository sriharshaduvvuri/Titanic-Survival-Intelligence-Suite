import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { Ship, Info, Server, Cpu, BarChart3, Database, ArrowDown, Activity } from 'lucide-react';

export const AboutProject: React.FC = () => {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <Info className="w-8 h-8 text-indigo-500 dark:text-cyan-400" /> About the Suite
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
          An enterprise-grade full-stack machine learning web application that combines historical demographic analytics, Explainable AI (XAI), and real-time inference wrappers.
        </p>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Problem Statement Card */}
        <GlassCard className="p-6 border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-slate-900/40">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-4">
            <Ship className="w-5 h-5 text-indigo-500 dark:text-cyan-400" /> Problem Statement
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <p>
              On April 15, 1912, the widely considered "unsinkable" RMS Titanic sank after colliding with an iceberg. Unfortunately, there were not enough lifeboats for everyone on board, resulting in the death of 1,502 out of 2,224 passengers and crew.
            </p>
            <p>
              While there was some element of luck involved in surviving, some groups of people were more likely to survive than others, such as women, children, and the upper-class.
            </p>
            <p className="font-semibold text-indigo-600 dark:text-cyan-400">
              The Goal: Build a predictive classifier that determines the survival probability of individual passengers based on demographic inputs, ticketing characteristics, and familial variables.
            </p>
          </div>
        </GlassCard>

        {/* Dataset Overview Card */}
        <GlassCard className="p-6 border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-slate-900/40">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-indigo-500 dark:text-cyan-400" /> Dataset Overview
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-slate-100/50 dark:bg-white/5 rounded-xl border dark:border-white/5 border-slate-200/50">
                <span className="block text-xs text-slate-400 uppercase font-semibold">Source</span>
                <span className="font-bold text-slate-800 dark:text-white">Kaggle / Dojo</span>
              </div>
              <div className="p-3 bg-slate-100/50 dark:bg-white/5 rounded-xl border dark:border-white/5 border-slate-200/50">
                <span className="block text-xs text-slate-400 uppercase font-semibold">Total Rows</span>
                <span className="font-bold text-slate-800 dark:text-white">891 Passengers</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="block text-xs text-slate-400 uppercase font-semibold">Independent Variables</span>
              <div className="flex flex-wrap gap-2">
                {['Pclass (Class)', 'Sex (Gender)', 'Age', 'SibSp (Siblings)', 'Parch (Parents)', 'Fare (Ticket Price)', 'Embarked (Port)'].map((feat) => (
                  <span key={feat} className="px-2.5 py-1 text-xs rounded-lg bg-indigo-500/10 dark:bg-cyan-500/10 border border-indigo-500/20 dark:border-cyan-500/20 text-indigo-600 dark:text-cyan-400 font-medium">
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-xs text-slate-400 uppercase font-semibold">Target Variable</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                Survived (0 = Deceased, 1 = Survived)
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Machine Learning Pipeline Card */}
        <GlassCard className="p-6 border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-slate-900/40">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-4">
            <Cpu className="w-5 h-5 text-indigo-500 dark:text-cyan-400" /> Training Pipeline
          </h2>
          <div className="space-y-3.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <p>
              The system relies on binary classifiers built on top of Scikit-Learn and XGBoost.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="p-1 rounded bg-indigo-500/10 dark:bg-cyan-500/10 text-indigo-500 dark:text-cyan-400 text-xs font-bold mt-0.5">1</span>
                <span><strong>Preprocessing:</strong> Null demographic values (Age, Embarked) are imputed using class-based medians. Sex and Embarked attributes undergo categorical Encoding.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="p-1 rounded bg-indigo-500/10 dark:bg-cyan-500/10 text-indigo-500 dark:text-cyan-400 text-xs font-bold mt-0.5">2</span>
                <span><strong>Algorithms:</strong> An ensemble model fits a <strong>Random Forest Classifier</strong> (with entropy split rules) alongside a gradient-boosted <strong>XGBoost Regressor</strong> wrapper.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="p-1 rounded bg-indigo-500/10 dark:bg-cyan-500/10 text-indigo-500 dark:text-cyan-400 text-xs font-bold mt-0.5">3</span>
                <span><strong>Inference:</strong> Individual passenger records are normalized and queried to fetch relative logits, converting classifier weights into survival probabilities.</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Model Performance Card */}
        <GlassCard className="p-6 border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-slate-900/40">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-500 dark:text-cyan-400" /> Model Performance
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Accuracy', value: '83.2%', color: 'from-emerald-500 to-teal-500' },
              { label: 'Precision', value: '81.5%', color: 'from-indigo-500 to-indigo-600' },
              { label: 'Recall', value: '78.4%', color: 'from-cyan-500 to-blue-500' },
              { label: 'F1 Score', value: '79.9%', color: 'from-violet-500 to-purple-500' }
            ].map((metric) => (
              <div key={metric.label} className="p-4 bg-slate-100/50 dark:bg-white/5 rounded-xl border dark:border-white/5 border-slate-200/50 flex flex-col justify-between">
                <span className="text-xs text-slate-400 uppercase font-semibold">{metric.label}</span>
                <span className={`text-2xl font-black bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>

      {/* Architecture Flow Chart Section */}
      <GlassCard className="p-8 border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-slate-900/40">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-8 justify-center">
          <Server className="w-5 h-5 text-indigo-500 dark:text-cyan-400" /> Technical Architecture Flow
        </h2>
        
        <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
          {/* Step 1: Frontend */}
          <div className="flex flex-col md:flex-row items-center w-full justify-between gap-4">
            <div className="flex-1 p-4 bg-slate-100/70 dark:bg-white/5 rounded-2xl border dark:border-white/5 border-slate-200 flex items-center gap-4 shadow-sm w-full md:w-auto">
              <div className="p-3.5 rounded-xl bg-indigo-500/10 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs font-bold text-indigo-500 uppercase">1. Client Layer</span>
                <span className="font-bold text-slate-800 dark:text-white text-sm">React Frontend (Vite)</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Captures client inputs, triggers REST Axios calls</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-slate-400 rotate-90 md:rotate-0 flex-shrink-0">
              <ArrowDown className="w-6 h-6 md:-rotate-90 text-indigo-500/50" />
            </div>

            {/* Step 2: API */}
            <div className="flex-1 p-4 bg-slate-100/70 dark:bg-white/5 rounded-2xl border dark:border-white/5 border-slate-200 flex items-center gap-4 shadow-sm w-full md:w-auto">
              <div className="p-3.5 rounded-xl bg-indigo-500/10 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs font-bold text-indigo-500 uppercase">2. API Gateways</span>
                <span className="font-bold text-slate-800 dark:text-white text-sm">FastAPI REST Server</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Rate limiting, session checks, routers payload validation</p>
              </div>
            </div>
          </div>

          <ArrowDown className="w-6 h-6 text-indigo-500/50" />

          {/* Step 3: ML Model */}
          <div className="p-4 bg-slate-100/70 dark:bg-white/5 rounded-2xl border dark:border-white/5 border-slate-200 flex items-center gap-4 shadow-sm max-w-md w-full">
            <div className="p-3.5 rounded-xl bg-indigo-500/10 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs font-bold text-indigo-500 uppercase">3. Inference Engines</span>
              <span className="font-bold text-slate-800 dark:text-white text-sm">Random Forest & XGBoost Estimators</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Calculates logits, survival probabilities & SHAP values</p>
            </div>
          </div>

          <ArrowDown className="w-6 h-6 text-indigo-500/50" />

          {/* Step 4: Analytics and Reports */}
          <div className="flex flex-col md:flex-row items-center w-full justify-between gap-4">
            <div className="flex-1 p-4 bg-slate-100/70 dark:bg-white/5 rounded-2xl border dark:border-white/5 border-slate-200 flex items-center gap-4 shadow-sm w-full md:w-auto">
              <div className="p-3.5 rounded-xl bg-indigo-500/10 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs font-bold text-indigo-500 uppercase">4a. Dashboard Metrics</span>
                <span className="font-bold text-slate-800 dark:text-white text-sm">Interactive Analytics Lab</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Renders Recharts curves and demographic summaries</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-slate-400 rotate-90 md:rotate-0 flex-shrink-0">
              <ArrowDown className="w-6 h-6 md:-rotate-90 text-indigo-500/50" style={{ transform: 'rotate(180deg)' }} />
            </div>

            <div className="flex-1 p-4 bg-slate-100/70 dark:bg-white/5 rounded-2xl border dark:border-white/5 border-slate-200 flex items-center gap-4 shadow-sm w-full md:w-auto">
              <div className="p-3.5 rounded-xl bg-indigo-500/10 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs font-bold text-indigo-500 uppercase">4b. Audits & Archives</span>
                <span className="font-bold text-slate-800 dark:text-white text-sm">System Reports Center</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Executes Helvetica-styled PDFs & CSV prediction logs</p>
              </div>
            </div>
          </div>

        </div>
      </GlassCard>
    </div>
  );
};
