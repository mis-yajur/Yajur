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
          width: isCollapsed ? 74 : 260,
          x: isMobileMenuOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -260 : 0)
        }}
        className={`h-screen bg-gradient-to-b ${config.sidebarGradient} z-[95] flex flex-col transition-all duration-500 shadow-[20px_0_60px_rgba(0,0,0,0.2)] relative flex-shrink-0 text-${config.sidebarText}`}
      >
        {/* Superior Branding */}
        <div className={`p-8 flex items-center justify-between relative`}>
          <div className="flex items-center gap-4 overflow-hidden">
            <motion.div 
              whileHover={{ rotate: -5, scale: 1.15 }}
              className={`flex-shrink-0 w-11 h-11 rounded-2xl bg-white p-2.5 shadow-2xl relative z-10 transition-transform`}
            >
              <img src="https://i.ibb.co/KxMxh3Hw/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </motion.div>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="whitespace-nowrap"
              >
                <h1 className="text-base font-black text-white tracking-[0.2em] leading-none uppercase">ARCHITECT</h1>
                <p className="text-[7px] font-black text-white/40 tracking-[0.4em] uppercase mt-1.5 ml-0.5">Control Center</p>
              </motion.div>
            )}
          </div>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:flex absolute -right-3 top-10 w-6 h-6 bg-white border border-slate-100 rounded-lg items-center justify-center text-slate-800 shadow-2xl transition-all hover:scale-110 z-[110]`}
          >
            {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* Global Action Section */}
        <div className="px-4 mb-8">
          <button
            onClick={() => { onSelectModule(null); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl transition-all group relative overflow-hidden
              ${!activeModuleUrl ? `bg-white/20 text-white shadow-xl backdrop-blur-md` : `text-white/60 hover:bg-white/10 hover:text-white`}`}
          >
            <LayoutDashboard size={18} />
            {!isCollapsed && <span className="text-[11px] font-black tracking-[0.1em] uppercase truncate">Main Dashboard</span>}
            {!activeModuleUrl && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white" />}
          </button>
        </div>

        {/* Main Resource Grid */}
        <div className="flex-1 px-4 overflow-y-auto custom-scrollbar-hidden space-y-6">
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-4 py-2 text-[9px] font-black text-white/30 tracking-[0.3em] uppercase">Core Components</p>
            )}
            
            {filteredModules.map((module) => {
              const isActive = activeModuleUrl === module.id || (module.url && activeModuleUrl === module.url);
              const hasSubmenu = !!module.items;
              
              return (
                <div key={module.id} className="space-y-1">
                  <button
                    onClick={() => {
                      if (hasSubmenu) {
                        toggleSubmenu(module.id);
                      } else {
                        onSelectModule(module.url || module.id);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl transition-all group relative
                      ${isActive 
                        ? `bg-white/20 text-white shadow-lg backdrop-blur-md` 
                        : `text-white/60 hover:bg-white/10 hover:text-white`}`}
                  >
                    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:translate-x-1'}`}>
                      <LucideIcon name={module.icon} size={18} />
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1 text-left">
                        <p className={`text-[11px] font-black tracking-[0.05em] uppercase truncate ${isActive ? 'text-white' : ''}`}>
                          {module.title}
                        </p>
                      </div>
                    )}
                    {!isCollapsed && hasSubmenu && (
                      <ChevronDown size={12} className={`transition-transform duration-300 ${openSubmenu === module.id ? 'rotate-180' : ''}`} />
                    )}
                    
                    {isActive && (
                      <div className="absolute left-0 top-3 bottom-3 w-1 bg-white rounded-r-full" />
                    )}
                  </button>

                  <AnimatePresence>
                    {!isCollapsed && openSubmenu === module.id && module.items && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`overflow-hidden space-y-1.5 ml-6 pl-4 border-l border-white/10 py-2`}
                      >
                        {module.items.map(item => (
                          <button
                            key={item.id}
                            onClick={() => { onSelectModule(item.url); setIsMobileMenuOpen(false); }}
                            className={`w-full text-left py-2 px-3 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all
                              ${activeModuleUrl === item.url 
                                ? `text-white bg-white/20` 
                                : `text-white/40 hover:text-white hover:bg-white/5`}`}
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
        </div>

        {/* User / Profile Section */}
        <div className={`p-4 border-t border-white/10 bg-black/10 mt-auto`}>
          <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className={`w-9 h-9 rounded-xl bg-white p-0.5 flex items-center justify-center shadow-2xl shrink-0`}>
              <div className="w-full h-full rounded-lg bg-teal-600 flex items-center justify-center text-white text-[11px] font-black">
                {user.username.charAt(0)}
              </div>
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-black text-white truncate uppercase tracking-tighter">{user.username}</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[8px] font-black text-white/40 tracking-[0.2em] uppercase truncate">{role}</p>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3.5 p-3.5 mt-2 rounded-2xl text-white/60 hover:text-white hover:bg-white/10 transition-all font-black text-[10px] tracking-[0.2em] uppercase group ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span>Terminate</span>}
          </button>
        </div>
      </motion.nav>
    </>
  );
};
