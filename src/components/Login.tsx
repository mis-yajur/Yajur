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
    <div className="min-h-screen bg-slate-950 flex font-sans overflow-hidden relative">
      {/* Dynamic Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={bgImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.4, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={bgImage} 
            alt="Industrial Background" 
            className="w-full h-full object-cover grayscale brightness-50"
          />
        </motion.div>
      </AnimatePresence>

      {/* Lighting Effects */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-teal-500/10 z-[1]" />
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 z-[2]" />

      <div className="relative z-10 w-full flex flex-col lg:flex-row">
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex flex-1 flex-col justify-between p-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-white rounded-xl p-2 shadow-2xl flex items-center justify-center">
              <img src="https://i.ibb.co/KxMxh3Hw/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-widest uppercase">Yajur Fibres</h2>
              <div className="h-1 w-full bg-teal-500 mt-1 rounded-full shadow-[0_0_10px_#14b8a6]" />
            </div>
          </motion.div>

          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-6xl font-black text-white tracking-tighter leading-tight max-w-xl">
                Precision <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Enterprise</span> Control.
              </h1>
              <p className="text-slate-400 text-lg font-medium mt-6 max-w-md border-l-2 border-teal-500/50 pl-6">
                Integrated operational nodes for the next generation of industrial excellence.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-6 max-w-lg">
              {[
                { icon: Cpu, label: 'Node Processing', val: 'Active' },
                { icon: Database, label: 'Vault Status', val: 'Locked' },
                { icon: Activity, label: 'Systems', val: 'Nominal' },
                { icon: ShieldCheck, label: 'Security', val: 'Level 4' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl group hover:bg-white/10 transition-all cursor-default"
                >
                  <stat.icon className="text-teal-400 mb-2 group-hover:scale-110 transition-transform" size={20} />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xs font-black text-white uppercase tracking-tight mt-1">{stat.val}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase">Private Internal Grid // 2026</p>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            className="w-full max-w-md bg-white/10 backdrop-blur-2xl p-10 lg:p-12 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 relative"
          >
            {/* Branding for Mobile */}
            <div className="lg:hidden flex flex-col items-center mb-12">
              <div className="w-16 h-16 bg-white rounded-2xl p-3 mb-4 shadow-2xl">
                <img src="https://i.ibb.co/KxMxh3Hw/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-xl font-black text-white tracking-widest uppercase">Yajur Fibres</h2>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h3 className="text-3xl font-black text-white tracking-tight">Identity Hub</h3>
              <p className="text-slate-400 font-medium text-sm mt-2">Accessing centralized operational node.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-teal-400 tracking-[0.2em] uppercase px-1">Identifier</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <UserIcon className="text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                  </div>
                  <input 
                    type="text"
                    required
                    placeholder="Terminal ID / User"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-14 pr-5 py-4 bg-black/40 border border-white/10 rounded-2xl outline-none focus:border-teal-500 focus:bg-black/60 transition-all text-white text-sm font-semibold placeholder:text-slate-600 shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-teal-400 tracking-[0.2em] uppercase px-1">Access Key</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Lock className="text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                  </div>
                  <input 
                    type="password"
                    required
                    placeholder="Security Token"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-14 pr-5 py-4 bg-black/40 border border-white/10 rounded-2xl outline-none focus:border-teal-500 focus:bg-black/60 transition-all text-white text-sm font-semibold placeholder:text-slate-600 shadow-inner"
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-[10px] font-bold tracking-wide flex items-center gap-3 overflow-hidden"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                disabled={isLoading}
                className="group relative w-full overflow-hidden py-4 bg-teal-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-teal-500 transition-all shadow-[0_10px_30px_-10px_rgba(20,184,166,0.3)] flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Connect Terminal
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
