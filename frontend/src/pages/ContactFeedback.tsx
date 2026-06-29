import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { useToast } from '../components/NotificationToast';
import { Mail, MessageSquare, Send, CheckCircle2, User, Linkedin, ExternalLink } from 'lucide-react';

export const ContactFeedback: React.FC = () => {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Field validation states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [msgError, setMsgError] = useState('');

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

  const validateName = (val: string) => {
    if (!val.trim()) {
      setNameError('Full name is required');
      return false;
    }
    if (val.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateMessage = (val: string) => {
    if (!val.trim()) {
      setMsgError('Message body cannot be empty');
      return false;
    }
    if (val.trim().length < 10) {
      setMsgError('Message must be at least 10 characters long');
      return false;
    }
    setMsgError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isMsgValid = validateMessage(message);

    if (!isNameValid || !isEmailValid || !isMsgValid) {
      showToast('Form validation failed. Please check inputs.', 'warning');
      return;
    }

    setIsLoading(true);

    // Simulate API query sending response
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      showToast('Feedback message delivered successfully!', 'success');
    }, 1800);
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
    setIsSubmitted(false);
    setNameError('');
    setEmailError('');
    setMsgError('');
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-indigo-500 dark:text-cyan-400" /> Contact & Feedback
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mt-1">
          Have queries, feedback, or development recommendations? Drop us a message or reach out on LinkedIn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact info cards */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          <div className="p-6 bg-white/60 dark:bg-slate-900/40 rounded-2xl border dark:border-white/5 border-slate-200/50 flex flex-col justify-between flex-1">
            <div className="flex items-center gap-3 text-indigo-600 dark:text-cyan-400">
              <Linkedin className="w-6 h-6" />
              <span className="font-bold text-slate-800 dark:text-white text-sm">LinkedIn Profile</span>
            </div>
            <a 
              href="https://www.linkedin.com/in/sri-harsha-sarma-duvvuri"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-500 font-bold hover:underline inline-flex items-center gap-1.5 self-start mt-4"
            >
              Connect Online <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-6 bg-white/60 dark:bg-slate-900/40 rounded-2xl border dark:border-white/5 border-slate-200/50 flex flex-col justify-between flex-1">
            <div className="flex items-center gap-3 text-indigo-600 dark:text-cyan-400">
              <Mail className="w-6 h-6" />
              <span className="font-bold text-slate-800 dark:text-white text-sm">Developer Email</span>
            </div>
            <a 
              href="mailto:sriharshasarmaduvvuri@gmail.com"
              className="text-xs text-indigo-500 font-bold hover:underline inline-flex items-center gap-1.5 self-start mt-4"
            >
              Send Direct Email <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Feedback form */}
        <GlassCard className="lg:col-span-2 p-8 border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-slate-900/40 relative">
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center text-center py-16 animate-fade-in">
              <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 mb-4 animate-bounce-slow">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Message Dispatched!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mb-8 leading-relaxed">
                Thank you for reaching out. Your feedback has been recorded and the team will get in touch shortly.
              </p>
              <button
                onClick={handleResetForm}
                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Send Feedback Message</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); if (nameError) validateName(e.target.value); }}
                      onBlur={() => validateName(name)}
                      placeholder="Your Name"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none focus:ring-1 focus:ring-indigo-500/30"
                    />
                  </div>
                  {nameError && <p className="text-[10px] text-rose-500 font-semibold">{nameError}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (emailError) validateEmail(e.target.value); }}
                      onBlur={() => validateEmail(email)}
                      placeholder="Your Email"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none focus:ring-1 focus:ring-indigo-500/30"
                    />
                  </div>
                  {emailError && <p className="text-[10px] text-rose-500 font-semibold">{emailError}</p>}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Message Body</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); if (msgError) validateMessage(e.target.value); }}
                  onBlur={() => validateMessage(message)}
                  placeholder="Share your recommendations or feature requests here..."
                  className="w-full p-4 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none focus:ring-1 focus:ring-indigo-500/30 resize-none"
                />
                {msgError && <p className="text-[10px] text-rose-500 font-semibold">{msgError}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/25 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

            </form>
          )}
        </GlassCard>
      </div>

    </div>
  );
};
