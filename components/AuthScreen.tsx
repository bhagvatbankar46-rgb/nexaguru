
import React, { useState } from 'react';
import { Crown, Mail, Lock, ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { INITIAL_CREDITS, User } from '../types';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    // Simulate network delay for premium feel
    setTimeout(() => {
      try {
        const usersStr = localStorage.getItem('royal_users');
        const users: Record<string, User> = usersStr ? JSON.parse(usersStr) : {};

        const normalizedEmail = email.toLowerCase().trim();

        if (isLogin) {
          // LOGIN LOGIC
          const user = users[normalizedEmail];
          if (user && user.password === password) {
            onLogin(user);
          } else {
            setError('Invalid email or password.');
            setLoading(false);
          }
        } else {
          // SIGNUP LOGIC
          if (users[normalizedEmail]) {
            setError('User already exists. Please login.');
            setLoading(false);
            return;
          }

          const newUser: User = {
            email: normalizedEmail,
            password: password,
            credits: INITIAL_CREDITS,
            redeemedGift: false
          };

          users[normalizedEmail] = newUser;
          localStorage.setItem('royal_users', JSON.stringify(users));
          onLogin(newUser);
        }
      } catch (err) {
        setError('An unexpected error occurred.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-royal-gold/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
       </div>

      <div className="w-full max-w-md glass-strong p-8 rounded-3xl border border-royal-gold/30 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 animate-in fade-in zoom-in duration-500">
        
        {/* Logo Area */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-royal-gold/10 border border-royal-gold/30 mb-4 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Crown size={32} className="text-royal-gold" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold text-white font-royal tracking-wide mb-1">
            NEXA<span className="text-royal-gold">GURU</span>
          </h1>
          <p className="text-gray-400 text-sm">Premium AI Art Generation</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-black/40 p-1 rounded-xl mb-8 border border-white/10">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
              isLogin ? 'bg-royal-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
              !isLogin ? 'bg-royal-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-royal-gold transition-colors" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-royal-gold/50 transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-royal-gold transition-colors" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-royal-gold/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-in slide-in-from-top-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-royal-gold to-[#F3E5AB] text-black font-bold rounded-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Info */}
        {!isLogin && (
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-royal-gold/80 bg-royal-gold/5 p-3 rounded-lg border border-royal-gold/10">
                <Sparkles size={14} />
                <span>Get 20 Free Credits on Signup</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
