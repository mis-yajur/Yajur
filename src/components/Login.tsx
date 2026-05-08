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
    <div className="min-h-screen bg-white flex items-center justify-center font-sans">
      <div className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center p-3 mb-6 shadow-xl">
            <img src="https://i.ibb.co/KxMxh3Hw/logo.png" alt="Logo" className="w-full h-full object-contain invert" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-widest uppercase">Yajur Fibres</h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase mt-1">Enterprise Gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 tracking-widest uppercase px-1">Node Identifier</label>
            <input 
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-all text-sm font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 tracking-widest uppercase px-1">Access Key</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-all text-sm font-semibold"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 text-rose-600 p-3 rounded-xl text-[10px] font-bold tracking-wide text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            disabled={isLoading}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-xs tracking-widest uppercase hover:bg-blue-600 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Authenticate'}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[9px] font-bold text-slate-300 tracking-widest uppercase">Centralized Control Grid © 2026</p>
        </div>
      </div>
    </div>
  );
};
