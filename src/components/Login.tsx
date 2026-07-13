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
import { INDUSTRIAL_ASSETS } from '../constants';
import { User } from '../types';
import { initAuth, googleSignIn, getAccessToken } from '../lib/auth';
import { fetchUsersFromSheet } from '../lib/sheets';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bgImage, setBgImage] = useState(INDUSTRIAL_ASSETS[0]);
  
  // Google Auth states
  const [needsGoogleAuth, setNeedsGoogleAuth] = useState(false);
  const [isLoggingInGoogle, setIsLoggingInGoogle] = useState(false);

  useEffect(() => {
    // Check if we already have the token
    const unsubscribe = initAuth(
      () => setNeedsGoogleAuth(false),
      () => setNeedsGoogleAuth(true)
    );
    
    // Cycle backgrounds subtly on mount
    const interval = setInterval(() => {
      setBgImage(INDUSTRIAL_ASSETS[Math.floor(Math.random() * INDUSTRIAL_ASSETS.length)]);
    }, 10000);
    
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingInGoogle(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setNeedsGoogleAuth(false);
      }
    } catch (err) {
      console.error('Google Login failed:', err);
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setIsLoggingInGoogle(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const sheetUsers = await fetchUsersFromSheet();
      
      const match = sheetUsers.find(
        (u) => u.UserId.trim().toLowerCase() === username.trim().toLowerCase() && u.Password === password
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
        setError('Verification Failed: Access Denied to Node.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to query the users database. Check connection.');
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
        <div className="flex-1 p-10 lg:p-20 flex flex-col justify-center">
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
            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Sign In</h1>
            <div className="h-1.5 w-12 bg-orange-500 rounded-full" />
          </div>

          {needsGoogleAuth ? (
            <div className="space-y-6 flex flex-col items-start">
              <p className="text-sm font-bold text-slate-500">
                Connect the workspace database to verify user credentials.
              </p>
              
              <button onClick={handleGoogleLogin} disabled={isLoggingInGoogle} className="gsi-material-button w-full">
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlns:xlink="http://www.w3.org/1999/xlink" style={{display: 'block'}}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents">{isLoggingInGoogle ? 'Connecting...' : 'Sign in with Google'}</span>
                  <span style={{display: 'none'}}>Sign in with Google</span>
                </div>
              </button>
              
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
            </div>
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

            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4">
              Access Restricted // <button type="button" className="text-orange-500 font-black hover:underline">Authorization Guide</button>
            </p>
          </form>
          )}
        </div>

        {/* Right Side: Visual Content */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-400 via-rose-500 to-fuchsia-600 p-20 flex-col justify-center items-center text-center relative overflow-hidden">
          {/* Abstract background elements inspired by screenshot 2 */}
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
