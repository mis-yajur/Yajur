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
        setError('Verification failed. Invalid credentials or node access.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Branding Side - Hidden on mobile */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-20 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#334155_0%,transparent_50%)]" />
          <motion.div 
            animate={{ 
              rotate: 360
            }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1/2 -left-1/2 w-full h-full border border-slate-700 rounded-full"
          />
        </div>

        <div className="relative z-10 max-w-lg space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
          >
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center p-4 shadow-2xl shadow-black/50 border border-slate-700">
              <img src="https://i.ibb.co/KxMxh3Hw/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter leading-none">YAJUR</h1>
              <p className="text-slate-400 font-bold tracking-[0.4em] mt-2 uppercase">Fibres LTD</p>
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-black text-white leading-tight"
            >
              The Next Echelon of <span className="text-blue-500 underline decoration-4 underline-offset-8">Enterprise</span> Management.
            </motion.h2>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Real-time ERP', icon: Zap },
                { label: 'Node Security', icon: ShieldCheck },
                { label: 'Vertical Integration', icon: Globe },
                { label: 'Executive Insights', icon: ChevronRight }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                >
                  <item.icon size={18} className="text-blue-400" />
                  <span className="text-xs font-black text-slate-300 tracking-wider uppercase">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="absolute bottom-12 left-20">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">© 2026 Yajur Automation Systems</p>
        </div>
      </div>

      {/* Login Side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-24 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white p-10 lg:p-14 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col"
        >
          <div className="mb-12">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Portal Access</h3>
            <p className="text-slate-500 font-medium mt-2">Identify yourself to access the centralized node.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase px-1">Identifier</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <UserIcon className="text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                </div>
                <input 
                  type="text"
                  required
                  placeholder="Username/Node ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase px-1">Access Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                </div>
                <input 
                  type="password"
                  required
                  placeholder="Pin code"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 font-semibold"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 overflow-hidden"
                >
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                  <p className="text-xs font-black text-rose-600 tracking-wide">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-3xl bg-slate-900 text-white font-black text-sm tracking-widest uppercase shadow-2xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 ${isLoading ? 'cursor-not-allowed' : 'hover:bg-blue-600 hover:shadow-blue-200'}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Connect Node
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-auto pt-10 text-center">
            <p className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">Private Internal Infrastructure</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
