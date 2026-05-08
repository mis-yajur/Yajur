import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ModuleFrame } from './components/ModuleFrame';
import { FMSPage } from './components/FMSPage';
import { Login } from './components/Login';
import { User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeModuleUrl, setActiveModuleUrl] = useState<string | null>(null);
  const [isNavVisible, setIsNavVisible] = useState(true);

  // Auto-hide navigation logic
  useEffect(() => {
    if (activeModuleUrl) {
      // In a real "Auto Hide" request, we might hide the nav entirely
      // but usually users want a way to get back. So we just ensure it is manageable.
      // For this app, we'll keep the sidebar but allow it to be collapsed.
    }
  }, [activeModuleUrl]);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const renderContent = () => {
    if (activeModuleUrl === 'fms-page') {
      return <FMSPage onBack={() => setActiveModuleUrl(null)} />;
    }
    
    if (activeModuleUrl) {
      return (
        <div className="relative w-full h-full">
          <ModuleFrame url={activeModuleUrl} onBack={() => setActiveModuleUrl(null)} />
        </div>
      );
    }

    return (
      <Dashboard 
        role={user.role} 
        onSelectModule={(url) => setActiveModuleUrl(url)} 
      />
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <div 
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-500 ease-in-out transform 
          ${activeModuleUrl && activeModuleUrl !== 'fms-page' ? '-translate-x-full hover:translate-x-0' : 'translate-x-0'}
          ${activeModuleUrl ? 'shadow-2xl' : ''}`}
      >
        <Navigation 
          user={user} 
          role={user.role}
          onLogout={() => { setUser(null); setActiveModuleUrl(null); }} 
          activeModuleUrl={activeModuleUrl}
          onSelectModule={setActiveModuleUrl}
        />
        
        {/* Module View Floating Toggle */}
        {activeModuleUrl && activeModuleUrl !== 'fms-page' && (
          <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-12 h-24 bg-blue-600 rounded-r-2xl flex items-center justify-center cursor-pointer shadow-lg shadow-blue-500/20 group animate-pulse hover:animate-none">
            <div className="rotate-90 text-white font-bold text-xs tracking-widest whitespace-nowrap group-hover:scale-110 transition-transform">
              MENU
            </div>
          </div>
        )}
      </div>
      
      <main 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-500 
          ${activeModuleUrl && activeModuleUrl !== 'fms-page' ? 'w-full' : 'lg:ml-0'}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModuleUrl || 'dashboard'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Style Overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
    </div>
  );
}
