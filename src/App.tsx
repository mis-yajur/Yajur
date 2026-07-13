import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ModuleFrame } from './components/ModuleFrame';
import { Login } from './components/Login';
import { User, Module, RecentActivity, UserCredential, AppNotification } from './types';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { MODULES, THEME_PLATES } from './constants';

const getModuleNameByUrl = (url: string | null): string => {
  if (!url) return '';
  for (const m of MODULES) {
    if (m.url === url || m.id === url) return m.title;
    if (m.items) {
      for (const sub of m.items) {
        if (sub.url === url || sub.id === url) return `${m.title} > ${sub.title}`;
      }
    }
  }
  return url;
};

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<UserCredential[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);

  useEffect(() => {
    // We only load users if an admin is logged in and they are viewing the dashboard
    if (user?.role === 'admin') {
      import('./lib/sheets').then(({ fetchUsersFromSheet }) => {
        setIsUsersLoading(true);
        fetchUsersFromSheet()
          .then((sheetUsers) => {
            const mapped: UserCredential[] = sheetUsers.map(su => ({
              username: su.UserId, // use UserId for the form
              pass: su.Password,
              role: su.Role.toLowerCase() as any,
              allowedModules: su.Modules ? su.Modules.split(',').map(m => m.trim()).filter(Boolean) : []
            }));
            setUsersList(mapped);
          })
          .catch(console.error)
          .finally(() => setIsUsersLoading(false));
      });
    }
  }, [user]);

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('yajur-notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const handleUpdateUsersList = async (newUsers: UserCredential[]) => {
    try {
      const { updateAllUsersInSheet } = await import('./lib/sheets');
      await updateAllUsersInSheet(newUsers.map(u => ({
        FullName: u.username,
        UserId: u.username,
        Password: u.pass,
        Modules: u.allowedModules.join(', '),
        Role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
        Designation: ''
      })));
    } catch (err) {
      console.error('Failed to update Google Sheet', err);
      alert('Failed to update Google Sheet. Please check the console.');
      return; // don't update local state if it fails
    }

    setUsersList(newUsers);

    // Diff-check allowedModules per user to generate in-app notifications
    const newNotifications: AppNotification[] = [];
    const timestamp = new Date().toISOString();

    newUsers.forEach(u => {
      const oldU = usersList.find(old => old.username.toLowerCase() === u.username.toLowerCase());
      if (oldU) {
        // Find newly added modules
        const added = u.allowedModules.filter(id => !oldU.allowedModules.includes(id));
        // Find revoked modules
        const removed = oldU.allowedModules.filter(id => !u.allowedModules.includes(id));

        added.forEach(modId => {
          const modTitle = MODULES.find(m => m.id === modId)?.title || modId;
          newNotifications.push({
            id: 'notif-' + Math.random().toString(36).substring(2, 11),
            username: u.username,
            title: 'New Module Workspace Assigned',
            message: `An administrator has granted you permission to access the '${modTitle}' module.`,
            timestamp,
            read: false,
            type: 'success',
            moduleDetails: { id: modId, title: modTitle, action: 'add' }
          });
        });

        removed.forEach(modId => {
          const modTitle = MODULES.find(m => m.id === modId)?.title || modId;
          newNotifications.push({
            id: 'notif-' + Math.random().toString(36).substring(2, 11),
            username: u.username,
            title: 'Module Workspace Revoked',
            message: `An administrator has removed your permission to access the '${modTitle}' module.`,
            timestamp,
            read: false,
            type: 'warning',
            moduleDetails: { id: modId, title: modTitle, action: 'remove' }
          });
        });
      } else {
        // New user has been set up!
        u.allowedModules.forEach(modId => {
          const modTitle = MODULES.find(m => m.id === modId)?.title || modId;
          newNotifications.push({
            id: 'notif-' + Math.random().toString(36).substring(2, 11),
            username: u.username,
            title: 'Module Workspace Assigned',
            message: `During initialization, you were provisioned access to the '${modTitle}' module.`,
            timestamp,
            read: false,
            type: 'info',
            moduleDetails: { id: modId, title: modTitle, action: 'add' }
          });
        });
      }
    });

    if (newNotifications.length > 0) {
      setNotifications(prev => {
        const updated = [...newNotifications, ...prev];
        localStorage.setItem('yajur-notifications', JSON.stringify(updated));
        return updated;
      });
    }

    // Since we handle the users in handleUpdateUsersList above, 
    // the duplicated setUsersList(newUsers) should be removed to avoid double rendering.
    // However, we just kept it here. Let's just remove the localStorage call.
    
    // We already setUsersList earlier in handleUpdateUsersList but just in case:
    setUsersList(newUsers);
    
    const currentInNewList = newUsers.find(u => u.username.toLowerCase() === user?.username.toLowerCase());
    if (currentInNewList && user) {
      setUser({
        username: currentInNewList.username,
        role: currentInNewList.role,
        allowedModules: currentInNewList.allowedModules
      });
    }
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('yajur-notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleMarkAllNotificationsAsRead = (username: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.username === username ? { ...n, read: true } : n);
      localStorage.setItem('yajur-notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearAllNotifications = (username: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.username !== username);
      localStorage.setItem('yajur-notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const [activeModuleUrl, setActiveModuleUrl] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>(() => {
    const savedPins = localStorage.getItem('yajur-pins');
    const pinIds = savedPins ? JSON.parse(savedPins) : [];
    return MODULES.map(m => ({ ...m, pinned: pinIds.includes(m.id) }));
  });
  const [activities, setActivities] = useState<RecentActivity[]>(() => {
    const saved = localStorage.getItem('yajur-activities');
    return saved ? JSON.parse(saved) : [];
  });

  const { theme, config } = useTheme();
  const [lastTheme, setLastTheme] = useState<string>(theme);

  const logActivity = (action: string, moduleName?: string, customUser?: User) => {
    const activeUser = customUser || user;
    if (!activeUser) return;
    const newActivity: RecentActivity = {
      id: Math.random().toString(36).substring(2, 11),
      username: activeUser.username,
      role: activeUser.role,
      action,
      moduleName,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => {
      const updated = [newActivity, ...prev].slice(0, 50);
      localStorage.setItem('yajur-activities', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    if (user && lastTheme !== theme) {
      logActivity('Updated Theme Preset', THEME_PLATES[theme]?.name || theme);
      setLastTheme(theme);
    }
  }, [theme, user, lastTheme]);

  useEffect(() => {
    const pinIds = modules.filter(m => m.pinned).map(m => m.id);
    localStorage.setItem('yajur-pins', JSON.stringify(pinIds));
  }, [modules]);

  const togglePin = (moduleId: string) => {
    const isCurrentlyPinned = modules.find(m => m.id === moduleId)?.pinned;
    const name = modules.find(m => m.id === moduleId)?.title || moduleId;
    logActivity(isCurrentlyPinned ? 'Unpinned Node' : 'Pinned Node', name);
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, pinned: !m.pinned } : m
    ));
  };

  const handleSelectModule = (url: string | null) => {
    if (url) {
      const name = getModuleNameByUrl(url);
      logActivity('Accessed Node', name);
    } else {
      if (activeModuleUrl) {
        logActivity('Returned to Overview');
      }
    }
    setActiveModuleUrl(url);
  };

  const handleClearActivities = () => {
    setActivities([]);
    localStorage.removeItem('yajur-activities');
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    logActivity('Authenticated into Node', undefined, newUser);
    
    // Auto-open Lifting ERP for SQC and Sales on initial login
    if (newUser.role === 'production' || newUser.role === 'sales') {
      const liftingModule = MODULES.find(m => m.id === 'lifting');
      if (liftingModule && liftingModule.url) {
        setActiveModuleUrl(liftingModule.url);
      }
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (activeModuleUrl) {
      return (
        <div className="relative w-full h-full">
          <ModuleFrame url={activeModuleUrl} onBack={() => handleSelectModule(null)} />
        </div>
      );
    }

    return (
      <Dashboard 
        user={user}
        modules={modules}
        onSelectModule={handleSelectModule} 
        onTogglePin={togglePin}
        activities={activities}
        onClearActivities={handleClearActivities}
        usersList={usersList}
        onUpdateUsersList={handleUpdateUsersList}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onClearAllNotifications={handleClearAllNotifications}
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
          onLogout={() => {
            logActivity('Terminated Session / Logged Out');
            setUser(null);
            setActiveModuleUrl(null);
          }} 
          activeModuleUrl={activeModuleUrl}
          onSelectModule={handleSelectModule}
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
          ${activeModuleUrl ? 'pl-0' : 'lg:pl-[240px]'}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModuleUrl || 'dashboard'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
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
