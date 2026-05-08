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
          width: isCollapsed ? 88 : 300,
          x: isMobileMenuOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -300 : 0)
        }}
        className={`h-screen bg-white border-r border-slate-100 z-[95] flex flex-col transition-all duration-500 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.03)] overflow-visible relative flex-shrink-0`}
      >
        {/* Superior Branding */}
        <div className={`p-8 flex items-center justify-between relative`}>
          <div className="flex items-center gap-4 overflow-hidden">
            <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-white flex items-center justify-center p-1.5 shadow-xl shadow-black/5 border border-slate-100`}>
              <img src="https://i.ibb.co/KxMxh3Hw/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="whitespace-nowrap"
              >
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">YAJUR</h1>
                <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] mt-1">FIBRES LTD</p>
              </motion.div>
            )}
          </div>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-4 top-10 w-9 h-9 bg-white border border-slate-200 rounded-xl items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 shadow-lg transform translate-x-1/2 transition-all hover:scale-110 z-[110]"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Global Action Section */}
        <div className="px-4 mb-8">
          <button
            onClick={() => { onSelectModule(null); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group
              ${!activeModuleUrl ? `bg-${config.primary}/5 text-${config.primary} border border-${config.primary}/10` : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <LayoutDashboard size={20} className={activeModuleUrl ? '' : `text-${config.primary}`} />
            {!isCollapsed && <span className="text-xs font-black tracking-widest uppercase truncate">Overview</span>}
          </button>
        </div>

        {/* Main Resource Grid */}
        <div className="flex-1 px-4 overflow-y-auto custom-scrollbar space-y-2">
          {!isCollapsed && (
            <p className="px-4 py-2 text-[10px] font-black text-slate-300 tracking-[0.3em] uppercase">Modules</p>
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
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group overflow-hidden relative
                    ${isActive 
                      ? `bg-${config.primary} text-white shadow-xl shadow-${config.primary}/20` 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <div className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    <LucideIcon name={module.icon} size={20} />
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 text-left relative z-10">
                      <p className={`text-xs font-black tracking-widest uppercase truncate ${isActive ? 'text-white' : 'text-slate-600'}`}>
                        {module.title}
                      </p>
                    </div>
                  )}
                  {!isCollapsed && hasSubmenu && (
                    <ChevronDown size={14} className={`transition-transform duration-300 ${openSubmenu === module.id ? 'rotate-180' : ''}`} />
                  )}
                </button>

                <AnimatePresence>
                  {!isCollapsed && openSubmenu === module.id && module.items && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-1 px-4"
                    >
                      {module.items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => { onSelectModule(item.url); setIsMobileMenuOpen(false); }}
                          className={`w-full text-left p-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all
                            ${activeModuleUrl === item.url 
                              ? `text-${config.primary} bg-${config.primary}/10` 
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
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
        <div className="p-4 border-t border-slate-50 bg-slate-50/50">
          <div className={`flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm ${isCollapsed ? 'justify-center px-0' : ''}`}>
            <div className={`w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black shrink-0 shadow-inner`}>
              {user.username.charAt(0)}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-900 truncate">{user.username}</p>
                <div className="flex items-center gap-1">
                  <ShieldCheck size={10} className="text-blue-500" />
                  <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase truncate">{role}</p>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-4 p-4 mt-2 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-black text-[10px] tracking-widest uppercase group ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.nav>
    </>
  );
};
