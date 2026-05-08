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
  LayoutDashboard
} from 'lucide-react';
import { Module, User, ThemePlate, TaskStats, SalesData } from '../types';
import { LucideIcon } from './LucideIcon';
import { useTheme } from '../context/ThemeContext';
import { THEME_PLATES } from '../constants';

interface DashboardProps {
  user: User;
  modules: Module[];
  onSelectModule: (url: string | null) => void;
  onTogglePin: (moduleId: string) => void;
}

const API_KEY = 'AIzaSyAriKmI0OQAzmO3uH3EAK7598TkQBYT52I';
const SALES_SHEET_ID = '1TSheb5J1eGE7Ve_aeAbqe6_7CoOVwwxgxkLLpQB9GlA';
const TASK_SHEET_ID = '1aq7CXHNkpkWoJLhTDWkYG9CrszsRAY0v4sswWZC6fYE';

export const Dashboard = ({ user, modules, onSelectModule }: DashboardProps) => {
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
    </div>
  );
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
