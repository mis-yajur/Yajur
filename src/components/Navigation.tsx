import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronLeft, ChevronRight, ChevronDown, LayoutGrid, LogOut } from 'lucide-react';
import { LucideIcon } from './LucideIcon';
import { MODULES } from '../constants';
import { User, Module } from '../types';

interface NavigationProps {
  user: User;
  onLogout: () => void;
  activeModuleUrl: string | null;
  onSelectModule: (url: string | null) => void;
  role: string;
}

export const Navigation = ({ user, onLogout, activeModuleUrl, onSelectModule, role }: NavigationProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const navItemClass = (url: string | null) => `
    flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer group
    ${(activeModuleUrl === url && url !== null) ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-slate-600 hover:bg-slate-100 hover:text-blue-500'}
    ${isCollapsed ? 'justify-center px-0' : ''}
  `;

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-slate-200 hover:bg-slate-50"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 280,
          x: isMobileMenuOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0)
        }}
        className={`h-screen bg-white border-r border-slate-200 z-50 flex flex-col transition-all duration-300 shadow-sm overflow-visible`}
      >
        {/* Header */}
        <div className={`p-6 flex items-center justify-between relative`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
              <img src="https://i.ibb.co/KxMxh3Hw/logo.png" alt="Logo" className="w-8 h-8 object-contain brightness-0 invert" />
            </div>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="font-bold text-lg text-slate-800 whitespace-nowrap"
              >
                Yajur Fibres LTD.
              </motion.span>
            )}
          </div>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-4 top-8 w-8 h-8 items-center justify-center bg-white border border-slate-200 rounded-full shadow-md text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-colors z-50"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          <ul className="space-y-2">
            <li>
              <div 
                onClick={() => { onSelectModule(null); setIsMobileMenuOpen(false); }}
                className={`${navItemClass(null)} ${activeModuleUrl === null ? 'bg-blue-50 text-blue-600' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <LayoutGrid size={22} className={activeModuleUrl === null ? 'text-blue-600' : 'text-slate-400'} />
                  {!isCollapsed && <span className="font-medium">Dashboard</span>}
                </div>
              </div>
            </li>

            <div className="h-px bg-slate-100 my-4" />

            {filteredModules.map((module) => (
              <li key={module.id} className="space-y-1">
                <div 
                  onClick={() => {
                    if (module.items) {
                      toggleSubmenu(module.id);
                    } else if (module.url) {
                      onSelectModule(module.url);
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={navItemClass(module.url || 'folder')}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <LucideIcon name={module.icon} size={22} className="shrink-0 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    {!isCollapsed && (
                      <span className="font-medium truncate">{module.title}</span>
                    )}
                  </div>
                  {!isCollapsed && module.items && (
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform duration-200 ${openSubmenu === module.id ? 'rotate-180' : ''}`}
                    />
                  )}
                </div>

                {/* Submenu */}
                <AnimatePresence>
                  {!isCollapsed && openSubmenu === module.id && module.items && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-11 space-y-1"
                    >
                      {module.items.map(item => (
                        <li key={item.id}>
                          <button
                            onClick={() => { onSelectModule(item.url); setIsMobileMenuOpen(false); }}
                            className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${activeModuleUrl === item.url ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-500 hover:text-blue-500 hover:bg-slate-50'}`}
                          >
                            {item.title}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 mt-auto">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-2`}>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">{user.username}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">{user.role}</p>
              </div>
            )}
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
