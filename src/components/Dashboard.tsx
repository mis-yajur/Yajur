import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  ArrowRight, 
  LayoutGrid, 
  Pin, 
  Search,
  Zap,
  ShieldCheck,
  Star,
  Globe,
  TrendingUp,
  Activity,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { Module, User, Role, ThemePlate, TaskStats, SalesData } from '../types';
import { LucideIcon } from './LucideIcon';
import { useTheme } from '../context/ThemeContext';
import { THEME_PLATES, MODULES } from '../constants';

interface DashboardProps {
  user: User;
  modules: Module[];
  onSelectModule: (url: string | null) => void;
  onTogglePin: (moduleId: string) => void;
}

const API_KEY = 'AIzaSyAriKmI0OQAzmO3uH3EAK7598TkQBYT52I';
const SALES_SHEET_ID = '1TSheb5J1eGE7Ve_aeAbqe6_7CoOVwwxgxkLLpQB9GlA';
const TASK_SHEET_ID = '1aq7CXHNkpkWoJLhTDWkYG9CrszsRAY0v4sswWZC6fYE';
const CHECKLIST_SHEET_ID = '1fGudRr5zZy_3qDGloCptok3VtXbR3L5pK1fBHC4tb8c';

export const Dashboard = ({ user, modules, onSelectModule, onTogglePin }: DashboardProps) => {
  const { theme, setTheme, config } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [taskStats, setTaskStats] = useState<TaskStats>({ total: 0, pending: 0, done: 0 });
  const [salesData, setSalesData] = useState<SalesData>({ total: 0, target: 24, growth: 0 });

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
    if (user.role === 'admin') return true;
    if (user.role === 'store') return module.id === 'ims';
    if (user.role === 'hr') return module.id === 'hr';
    if (user.role === 'production') return module.id === 'production';
    if (user.role === 'pms') return module.id === 'pms';
    if (user.role === 'sales') return module.id === 'sales';
    if (user.role === 'office') return module.id === 'task';
    return false;
  });

  const pinnedModules = filteredModulesByRole.filter(m => m.pinned);
  const otherModules = filteredModulesByRole.filter(m => !m.pinned);
  
  const filteredOther = otherModules.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 space-y-10 max-w-[1700px] mx-auto pb-20">
      {/* Dynamic Navigation Bar / Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 py-6">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`inline-flex items-center gap-2 px-3 py-1 bg-${config.primary}/5 border border-${config.primary}/10 rounded-full`}
          >
            <div className={`w-1.5 h-1.5 rounded-full bg-${config.primary} animate-pulse`} />
            <span className={`text-[10px] font-black text-${config.primary} tracking-[0.2em] uppercase`}>
              Enterprise Portal Alpha
            </span>
          </motion.div>
          
          <div className="space-y-1">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Welcome back, <span className={`text-${config.primary}`}>{user.username}</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm lg:text-base max-w-xl">
              Manage your industrial ecosystem with real-time insights and vertical integration.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Quick Search */}
          <div className="relative group w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            </div>
            <input 
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100/50 transition-all shadow-sm"
            />
          </div>

          {/* Theme Plates */}
          <div className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
            {(Object.keys(THEME_PLATES) as ThemePlate[]).map((p) => (
              <button
                key={p}
                onClick={() => setTheme(p)}
                className={`w-9 h-9 rounded-xl transition-all flex items-center justify-center relative
                  ${theme === p ? 'scale-110 shadow-lg ring-2 ring-slate-200 ring-offset-2' : 'opacity-40 hover:opacity-100 hover:scale-105'} 
                  bg-${THEME_PLATES[p].primary}`}
                title={THEME_PLATES[p].name}
              >
                {theme === p && <ShieldCheck size={14} className="text-white" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Cards - Dynamic Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightCard 
          label="Sales Pipeline" 
          value={`₹${salesData.total.toFixed(1)} Cr`} 
          subValue={`${salesData.growth > 0 ? '+' : ''}${salesData.growth}% Forecast`}
          icon={TrendingUp}
          color="blue"
        />
        <InsightCard 
          label="Task Velocity" 
          value={taskStats.pending} 
          subValue={`${taskStats.done} Resolved Today`}
          icon={Activity}
          color="indigo"
        />
        <InsightCard 
          label="System Status" 
          value="NOMINAL" 
          subValue="99.9% Uptime Active"
          icon={Zap}
          color="emerald"
        />
        <InsightCard 
          label="Access Level" 
          value={user.role.toUpperCase()} 
          subValue="Full Node Permission"
          icon={ShieldCheck}
          color="slate"
        />
      </div>

      {/* Pinned Section */}
      {pinnedModules.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-xs font-black text-slate-400 tracking-[0.3em] uppercase">
              <Star className="text-amber-500" size={14} fill="currentColor" />
              Pinned Workflows
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pinnedModules.map((m, i) => (
              <ModuleCard key={m.id} module={m} index={i} onSelect={onSelectModule} onTogglePin={onTogglePin} isPinned={true} />
            ))}
          </div>
        </section>
      )}

      {/* Main Grid */}
      <section className="space-y-6 pt-4">
        <h2 className="flex items-center gap-3 text-xs font-black text-slate-400 tracking-[0.3em] uppercase">
          <LayoutGrid size={14} />
          Operational Ecosystem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOther.length > 0 ? (
            filteredOther.map((m, i) => (
              <ModuleCard key={m.id} module={m} index={i} onSelect={onSelectModule} onTogglePin={onTogglePin} isPinned={false} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white border border-dashed border-slate-300 rounded-[2.5rem]">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No resources matching filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const InsightCard = ({ label, value, subValue, icon: Icon, color }: any) => {
  return (
    <div className="group bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
      <div className={`absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-700 text-${color}-600`}>
        <Icon size={120} />
      </div>
      <div className="relative z-10 space-y-4">
        <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-900">{value}</h3>
          </div>
          <p className="text-[10px] font-bold text-slate-500 mt-1">{subValue}</p>
        </div>
      </div>
    </div>
  );
};

const ModuleCard = ({ module, index, onSelect, onTogglePin, isPinned }: any) => {
  const { config } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: 'backOut' }}
      whileHover={{ y: -8 }}
      className={`group relative bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col h-full
        ${isPinned ? `ring-2 ring-${config.primary}` : ''}`}
      onClick={() => onSelect(module.url || module.id)}
    >
      {/* Decorative Blob */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-${config.primary}/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`} />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-8">
          <div className={`p-4 bg-${config.primary}/10 text-${config.primary} rounded-2xl group-hover:bg-${config.primary} group-hover:text-white transition-all duration-500 shadow-sm shadow-${config.primary}/20`}>
            <LucideIcon name={module.icon} size={28} />
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onTogglePin(module.id); }}
              className={`p-2 rounded-xl transition-all duration-300 ${isPinned ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100'}`}
            >
              <Pin size={16} fill={isPinned ? 'currentColor' : 'none'} className={isPinned ? '' : '-rotate-45'} />
            </button>
            {module.badge && (
              <span className={`px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black tracking-widest uppercase rounded-lg`}>
                {module.badge}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1">
          <h3 className={`text-xl font-black text-slate-900 mb-2 group-hover:text-${config.primary} transition-colors`}>
            {module.title}
          </h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">
            {module.description}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-5 h-5 rounded-full bg-slate-200 border-2 border-white" />
              ))}
            </div>
            <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase">Active Nodes</span>
          </div>
          <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-${config.primary} group-hover:text-white transition-all duration-500`}>
            <ChevronRight size={20} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
