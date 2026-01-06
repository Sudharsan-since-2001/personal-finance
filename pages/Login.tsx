
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Registration successful! Check your email.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0f0f0f] relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none"></div>

      {/* Left Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-[40px] overflow-hidden mb-6 shadow-2xl shadow-amber-500/20 border-2 border-amber-500/30 bg-[#ffb800]">
              <img
                src="/logo.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tighter mb-2">Spend Tracker</h1>
            <p className="text-zinc-500 text-sm font-medium">Simple. Private. Personal.</p>
          </div>

          <div className="glass-card p-2 rounded-[32px]">
            {/* Toggle Tabs */}
            <div className="flex p-1 bg-white/[0.03] rounded-[24px] mb-4">
              <button
                onClick={() => { setIsSignUp(false); setError(null); }}
                className={`flex-1 py-3 text-xs font-bold rounded-2xl transition-all ${!isSignUp ? 'bg-white/10 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-400'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsSignUp(true); setError(null); }}
                className={`flex-1 py-3 text-xs font-bold rounded-2xl transition-all ${isSignUp ? 'bg-white/10 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-400'}`}
              >
                Sign Up
              </button>
            </div>

            <div className="p-8 pt-4">
              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-1">Email Address</label>
                  <input
                    type="email" required
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder:text-zinc-600"
                    placeholder="you@email.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"} required
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder:text-zinc-600"
                      placeholder="••••••••"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-2"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {error && <div className="p-4 text-xs font-bold text-rose-400 bg-rose-500/5 rounded-xl border border-rose-500/10">{error}</div>}
                {message && <div className="p-4 text-xs font-bold text-emerald-400 bg-emerald-500/5 rounded-xl border border-emerald-500/10">{message}</div>}

                <button
                  type="submit" disabled={loading}
                  className="w-full py-4 bg-white text-zinc-950 font-bold rounded-2xl hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Secure Login'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Visual Context */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-[#1a1a1a]/40 border-l border-white/5">
        <div className="max-w-md text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Track Your Wealth in ₹</h2>
          <div className="space-y-8 text-left">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Real-time Tracking</h4>
                <p className="text-zinc-500 text-xs mt-1 leading-relaxed">Instantly see your daily spending trends and stay within your monthly budget goals.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-500 font-bold text-xl">₹</span>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Localized Currency</h4>
                <p className="text-zinc-500 text-xs mt-1 leading-relaxed">All amounts are automatically formatted in Indian Rupees for your convenience.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
