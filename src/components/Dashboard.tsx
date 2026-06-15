import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search,
  Zap,
  ShieldCheck,
  TrendingUp,
  Activity,
  ChevronRight,
  LayoutGrid,
  LayoutDashboard,
  LogIn,
  LogOut,
  Compass,
  Sliders,
  Pin,
  Palette,
  Clock,
  Trash2,
  UserPlus,
  Shield,
  KeyRound,
  Check,
  X
} from 'lucide-react';
import { Module, User, ThemePlate, TaskStats, SalesData, RecentActivity, UserCredential, Role } from '../types';
import { LucideIcon } from './LucideIcon';
import { useTheme } from '../context/ThemeContext';
import { THEME_PLATES, MODULES } from '../constants';

interface DashboardProps {
  user: User;
  modules: Module[];
  onSelectModule: (url: string | null) => void;
  onTogglePin: (moduleId: string) => void;
  activities: RecentActivity[];
  onClearActivities: () => void;
  usersList?: UserCredential[];
  onUpdateUsersList?: (newUsers: UserCredential[]) => void;
}

const API_KEY = 'AIzaSyAriKmI0OQAzmO3uH3EAK7598TkQBYT52I';
const SALES_SHEET_ID = '1TSheb5J1eGE7Ve_aeAbqe6_7CoOVwwxgxkLLpQB9GlA';
const TASK_SHEET_ID = '1aq7CXHNkpkWoJLhTDWkYG9CrszsRAY0v4sswWZC6fYE';

