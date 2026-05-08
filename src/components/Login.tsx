import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Lock, 
  User as UserIcon, 
  ChevronRight, 
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { USER_CREDENTIALS } from '../constants';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      const userFound = USER_CREDENTIALS[username];
      if (userFound && userFound.pass === password) {
        onLogin({ username, role: userFound.role });
      } else {
        setError('Authentication failed. Check credentials.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-[0_32px_64px_-24px_rgba(0,0,0,0.1)] border border-slate-100"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center p-4 mb-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src="https://i.ibb.co/KxMxh3Hw/logo.png" alt="Logo" className="w-full h-full object-contain relative z-10" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Yajur Fibres</h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.4em] uppercase mt-2">Enterprise Resource Gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase px-1">Node Identifier</label>
            <input 
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-50 transition-all text-sm font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase px-1">Security Key</label>
            <input 
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-50 transition-all text-sm font-semibold"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-rose-50 text-rose-600 p-3 rounded-xl text-[10px] font-bold tracking-wide text-center overflow-hidden"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            disabled={isLoading}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-teal-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Initialize Session'
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[9px] font-bold text-slate-300 tracking-[0.2em] uppercase">Centralized Infrastructure © 2026</p>
        </div>
      </motion.div>
    </div>
  );
};
