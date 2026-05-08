import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  User as UserIcon, 
  ChevronRight, 
  ShieldCheck,
  Activity,
  Cpu,
  Database
} from 'lucide-react';
import { USER_CREDENTIALS, INDUSTRIAL_ASSETS } from '../constants';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bgImage, setBgImage] = useState(INDUSTRIAL_ASSETS[0]);

  useEffect(() => {
    // Cycle backgrounds subtly on mount
    const interval = setInterval(() => {
      setBgImage(INDUSTRIAL_ASSETS[Math.floor(Math.random() * INDUSTRIAL_ASSETS.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      const userFound = USER_CREDENTIALS[username];
      if (userFound && userFound.pass === password) {
        onLogin({ username, role: userFound.role });
      } else {
        setError('Verification Failed: Access Denied to Node.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans overflow-hidden relative">
      {/* Cinematic Dark Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="w-full h-full"
        >
          <img 
            src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=2000" 
            alt="Infrastructure" 
            className="w-full h-full object-cover grayscale brightness-50"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-transparent" />
      </div>

      {/* Industrial Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg mx-4 z-10"
      >
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 lg:p-14 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-teal-500/20" />
          
          <div className="flex flex-col items-center mb-12 text-center">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center p-5 mb-8 shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-teal-500/20 blur-2xl opacity-0 hover:opacity-100 transition-opacity" />
              <img src="https://i.ibb.co/KxMxh3Hw/logo.png" alt="Logo" className="w-full h-full object-contain relative z-10" />
            </motion.div>
            <h1 className="text-4xl font-black text-white tracking-widest uppercase leading-none">YAJUR</h1>
            <div className={`h-1.5 w-32 bg-teal-500 mt-4 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.5)]`} />
            <p className="text-[11px] font-bold text-slate-500 tracking-[0.5em] uppercase mt-6 ml-2">Enterprise Node Access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase px-1">Identifier</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-500 group-focus-within:text-teal-400 transition-colors">
                  <UserIcon size={20} />
                </div>
                <input 
                  type="text"
                  required
                  placeholder="USERNAME"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-16 pr-6 py-5 bg-black/50 border border-white/5 rounded-3xl outline-none focus:border-teal-500/40 focus:bg-black/70 transition-all text-white text-sm font-bold tracking-widest placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-teal-400 tracking-[0.3em] uppercase px-1">Protocol Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-500 group-focus-within:text-teal-400 transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-16 pr-6 py-5 bg-black/50 border border-white/5 rounded-3xl outline-none focus:border-teal-500/40 focus:bg-black/70 transition-all text-white text-sm font-bold tracking-widest placeholder:text-slate-700"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-5 rounded-2xl text-xs font-bold tracking-wide flex items-center gap-4"
                >
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={isLoading}
              className="group relative w-full overflow-hidden py-5 bg-teal-600 text-white rounded-[2rem] font-black text-xs tracking-[0.3em] uppercase hover:bg-teal-500 transition-all shadow-[0_15px_60px_-10px_rgba(20,184,166,0.4)] flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>Enter Control Hub <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
          
          <div className="mt-16 text-center">
            <p className="text-[10px] font-black text-slate-700 tracking-[0.5em] uppercase">Private Infrastructure // Security Level 4 // 2026</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
