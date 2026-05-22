import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { authService } from '../services/api';

export default function LoginView({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await authService.login(username, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLoginSuccess(data.token, data.user);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login yoki parol noto\'g\'ri');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950 overflow-hidden select-none">
      {/* Decorative Floating Blurred Spheres (Sonoma Style) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[80px] pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <div className="relative w-full max-w-[440px] glass-modal rounded-3xl border border-white/20 p-8 md:p-10 shadow-2xl animate-zoomIn">
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative w-20 h-20 mb-4 rounded-3xl overflow-hidden border border-white/40 shadow-md">
            <img 
              src="/logo.jpg" 
              alt="ASR Logo" 
              className="w-full h-full object-cover"
            />
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </div>
          
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
            ASR TRACKER
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Delivery & Debt Control
          </p>
        </div>

        {/* Localized Error alert */}
        {error && (
          <div className="flex items-center gap-3 p-3.5 mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-700 rounded-xl text-sm font-semibold animate-slideUp">
            <AlertCircle className="w-5 h-5 flex-shrink-0 stroke-[2.2]" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
              Foydalanuvchi nomi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4.5 h-4.5 stroke-[2] mr-2" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Samandar"
                className="w-full apple-input !pl-11 text-slate-800 font-medium placeholder-slate-400"
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
              Parol
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4.5 h-4.5 stroke-[2] mr-2" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full apple-input !pl-11 !pr-11 text-slate-800 font-medium placeholder-slate-400"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-650 cursor-pointer"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5 stroke-[2]" /> : <Eye className="w-4.5 h-4.5 stroke-[2]" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full apple-btn-primary flex items-center justify-center gap-2.5 py-3.5 mt-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed text-sm font-semibold select-none"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Tizimga kirilmoqda...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4.5 h-4.5 stroke-[2.2]" />
                <span>Tizimga kirish</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          © 2026 ASR Delivery
        </div>
      </div>
    </div>
  );
}
