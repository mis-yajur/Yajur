import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ModuleFrame } from './components/ModuleFrame';
import { Login } from './components/Login';
import { User, Module } from './types';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { MODULES } from './constants';

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [activeModuleUrl, setActiveModuleUrl] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>(() => {
    const savedPins = localStorage.getItem('yajur-pins');
    const pinIds = savedPins ? JSON.parse(savedPins) : [];
    return MODULES.map(m => ({ ...m, pinned: pinIds.includes(m.id) }));
  });

  const { config } = useTheme();

  useEffect(() => {
    const pinIds = modules.filter(m => m.pinned).map(m => m.id);
    localStorage.setItem('yajur-pins', JSON.stringify(pinIds));
  }, [modules]);

  const togglePin = (moduleId: string) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, pinned: !m.pinned } : m
    ));
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const renderContent = () => {
    if (activeModuleUrl) {
      return (
        <div className="relative w-full h-full">
          <ModuleFrame url={activeModuleUrl} onBack={() => setActiveModuleUrl(null)} />
        </div>
      );
    }

    return (
      <Dashboard 
        user={user}
        modules={modules}
        onSelectModule={(url) => setActiveModuleUrl(url)} 
        onTogglePin={togglePin}
      />
    );
  };

  return (
    <div className={`flex h-screen bg-${config.bg} font-sans text-slate-800 overflow-hidden`}>
      {/* Dynamic Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-700 ease-in-out transform 
          ${activeModuleUrl ? '-translate-x-full hover:translate-x-0' : 'translate-x-0'}
          ${activeModuleUrl ? 'shadow-2xl' : ''}`}
      >
        <Navigation 
          user={user} 
          role={user.role}
          onLogout={() => { setUser(null); setActiveModuleUrl(null); }} 
          activeModuleUrl={activeModuleUrl}
          onSelectModule={setActiveModuleUrl}
        />
        
        {/* Module View Floating Edge Toggle */}
        {activeModuleUrl && (
          <div className="absolute top-1/2 -right-8 -translate-y-1/2 w-8 h-32 flex items-center justify-center cursor-pointer group">
             <div className={`w-1 h-12 bg-${config.primary}/20 group-hover:bg-${config.primary} group-hover:h-20 rounded-full transition-all duration-500`} />
             <div className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xl pointer-events-none whitespace-nowrap text-[10px] font-black tracking-widest text-slate-500 uppercase">
               Show Sidebar
             </div>
          </div>
        )}
      </div>
      
      {/* Main Viewport */}
      <main 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-700 
          ${activeModuleUrl ? 'w-full' : 'sm:pl-0 lg:pl-0'}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModuleUrl || 'dashboard'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full h-full overflow-y-auto custom-scrollbar"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Corporate Global Style System */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.1);
        }
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
