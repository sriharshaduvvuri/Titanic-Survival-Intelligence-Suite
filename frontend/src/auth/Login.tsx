import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Ship, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useToast } from '../components/NotificationToast';
import { authApi } from '../api';
import { setStoredToken, setStoredUser } from '../utils/session';

interface LoginProps {
  onAuthSuccess: (user: any, token: string) => void;
  onBack: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export const Login: React.FC<LoginProps> = ({ onAuthSuccess, onBack }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Field validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  const { showToast } = useToast();

  const validateEmail = (val: string) => {
    if (!val) {
      setEmailError('Email address is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (val: string) => {
    if (mode === 'forgot') return true;
    if (!val) {
      setPasswordError('Password is required');
      return false;
    }
    if (val.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateName = (val: string) => {
    if (mode !== 'register') return true;
    if (!val) {
      setNameError('Full name is required');
      return false;
    }
    if (val.trim().length < 2) {
      setNameError('Full name must be at least 2 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError) validateEmail(val);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (passwordError) validatePassword(val);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFullName(val);
    if (nameError) validateName(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isNameValid = validateName(fullName);

    if (!isEmailValid || !isPasswordValid || !isNameValid) {
      showToast('Please correct validation errors first.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        const res = await authApi.login({ email, password });
        setStoredToken(res.access_token);
        setStoredUser(res.user);
        showToast(`Welcome back, ${res.user.full_name || 'User'}!`, 'success');
        onAuthSuccess(res.user, res.access_token);
      } else if (mode === 'register') {
        const res = await authApi.register({ email, password, full_name: fullName });
        setStoredToken(res.access_token);
        setStoredUser(res.user);
        showToast('Registration successful! Welcome to the suite.', 'success');
        onAuthSuccess(res.user, res.access_token);
      } else if (mode === 'forgot') {
        await authApi.forgotPassword(email);
        showToast('Reset directions dispatched successfully!', 'success');
        setMode('login');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Authentication operation failed. Please check your credentials.';
      showToast(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-6 relative transition-colors duration-300">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-[100px] animate-pulse-slow" style={{ animationDelay: '3s' }} />

      <div className="max-w-md w-full relative z-10">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white mb-8 text-sm font-semibold transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Home
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-xl shadow-indigo-500/10 mb-4 animate-bounce-slow">
            <Ship className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white font-sans">
            {mode === 'login' && 'Sign In to Titanic Suite'}
            {mode === 'register' && 'Create Intelligence Account'}
            {mode === 'forgot' && 'Reset Access Password'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 leading-relaxed max-w-sm mx-auto">
            {mode === 'login' && 'Access model weights, patient diagnostic factors, and predictions history.'}
            {mode === 'register' && 'Sign up to register predictive queries and generate diagnostic reports.'}
            {mode === 'forgot' && 'Provide your registered email address for reset instructions.'}
          </p>
        </div>

        <GlassCard className="p-8 border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-900/40 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name field (Register Mode Only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={fullName}
                    onChange={handleNameChange}
                    onBlur={() => validateName(fullName)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white focus:ring-1 outline-none transition-all duration-200
                      ${nameError 
                        ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' 
                        : 'border-slate-200 dark:border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/30'}`}
                  />
                </div>
                {nameError && (
                  <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {nameError}
                  </p>
                )}
              </div>
            )}

            {/* Email Address Field */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => validateEmail(email)}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white focus:ring-1 outline-none transition-all duration-200
                    ${emailError 
                      ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' 
                      : 'border-slate-200 dark:border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/30'}`}
                />
              </div>
              {emailError && (
                <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Password</label>
                  {mode === 'login' && (
                    <button 
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setEmailError('');
                        setPasswordError('');
                      }}
                      className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-cyan-400 dark:hover:text-cyan-300 font-bold transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder=""
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => validatePassword(password)}
                    className={`w-full pl-11 pr-11 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white focus:ring-1 outline-none transition-all duration-200
                      ${passwordError 
                        ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' 
                        : 'border-slate-200 dark:border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/30'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {passwordError}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/25 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : mode === 'register' ? 'Register Account' : 'Send Instructions'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switchers */}
          <div className="mt-6 text-center border-t border-slate-100 dark:border-white/5 pt-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {mode === 'login' && (
              <span>
                Don't have an account?{' '}
                <button 
                  onClick={() => {
                    setMode('register');
                    setEmailError('');
                    setPasswordError('');
                  }} 
                  className="text-indigo-500 hover:text-indigo-600 dark:text-cyan-400 dark:hover:text-cyan-300 font-extrabold"
                >
                  Create one
                </button>
              </span>
            )}
            {mode === 'register' && (
              <span>
                Already have an account?{' '}
                <button 
                  onClick={() => {
                    setMode('login');
                    setEmailError('');
                    setPasswordError('');
                  }} 
                  className="text-indigo-500 hover:text-indigo-600 dark:text-cyan-400 dark:hover:text-cyan-300 font-extrabold"
                >
                  Sign In
                </button>
              </span>
            )}
            {mode === 'forgot' && (
              <button 
                onClick={() => {
                  setMode('login');
                  setEmailError('');
                  setPasswordError('');
                }} 
                className="text-indigo-500 hover:text-indigo-600 dark:text-cyan-400 dark:hover:text-cyan-300 font-extrabold"
              >
                Return to Sign In
              </button>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
