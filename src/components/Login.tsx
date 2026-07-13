import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  User as UserIcon, 
  ChevronRight,
  Database,
  Settings
} from 'lucide-react';
import { INDUSTRIAL_ASSETS } from '../constants';
import { User } from '../types';
import { fetchUsersFromSheet, getWebAppUrl, setWebAppUrl } from '../lib/sheets';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bgImage, setBgImage] = useState(INDUSTRIAL_ASSETS[0]);
  
  // Database Setup states
  const [showDbSetup, setShowDbSetup] = useState(false);
  const [dbUrlInput, setDbUrlInput] = useState(getWebAppUrl() || '');

  useEffect(() => {
    // Cycle backgrounds subtly on mount
    const interval = setInterval(() => {
      setBgImage(INDUSTRIAL_ASSETS[Math.floor(Math.random() * INDUSTRIAL_ASSETS.length)]);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDbSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUrlInput.trim()) {
      setError('Please enter a valid Web App URL');
      return;
    }
    setWebAppUrl(dbUrlInput.trim());
    setShowDbSetup(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const sheetUsers = await fetchUsersFromSheet();
      
      const match = sheetUsers.find(
        (u) => String(u.UserId).trim().toLowerCase() === username.trim().toLowerCase() && String(u.Password).trim() === password.trim()
      );
      
      if (match) {
        // Parse modules from comma-separated string
        const allowedModules = match.Modules ? match.Modules.split(',').map(m => m.trim()).filter(Boolean) : [];
        
        onLogin({
          username: match.FullName || match.UserId,
          role: match.Role.toLowerCase() as any,
          allowedModules,
          designation: match.Designation
        });
      } else {
        setError('Verification Failed: Invalid credentials or access denied.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to query the users database. Check connection.');
      
      if (err.message && err.message.includes('Database not configured')) {
        setError('Database not configured. Please click the gear icon in the top right to set your Web App URL.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-0 font-sans overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col lg:flex-row min-h-[650px] mx-4"
      >
        {/* Left Side: Login Form */}
        <div className="flex-1 p-10 lg:p-20 flex flex-col justify-center relative">
          
          {/* Admin Setup Toggle Button */}
          {!showDbSetup && (
            <button 
              onClick={() => setShowDbSetup(true)}
              className="absolute top-8 right-8 p-3 text-slate-300 hover:text-orange-500 bg-slate-50 hover:bg-orange-50 rounded-full transition-all"
              title="Database Configuration"
            >
              <Settings size={20} />
            </button>
          )}

          <div className="mb-12">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-10 h-10 bg-white rounded-xl shadow-xl p-2 border border-slate-100">
                <img src="https://i.ibb.co/KxMxh3Hw/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">YAJUR NODE</h1>
            </motion.div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
              {showDbSetup ? 'Setup Database' : 'Sign In'}
            </h1>
            <div className="h-1.5 w-12 bg-orange-500 rounded-full" />
          </div>

          {showDbSetup ? (
            <form onSubmit={handleDbSetup} className="space-y-6 flex flex-col items-start w-full">
              <p className="text-sm font-bold text-slate-500 leading-relaxed mb-2">
                Configure the Apps Script Web App URL to enable the central database for all users without requiring Google Sign-in.
              </p>
              
              <div className="space-y-2 w-full">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Web App URL</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-orange-500 transition-colors">
                    <Database size={18} />
                  </div>
                  <input 
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={dbUrlInput}
                    onChange={(e) => setDbUrlInput(e.target.value)}
                    className="block w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-sm font-bold text-slate-700 focus:outline-none focus:border-orange-500/20 focus:bg-white transition-all placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>
              
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full flex items-center gap-3 p-4 bg-rose-50 text-rose-600 rounded-2xl text-[11px] font-bold border border-rose-100"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4 w-full mt-4">
                {getWebAppUrl() && (
                  <button
                    type="button"
                    onClick={() => setShowDbSetup(false)}
                    className="flex-1 py-5 px-6 bg-slate-100 text-slate-500 rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-[2] flex items-center justify-center gap-3 py-5 px-6 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-orange-200 hover:shadow-orange-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Save & Connect
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-orange-500 transition-colors">
                    <UserIcon size={18} />
                  </div>
                  <input 
                    type="text"
                    placeholder="Enter your identifier"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-sm font-bold text-slate-700 focus:outline-none focus:border-orange-500/20 focus:bg-white transition-all placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Password</label>
                  <button type="button" className="text-[9px] font-black text-orange-500 hover:underline uppercase tracking-widest">Forgot password?</button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-orange-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-sm font-bold text-slate-700 focus:outline-none focus:border-orange-500/20 focus:bg-white transition-all placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 p-4 bg-rose-50 text-rose-600 rounded-2xl text-[11px] font-bold border border-rose-100"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-5 px-6 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-orange-200 hover:shadow-orange-300 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-8"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign into Node <ChevronRight size={18} /></>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Visual Content */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-400 via-rose-500 to-fuchsia-600 p-20 flex-col justify-center items-center text-center relative overflow-hidden">
          {/* Abstract background elements */}
          <div className="absolute top-0 right-0 w-full h-full opacity-20">
            <div className="absolute top-10 right-10 w-64 h-64 border-[40px] border-white rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 border-[60px] border-white rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[1px] border-white rounded-full" />
            <div className="absolute top-1/3 left-1/4 w-32 h-32 border-[20px] border-white rounded-full" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-5xl font-black text-white tracking-tight mb-4 leading-tight">Welcome <br /> Back!</h2>
              <div className="w-12 h-1 bg-white/40 mx-auto rounded-full mb-8" />
              <p className="text-white font-medium text-lg leading-relaxed max-w-xs mx-auto opacity-90">
                Central Intelligence & 
                Operational Control Center
              </p>
            </motion.div>
            
            <div className="pt-10 flex flex-wrap justify-center gap-3">
              {['V4.2', 'Secure', 'Synced'].map((tag) => (
                <span key={tag} className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-xl text-[9px] font-black text-white uppercase tracking-[0.3em] border border-white/20 whitespace-nowrap">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute bottom-10 left-0 right-0 text-center">
            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.5em]">SYSTEM PROTOCOL v4.2.0 // 2026</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

