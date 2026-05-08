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
    <div className="p-3 lg:p-5 space-y-6 max-w-[1700px] mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-100 mb-2">
        <div className="space-y-0.5">
          <h1 className={`text-xl lg:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 transition-colors`}>
            <span className={`w-1 h-6 bg-${config.primary} rounded-full transition-colors`} />
            Terminal / <span className={`text-${config.accent} uppercase transition-colors`}>{user.username}</span>
          </h1>
          <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.2em]">
            Operational Intelligence Grid
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative group w-48 sm:w-56">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`text-slate-400 group-focus-within:text-${config.accent} transition-colors`} size={14} />
            </div>
            <input 
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-semibold focus:outline-none focus:ring-4 focus:ring-${config.accent}/10 focus:border-${config.accent}/40 transition-all shadow-sm focus:bg-white`}
            />
          </div>

          <div className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
            {(Object.keys(THEME_PLATES) as ThemePlate[]).map((p) => (
              <button
                key={p}
                onClick={() => setTheme(p)}
                className={`w-5 h-5 rounded-lg transition-all transform active:scale-95
                  ${theme === p ? `ring-2 ring-${THEME_PLATES[p].primary} ring-offset-2 scale-110` : 'opacity-30 hover:opacity-100 hover:scale-105'} 
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
    </div>
  );
};

const InsightCard = ({ label, value, subValue, icon: Icon, themeColor }: any) => {
  return (
    <div className="bg-white border border-slate-100 p-5 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-16 h-16 bg-${themeColor}/5 rounded-bl-[4rem] transition-all group-hover:w-20 group-hover:h-20`} />
      
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className={`p-2.5 rounded-xl bg-slate-50 text-${themeColor} group-hover:bg-${themeColor} group-hover:text-white transition-all duration-500 shadow-sm`}>
          <Icon size={16} />
        </div>
        <p className="text-[10px] font-black text-slate-400 tracking-[0.15em] uppercase">{label}</p>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-black text-slate-900 leading-none tracking-tighter">{value}</h3>
        <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider opacity-60 border-t border-slate-50 pt-2 flex items-center gap-2">
          <span className={`w-1 h-1 rounded-full bg-${themeColor}`} />
          {subValue}
        </p>
      </div>
    </div>
  );
};

const ModuleCard = ({ module, index, onSelect }: any) => {
  const { config } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`group bg-white border border-slate-100 p-5 rounded-[1.5rem] shadow-sm hover:shadow-xl hover:border-${config.accent}/30 transition-all cursor-pointer flex flex-col h-full`}
      onClick={() => onSelect(module.url || module.id)}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 bg-slate-50 text-slate-400 group-hover:bg-${config.primary} group-hover:text-white rounded-xl transition-all duration-300 shadow-sm group-hover:shadow-${config.primary}/20`}>
          <LucideIcon name={module.icon} size={18} />
        </div>
        {module.badge && (
          <span className={`ml-auto px-2 py-0.5 bg-${config.accent}/5 text-${config.accent} text-[7px] font-black tracking-widest uppercase rounded-lg border border-${config.accent}/10`}>
            {module.badge}
          </span>
        )}
      </div>

      <div className="flex-1">
        <h3 className={`text-xs font-black text-slate-900 mb-1.5 group-hover:text-${config.accent} transition-colors uppercase tracking-tight`}>
          {module.title}
        </h3>
        <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-2">
          {module.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
        <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest group-hover:text-slate-400 transition-colors">Initialize</span>
        <ChevronRight size={14} className={`text-slate-300 group-hover:text-${config.accent} group-hover:translate-x-1 transition-all`} />
      </div>
    </motion.div>
  );
};
