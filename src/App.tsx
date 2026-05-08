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
      return <ModuleFrame url={activeModuleUrl} onBack={() => setActiveModuleUrl(null)} />;
    }

    return (
      <Dashboard 
        role={user.role} 
        onSelectModule={(url) => setActiveModuleUrl(url)} 
      />
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      {(!activeModuleUrl || activeModuleUrl === 'fms-page') && (
        <Navigation 
          user={user} 
          role={user.role}
          onLogout={() => { setUser(null); setActiveModuleUrl(null); }} 
          activeModuleUrl={activeModuleUrl}
          onSelectModule={setActiveModuleUrl}
        />
      )}
      
      <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${activeModuleUrl ? 'p-0 overflow-hidden' : 'p-6 lg:p-10 overflow-y-auto'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModuleUrl || 'dashboard'}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full h-full max-w-[1600px] mx-auto"
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
