import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X,
  LayoutDashboard,
  ShieldCheck,
  Building2,
  ChevronDown
} from 'lucide-react';
import { User, Role } from '../types';
import { LucideIcon } from './LucideIcon';
import { MODULES } from '../constants';
import { useTheme } from '../context/ThemeContext';

interface NavigationProps {
  user: User;
  onLogout: () => void;
  activeModuleUrl: string | null;
  onSelectModule: (url: string | null) => void;
  role: Role;
}

export const Navigation = ({ user, onLogout, activeModuleUrl, onSelectModule, role }: NavigationProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { config } = useTheme();

  const filteredModules = MODULES.filter(module => {
    if (role === 'admin') return true;
    if (role === 'store') return module.id === 'ims';
    if (role === 'hr') return module.id === 'hr';
    if (role === 'production') return module.id === 'production';
    if (role === 'pms') return module.id === 'pms';
    if (role === 'sales') return module.id === 'sales';
    if (role === 'office') return module.id === 'task';
    return false;
  });

  const toggleSubmenu = (id: string) => {
    setOpenSubmenu(openSubmenu === id ? null : id);
  };

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-[100]">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`p-3 bg-white border border-slate-200 rounded-2xl shadow-xl text-slate-600 transition-all active:scale-95`}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.nav
        initial={false}
        animate={{ 
          width: isCollapsed ? 64 : 240,
          x: isMobileMenuOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -240 : 0)
        }}
        className={`h-screen bg-slate-900 z-[95] flex flex-col transition-all duration-500 shadow-2xl relative flex-shrink-0 text-slate-300`}
      >
        {/* Superior Branding */}
        <div className={`p-4 flex items-center justify-between relative`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-white p-1 shadow-lg">
              <img src="https://i.ibb.co/KxMxh3Hw/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="whitespace-nowrap"
              >
                <h1 className="text-xs font-black text-white tracking-widest leading-none uppercase">YAJUR</h1>
              </motion.div>
            )}
          </div>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-5 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-white shadow-xl transform transition-all hover:scale-110 z-[110]"
          >
            {isCollapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
          </button>
        </div>

        {/* Global Action Section - Simplified */}
        <div className="px-2 mb-4">
          <button
            onClick={() => { onSelectModule(null); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg transition-all group
              ${!activeModuleUrl ? `bg-teal-600 text-white shadow-lg shadow-teal-500/20` : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
          >
            <LayoutDashboard size={16} />
            {!isCollapsed && <span className="text-[10px] font-bold tracking-wider uppercase truncate">Overview</span>}
          </button>
        </div>

        {/* Main Resource Grid */}
        <div className="flex-1 px-2 overflow-y-auto custom-scrollbar-dark space-y-0.5">
          {!isCollapsed && (
            <p className="px-2.5 py-1.5 text-[8px] font-black text-slate-600 tracking-[0.2em] uppercase">Enterprise Nodes</p>
          )}
          
          {filteredModules.map((module) => {
            const isActive = activeModuleUrl === module.id || (module.url && activeModuleUrl === module.url);
            const hasSubmenu = !!module.items;
            
            return (
              <div key={module.id} className="space-y-0.5">
                <button
                  onClick={() => {
                    if (hasSubmenu) {
                      toggleSubmenu(module.id);
                    } else {
                      onSelectModule(module.url || module.id);
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg transition-all group relative
                    ${isActive 
                      ? `bg-slate-800 text-white shadow-sm` 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
                >
                  <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 text-slate-500 group-hover:text-teal-400'}`}>
                    <LucideIcon name={module.icon} size={16} />
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <p className={`text-[10px] font-bold tracking-wide uppercase truncate ${isActive ? 'text-white' : ''}`}>
                        {module.title}
                      </p>
                    </div>
                  )}
                  {!isCollapsed && hasSubmenu && (
                    <ChevronDown size={10} className={`transition-transform duration-300 ${openSubmenu === module.id ? 'rotate-180' : ''}`} />
                  )}
                  
                  {/* Active Indicator */}
                  {isActive && !isCollapsed && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-teal-500 rounded-l-full" />
                  )}
                </button>

                <AnimatePresence>
                  {!isCollapsed && openSubmenu === module.id && module.items && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-1 ml-4 border-l border-slate-800 pl-4 py-1"
                    >
                      {module.items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => { onSelectModule(item.url); setIsMobileMenuOpen(false); }}
                          className={`w-full text-left p-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all
                            ${activeModuleUrl === item.url 
                              ? `text-teal-400 bg-teal-400/5` 
                              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}
                        >
                          {item.title}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* User / Profile Section */}
        <div className="p-2 border-t border-slate-800 bg-slate-900/50 mt-auto">
          <div className={`flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 border border-slate-800 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className={`w-7 h-7 rounded bg-teal-600 flex items-center justify-center text-white text-[10px] font-black shrink-0`}>
              {user.username.charAt(0)}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-white truncate">{user.username}</p>
                <div className="flex items-center gap-1">
                  <ShieldCheck size={8} className="text-teal-400" />
                  <p className="text-[8px] font-bold text-slate-500 tracking-widest uppercase truncate">{role}</p>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-2.5 p-2.5 mt-1 rounded-lg text-rose-400 hover:bg-rose-900/20 transition-all font-bold text-[9px] tracking-widest uppercase group ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span>End Session</span>}
          </button>
        </div>
      </motion.nav>
    </>
  );
};
