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
    <div className={`p-4 lg:p-12 space-y-12 max-w-[1800px] mx-auto pb-24 transition-all duration-700`}>
      {/* Enterprise Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 py-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-50`}>
              <Globe className={`text-${config.accent}`} size={24} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                Analytics <span className="text-slate-400">Dashboard</span>
              </h1>
              <p className="text-slate-400 font-medium text-sm mt-3 max-w-xl">
                Real-time operational monitoring and enterprise resource synchronization protocol. 
                Manage nodes, track sales realization, and delegate mission-critical tasks through the central grid.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-8 ml-1">
            <button className={`px-6 py-2.5 bg-${config.accent} text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-${config.accent}/20 hover:scale-105 transition-all`}>Variation 1</button>
            <button className={`px-6 py-2.5 bg-white text-slate-400 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all`}>Variation 2</button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 p-2 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="relative group w-full sm:w-64">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300`}>
                <Search size={16} />
              </div>
              <input 
                type="text"
                placeholder="Search telemetry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`block w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-${config.accent}/5 transition-all`}
              />
            </div>
            <div className="h-6 w-[1px] bg-slate-100" />
            <div className="flex items-center gap-1.5 px-2">
              {(Object.keys(THEME_PLATES) as ThemePlate[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setTheme(p)}
                  className={`w-6 h-6 rounded-lg transition-all ${theme === p ? `ring-2 ring-${THEME_PLATES[p].primary} ring-offset-2 scale-110` : 'opacity-20 hover:opacity-100'} bg-${THEME_PLATES[p].primary}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Performance Section */}
      <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 py-4 px-8">
           <button className="px-5 py-2 border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">View All</button>
        </div>
        
        <div className="mb-12">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-1">Portfolio Performance</h2>
          <div className={`h-1 w-20 bg-${config.accent} rounded-full`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          <InsightCard 
            label="Cash Deposits" 
            value={`₹${salesData.total.toFixed(1)}M`} 
            subValue="54.1% less earnings"
            icon={TrendingUp}
            themeColor="orange-500"
            variant="hero"
          />
          <InsightCard 
            label="Invested Dividends" 
            value="₹9M" 
            subValue="Grow Rate: 14.1%"
            icon={Zap}
            themeColor="pink-500"
            variant="hero"
          />
          <InsightCard 
            label="Capital Gains" 
            value="$563" 
            subValue="Increased by 7.35%"
            icon={ShieldCheck}
            themeColor="emerald-500"
            variant="hero"
          />
        </div>

        <div className="mt-12 pt-8 border-t border-slate-50 flex justify-center">
            <button className={`flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all`}>
              View Complete Report
              <ChevronRight size={18} />
            </button>
        </div>
      </section>

      {/* Grid Layout for Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full bg-${config.accent}`} />
                Core Operations
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredOther.slice(0, 4).map((m, i) => (
                <ModuleCard key={m.id} module={m} index={i} onSelect={onSelectModule} />
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Technical Support
              </h2>
            </div>
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 h-[500px] flex flex-col items-center justify-center space-y-6 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
                  <Activity size={40} />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">System Telemetry</h3>
                  <p className="text-xs font-medium text-slate-400 max-w-[200px] mx-auto">Connecting to core industrial engine for real-time visualization...</p>
                </div>
                <div className="flex gap-1">
                  {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-500/20 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                </div>
            </div>
          </section>
      </div>
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