export const Dashboard = ({ 
  user, 
  modules, 
  onSelectModule, 
  onTogglePin, 
  activities, 
  onClearActivities,
  usersList = [],
  onUpdateUsersList
}: DashboardProps) => {
  const { theme, setTheme, config } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [taskStats, setTaskStats] = useState<TaskStats>({ total: 0, pending: 0, done: 0 });
  const [salesData, setSalesData] = useState<SalesData>({ total: 0, target: 24, growth: 0 });

  // Admin access control states
  const [createUsername, setCreateUsername] = useState('');
  const [createPassword, setCreatePassword] = useState('1234');
  const [createRole, setCreateRole] = useState<Role>('production');
  const [createAllowedModules, setCreateAllowedModules] = useState<string[]>(['production', 'lifting']);
  const [activeManageUserId, setActiveManageUserId] = useState<string | null>(null);
  const [editPasswordUserId, setEditPasswordUserId] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  // Automatically sync createAllowedModules defaults when role changes
  useEffect(() => {
    let defaults: string[] = [];
    if (createRole === 'admin') defaults = MODULES.map(m => m.id);
    else if (createRole === 'store') defaults = ['ims'];
    else if (createRole === 'hr') defaults = ['hr'];
    else if (createRole === 'production') defaults = ['production', 'lifting'];
    else if (createRole === 'pms') defaults = ['pms'];
    else if (createRole === 'sales') defaults = ['sales', 'lifting'];
    else if (createRole === 'office') defaults = ['task'];
    setCreateAllowedModules(defaults);
  }, [createRole]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, salesRes] = await Promise.all([
          fetch(`https://sheets.googleapis.com/v4/spreadsheets/${TASK_SHEET_ID}/values/Task-Data!A2:C2?key=${API_KEY}`),
          fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SALES_SHEET_ID}/values/Sale!A2:C2?key=${API_KEY}`)
        ]);
        
        const taskJson = await taskRes.json();
        const salesJson = await salesRes.json();

        if (taskJson.values?.[0]) {
          setTaskStats({
            total: parseInt(taskJson.values[0][0]) || 0,
            pending: parseInt(taskJson.values[0][1]) || 0,
            done: parseInt(taskJson.values[0][2]) || 0,
          });
        }

        if (salesJson.values?.[0]) {
          const rawTotal = parseFloat(salesJson.values[0][0].replace(/[^0-9.-]+/g, '')) || 0;
          const rawTarget = parseFloat(salesJson.values[0][1].replace(/[^0-9.-]+/g, '')) || 240000;
          const rawGrowth = parseFloat(salesJson.values[0][2].replace(/[^0-9.-]+/g, '')) || 0;
          
          setSalesData({
            total: rawTotal / 10,
            target: rawTarget / 10000,
            growth: rawGrowth
          });
        }
      } catch (e) {
        console.error('Board Error:', e);
      }
    };
    fetchData();
  }, []);

  const filteredModulesByRole = modules.filter(module => {
    if (user.allowedModules) {
      return user.allowedModules.includes(module.id);
    }
    if (user.role === 'admin') return true;
    if (user.role === 'store') return module.id === 'ims';
    if (user.role === 'hr') return module.id === 'hr';
    if (user.role === 'production') return module.id === 'production' || module.id === 'lifting';
    if (user.role === 'pms') return module.id === 'pms';
    if (user.role === 'sales') return module.id === 'sales' || module.id === 'lifting';
    if (user.role === 'office') return module.id === 'task';
    return false;
  });

  // Helper methods for dynamic user administration
  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');
    
    if (!createUsername.trim()) {
      setAdminError('Username is required.');
      return;
    }
    
    // Check duplication case insensitive
    if (usersList.some(u => u.username.toLowerCase() === createUsername.trim().toLowerCase())) {
      setAdminError(`An operator named "${createUsername}" already exists.`);
      return;
    }
    
    const newUser: UserCredential = {
      username: createUsername.trim(),
      pass: createPassword || '1234',
      role: createRole,
      allowedModules: [...createAllowedModules]
    };
    
    if (onUpdateUsersList) {
      onUpdateUsersList([...usersList, newUser]);
      setAdminSuccess(`Successfully registered node: ${createUsername.trim()}`);
      setCreateUsername('');
      setCreatePassword('1234');
    }
  };

  const handleDeleteUser = (usernameToDelete: string) => {
    setAdminError('');
    setAdminSuccess('');
    
    if (['admin', 'manager'].includes(usernameToDelete.toLowerCase())) {
      setAdminError('Main system controllers (Admin/Manager) cannot be removed.');
      return;
    }
    
    if (usernameToDelete.toLowerCase() === user.username.toLowerCase()) {
      setAdminError('You cannot terminate your own active administrator session.');
      return;
    }
    
    if (onUpdateUsersList) {
      onUpdateUsersList(usersList.filter(u => u.username !== usernameToDelete));
      setAdminSuccess(`Node "${usernameToDelete}" terminated from grid.`);
    }
  };

  const handleToggleModuleForUser = (targetUsername: string, moduleId: string) => {
    if (!onUpdateUsersList) return;
    
    const updatedList = usersList.map(u => {
      if (u.username === targetUsername) {
        const isAllowed = u.allowedModules.includes(moduleId);
        const newAllowed = isAllowed 
          ? u.allowedModules.filter(id => id !== moduleId) 
          : [...u.allowedModules, moduleId];
        return { ...u, allowedModules: newAllowed };
      }
      return u;
    });
    onUpdateUsersList(updatedList);
  };

  const handleUserRoleChange = (targetUsername: string, newRole: Role) => {
    if (!onUpdateUsersList) return;
    
    const updatedList = usersList.map(u => {
      if (u.username === targetUsername) {
        let standardModules: string[] = [];
        if (newRole === 'admin') standardModules = MODULES.map(m => m.id);
        else if (newRole === 'store') standardModules = ['ims'];
        else if (newRole === 'hr') standardModules = ['hr'];
        else if (newRole === 'production') standardModules = ['production', 'lifting'];
        else if (newRole === 'pms') standardModules = ['pms'];
        else if (newRole === 'sales') standardModules = ['sales', 'lifting'];
        else if (newRole === 'office') standardModules = ['task'];
        
        return { ...u, role: newRole, allowedModules: standardModules };
      }
      return u;
    });
    onUpdateUsersList(updatedList);
  };

  const handleSavePassword = (targetUsername: string) => {
    if (!onUpdateUsersList) return;
    if (!tempPassword.trim()) return;
    
    const updatedList = usersList.map(u => {
      if (u.username === targetUsername) {
        return { ...u, pass: tempPassword.trim() };
      }
      return u;
    });
    onUpdateUsersList(updatedList);
    setEditPasswordUserId(null);
    setTempPassword('');
    setAdminSuccess(`Access key updated for node: ${targetUsername}`);
  };

  const filteredOther = filteredModulesByRole.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`p-4 lg:p-10 space-y-10 max-w-[1700px] mx-auto pb-24 transition-all duration-700`}>
      {/* Enterprise Mission Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-6 border-b border-slate-100 flex-shrink-0">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-8 bg-${config.primary} rounded-full shadow-[0_0_20px_rgba(20,184,166,0.6)]`} />
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
              Terminal / <span className={`text-${config.accent} uppercase font-mono`}>{user.username}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 ml-5">
            <p className="text-slate-400 font-black text-xs uppercase tracking-[0.4em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              Intelligence Node Access
            </p>
            <div className="h-4 w-[1px] bg-slate-200" />
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              Central Grid Protocol v4.2.0
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          {/* Advanced Search Interface */}
          <div className="relative group w-full sm:w-80">
            <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-${config.accent} transition-all`}>
              <Search size={18} />
            </div>
            <input 
              type="text"
              placeholder="Search components, data, telemetry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`block w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold tracking-wide focus:outline-none focus:ring-8 focus:ring-${config.accent}/5 focus:border-${config.accent}/30 transition-all shadow-sm focus:bg-white placeholder:text-slate-400 uppercase`}
            />
          </div>

          <div className="flex items-center gap-2 p-2 bg-white border border-slate-100 rounded-[1.25rem] shadow-sm">
            {(Object.keys(THEME_PLATES) as ThemePlate[]).map((p) => (
              <button
                key={p}
                onClick={() => setTheme(p)}
                className={`w-7 h-7 rounded-xl transition-all transform active:scale-90 relative
                  ${theme === p ? `ring-2 ring-${THEME_PLATES[p].primary} ring-offset-4 scale-110 shadow-2xl z-10` : 'opacity-10 hover:opacity-100 hover:-rotate-12'} 
                  bg-${THEME_PLATES[p].primary}`}
                title={THEME_PLATES[p].name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard 
          label="Sales Intelligence" 
          value={`₹${salesData.total.toFixed(1)} Cr`} 
          subValue="Revenue Realization"
          icon={TrendingUp}
          themeColor={config.accent}
        />
        <InsightCard 
          label="Operations Queue" 
          value={taskStats.pending} 
          subValue="Active Delegations"
          icon={Activity}
          themeColor="slate-400"
        />
        <InsightCard 
          label="Core Engine" 
          value="SYNCED" 
          subValue="Connection Status"
          icon={Zap}
          themeColor={config.primary}
        />
        <InsightCard 
          label="Access Level" 
          value={user.role.toUpperCase()} 
          subValue="Security Clearance"
          icon={ShieldCheck}
          themeColor="slate-900"
        />
      </div>

      {/* Main Grid */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 opacity-50">
          <LayoutGrid size={12} className="text-slate-600" />
          <h2 className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase">
            Available Modules
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {filteredOther.length > 0 ? (
            filteredOther.map((m, i) => (
              <ModuleCard key={m.id} module={m} index={i} onSelect={onSelectModule} />
            ))
          ) : (
            <div className="col-span-full py-8 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Inventory Empty</p>
            </div>
          )}
        </div>
      </section>

      {/* Dynamic User Access & Operator Matrix (Admin-Only Panel) */}
      {user.role === 'admin' && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 opacity-50">
            <Shield size={12} className="text-slate-600" />
            <h2 className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase">
              Operator Access & Node Matrix Control
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Operator Listing & Permission Configurator */}
            <div className="lg:col-span-2 bg-white/70 backdrop-blur-md border border-slate-150 rounded-[2rem] shadow-[0_4px_24px_rgb(0,0,0,0.02)] p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Active Operator Nodes</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Real-time status & active system permissions</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[8px] font-extrabold uppercase tracking-widest bg-${config.accent}/10 text-${config.accent}`}>
                  {usersList.length} Registered Nodes
                </span>
              </div>

              {adminSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100/50 text-emerald-700 rounded-2xl text-[10px] font-bold flex items-center gap-2 uppercase tracking-wider">
                  <Check size={14} className="text-emerald-500" />
                  {adminSuccess}
                </div>
              )}

              {adminError && (
                <div className="p-4 bg-rose-50 border border-rose-100/50 text-rose-700 rounded-2xl text-[10px] font-bold flex items-center gap-2 uppercase tracking-wider">
                  <X size={14} className="text-rose-500" />
                  {adminError}
                </div>
              )}

              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto custom-scrollbar-light space-y-4 pr-1">
                {usersList.map((op) => {
                  const isCurrentSessionUser = op.username.toLowerCase() === user.username.toLowerCase();
                  const isSystemDefaultAdmins = ['admin', 'manager'].includes(op.username.toLowerCase());
                  const isExpanded = activeManageUserId === op.username;

                  return (
                    <div key={op.username} className="pt-4 first:pt-0 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl bg-slate-50 text-slate-500 border border-slate-100 flex items-center justify-center shrink-0`}>
                            <Shield size={16} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{op.username}</span>
                              {isCurrentSessionUser && (
                                <span className="px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">ACTIVE</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] font-bold text-slate-400 capitalize">Role Class:</span>
                              <select
                                value={op.role}
                                onChange={(e) => handleUserRoleChange(op.username, e.target.value as Role)}
                                className="bg-transparent border-0 p-0 text-[10px] font-black text-slate-700 uppercase tracking-tight focus:ring-0 focus:outline-none cursor-pointer"
                              >
                                <option value="admin">Admin</option>
                                <option value="store">Store</option>
                                <option value="hr">Hr</option>
                                <option value="production">Production / SQC</option>
                                <option value="pms">PMS</option>
                                <option value="sales">Sales</option>
                                <option value="office">Office</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Middle: password edit or display */}
                        <div className="flex items-center gap-2 font-mono text-[10px]">
                          {editPasswordUserId === op.username ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={tempPassword}
                                onChange={(e) => setTempPassword(e.target.value)}
                                placeholder="new pass"
                                className="px-2 py-1 border border-slate-200 rounded text-[9px] font-mono text-slate-700 w-20 focus:outline-none focus:border-slate-350"
                              />
                              <button
                                onClick={() => handleSavePassword(op.username)}
                                className="p-1 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 animate-pulse"
                                title="Save Password"
                              >
                                <Check size={10} />
                              </button>
                              <button
                                onClick={() => setEditPasswordUserId(null)}
                                className="p-1 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200"
                                title="Cancel"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-slate-400">
                              <span>KEY: <span className="text-slate-600 font-extrabold">{op.pass}</span></span>
                              <button
                                onClick={() => {
                                  setEditPasswordUserId(op.username);
                                  setTempPassword(op.pass);
                                }}
                                className="text-[8px] font-black uppercase text-slate-400 hover:text-slate-600 tracking-wider hover:underline"
                              >
                                (Change)
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Multi Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveManageUserId(isExpanded ? null : op.username)}
                            className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border
                              ${isExpanded 
                                ? `bg-${config.accent}/10 border-${config.accent}/25 text-${config.accent}` 
                                : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'}`}
                          >
                            {isExpanded ? 'Hide Models' : 'Assign Models'}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(op.username)}
                            disabled={isCurrentSessionUser || isSystemDefaultAdmins}
                            className={`p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50/50 transition-all border border-transparent hover:border-rose-100/50
                              ${(isCurrentSessionUser || isSystemDefaultAdmins) ? 'opacity-30 cursor-not-allowed' : ''}`}
                            title="Decommission Node"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Permission Grid Configurer */}
                      {isExpanded && (
                        <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-3 animate-fadeIn">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Select Permitted Active Models / Modules:</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {MODULES.map((m) => {
                              const hasAccess = op.allowedModules.includes(m.id);
                              return (
                                <button
                                  key={m.id}
                                  onClick={() => handleToggleModuleForUser(op.username, m.id)}
                                  className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all
                                    ${hasAccess 
                                      ? `bg-white border-${config.accent}/30 text-slate-800 shadow-sm` 
                                      : 'bg-transparent border-slate-150/65 text-slate-400 hover:bg-slate-100/50'}`}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <div className={`text-slate-500 ${hasAccess ? `text-${config.accent}` : ''}`}>
                                      <LucideIcon name={m.icon} size={11} />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-tight truncate">{m.title}</span>
                                  </div>
                                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0
                                    ${hasAccess ? `bg-${config.accent} border-transparent text-white` : 'border-slate-300 bg-white'}`}>
                                    {hasAccess && <Check size={8} strokeWidth={4} />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Deploy New Operator Node Form */}
            <div className="bg-white/70 backdrop-blur-md border border-slate-150 rounded-[2rem] shadow-[0_4px_24px_rgb(0,0,0,0.02)] p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Deploy Node</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Register a new network workspace account</p>
                </div>

                <form onSubmit={handleCreateUserSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-450 uppercase tracking-[0.2em] px-1">Operator Username</label>
                    <input
                      type="text"
                      placeholder="e.g. QualityAudit"
                      value={createUsername}
                      onChange={(e) => setCreateUsername(e.target.value.replace(/\s+/g, ''))}
                      className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 tracking-wide focus:outline-none focus:border-slate-350"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-450 uppercase tracking-[0.2em] px-1">Access Key / Password</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="default: 1234"
                        value={createPassword}
                        onChange={(e) => setCreatePassword(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 tracking-wide focus:outline-none focus:border-slate-350"
                        required
                      />
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <KeyRound size={12} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-450 uppercase tracking-[0.2em] px-1">Role Blueprint Class</label>
                    <div className="relative">
                      <select
                        value={createRole}
                        onChange={(e) => setCreateRole(e.target.value as Role)}
                        className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 tracking-wide focus:outline-none focus:border-slate-350 uppercase"
                      >
                        <option value="admin">Admin</option>
                        <option value="store">Store</option>
                        <option value="hr">Hr</option>
                        <option value="production">Production / SQC</option>
                        <option value="pms">PMS</option>
                        <option value="sales">Sales</option>
                        <option value="office">Office</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-450 uppercase tracking-[0.2em] px-1">Preset App Models Active ({createAllowedModules.length})</label>
                    <div className="p-3 bg-slate-50 border border-slate-150/60 rounded-xl space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar-light">
                      {MODULES.map((m) => {
                        const isToggled = createAllowedModules.includes(m.id);
                        return (
                          <label key={m.id} className="flex items-center gap-2 cursor-pointer py-0.5 block">
                            <input
                              type="checkbox"
                              checked={isToggled}
                              onChange={() => {
                                setCreateAllowedModules(prev => 
                                  isToggled ? prev.filter(id => id !== m.id) : [...prev, m.id]
                                );
                              }}
                              className={`rounded border-slate-300 text-${config.accent} focus:ring-${config.accent}`}
                            />
                            <span className="text-[9px] font-bold uppercase tracking-tight text-slate-600">{m.title}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white hover:shadow-md rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all`}
                  >
                    <UserPlus size={14} />
                    Deploy Operator Node
                  </button>
                </form>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 text-center">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1">
                  <ShieldCheck size={9} className="text-emerald-500 animate-pulse" />
                  Secure Control Plane synced
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Security & Access Audit Trail */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 opacity-50">
            <Activity size={12} className="text-slate-600" />
            <h2 className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase">
              Security & Access Audit Trail
            </h2>
          </div>
          
          {user.role === 'admin' && activities.length > 0 && (
            <button 
              onClick={onClearActivities}
              className="flex items-center gap-1.5 px-3 py-1 text-[9px] font-black tracking-wider uppercase text-rose-500 hover:text-rose-700 hover:bg-rose-50/50 rounded-xl transition-all border border-rose-100/60 hover:border-rose-200"
            >
              <Trash2 size={10} />
              Clear Audit Log
            </button>
          )}
        </div>

        <div className="bg-white/70 backdrop-blur-md border border-slate-150/85 rounded-[2rem] shadow-[0_4px_24px_rgb(0,0,0,0.02)] overflow-hidden">
          {activities.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No security logs recorded</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100/70 max-h-[400px] overflow-y-auto custom-scrollbar-light">
              {activities.map((act) => {
                const actionIcon = getActionIcon(act.action);
                const iconColorClasses = getIconColor(act.action);
                
                return (
                  <div key={act.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${iconColorClasses} shrink-0 shadow-sm flex items-center justify-center`}>
                        {actionIcon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{act.action}</p>
                          {act.moduleName && (
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-${config.accent}/10 text-${config.accent}`}>
                              {act.moduleName}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                          Operator: <span className="text-slate-700 font-black">{act.username}</span> 
                          <span className="mx-2 text-slate-300">|</span> 
                          Node: <span className="text-slate-500 font-extrabold uppercase">{act.role}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0 sm:text-right">
                      <div className="hidden sm:block">
                        <span className={`px-2.5 py-1 rounded-full border text-[8px] font-extrabold uppercase tracking-widest bg-emerald-50 text-emerald-600 border-emerald-100/80`}>
                          SECURE NODE
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock size={11} className="text-slate-400" />
                        <span className="text-[10px] font-mono font-bold text-slate-500">{formatTimestamp(act.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const getActionIcon = (action: string) => {
  if (action.includes('Authenticated') || action.includes('Login')) {
    return <LogIn size={14} />;
  }
  if (action.includes('Terminated') || action.includes('Logout') || action.includes('Out')) {
    return <LogOut size={14} />;
  }
  if (action.includes('Accessed') || action.includes('Launch')) {
    return <Compass size={14} />;
  }
  if (action.includes('Pinned') || action.includes('Unpinned')) {
    return <Pin size={14} />;
  }
  if (action.includes('Theme')) {
    return <Palette size={14} />;
  }
  return <Sliders size={14} />;
};

const getIconColor = (action: string) => {
  if (action.includes('Authenticated') || action.includes('Login')) return 'bg-emerald-50 text-emerald-650 border border-emerald-100/60';
  if (action.includes('Terminated') || action.includes('Logout') || action.includes('Out')) return 'bg-rose-50 text-rose-650 border border-rose-100/60';
  if (action.includes('Accessed') || action.includes('Launch')) return 'bg-blue-50 text-blue-600 border border-blue-100';
  if (action.includes('Pinned') || action.includes('Unpinned')) return 'bg-amber-50 text-amber-600 border border-amber-100';
  if (action.includes('Theme')) return 'bg-purple-50 text-purple-600 border border-purple-100';
  return 'bg-slate-50 text-slate-600 border border-slate-150';
};

const formatTimestamp = (isoString: string) => {
  try {
    const d = new Date(isoString);
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  } catch (e) {
    return isoString;
  }
};

const InsightCard = ({ label, value, subValue, icon: Icon, themeColor }: any) => {
  return (
    <div className="bg-white/70 backdrop-blur-md border border-slate-100 p-6 rounded-[2rem] shadow-[0_4px_24px_rgb(0,0,0,0.03)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-${themeColor}/5 rounded-bl-[5rem] transition-all group-hover:w-32 group-hover:h-32 group-hover:bg-${themeColor}/10`} />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className={`p-3 rounded-2xl bg-white border border-slate-50 text-${themeColor} group-hover:bg-${themeColor} group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)]`}>
          <Icon size={20} />
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase leading-none">{label}</p>
          <div className="flex items-center gap-1 justify-end mt-1.5">
            <div className={`w-1 h-1 rounded-full bg-${themeColor}`} />
            <div className={`w-3 h-1 rounded-full bg-${themeColor}/30`} />
          </div>
        </div>
      </div>
      
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <h3 className="text-3xl font-black text-slate-900 leading-none tracking-tighter mb-2">{value}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="opacity-40">{subValue}</span>
          </p>
        </div>
        <div className="h-8 flex items-end gap-0.5 pb-1">
          {[40, 70, 45, 90, 60, 85].map((h, i) => (
            <div 
              key={i} 
              style={{ height: `${h}%` }} 
              className={`w-1 rounded-full bg-${themeColor} opacity-[0.2] transition-all group-hover:opacity-[0.6] group-hover:scale-y-110`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ModuleCard = ({ module, index, onSelect }: any) => {
  const { config } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -8, scale: 1.03 }}
      className={`group bg-white/80 backdrop-blur-sm border border-slate-100 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:border-${config.accent}/40 transition-all duration-500 cursor-pointer flex flex-col h-full relative overflow-hidden`}
      onClick={() => onSelect(module.url || module.id)}
    >
      <div className={`absolute -right-10 -bottom-10 w-24 h-24 bg-${config.accent}/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className={`p-3.5 bg-slate-50 text-slate-400 group-hover:bg-${config.primary} group-hover:text-white rounded-2xl transition-all duration-500 shadow-sm group-hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)] group-hover:-rotate-6`}>
          <LucideIcon name={module.icon} size={20} />
        </div>
        {module.badge && (
          <span className={`ml-auto px-3 py-1 bg-${config.accent}/5 text-${config.accent} text-[8px] font-black tracking-widest uppercase rounded-full border border-${config.accent}/10 shadow-sm`}>
            {module.badge}
          </span>
        )}
      </div>

      <div className="flex-1 relative z-10">
        <h3 className={`text-sm font-black text-slate-900 mb-2 group-hover:text-${config.accent} transition-colors uppercase tracking-tight`}>
          {module.title}
        </h3>
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2 opacity-80">
          {module.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50/50 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full bg-${config.accent} scale-0 group-hover:scale-100 transition-transform duration-500`} />
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover:text-slate-900 transition-colors">Launch Module</span>
        </div>
        <ChevronRight size={16} className={`text-slate-300 group-hover:text-${config.accent} group-hover:translate-x-1.5 transition-all duration-500`} />
      </div>
    </motion.div>
  );
};
