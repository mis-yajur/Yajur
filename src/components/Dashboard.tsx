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
    <div className="p-4 lg:p-6 space-y-8 max-w-[1700px] mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-4">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Terminal / <span className="text-blue-600 uppercase">{user.username}</span>
          </h1>
          <p className="text-slate-500 font-medium text-xs lg:text-sm">
            Operational dashboard for vertical enterprise integration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Search */}
          <div className="relative group w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
            </div>
            <input 
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            {(Object.keys(THEME_PLATES) as ThemePlate[]).map((p) => (
              <button
                key={p}
                onClick={() => setTheme(p)}
                className={`w-7 h-7 rounded-lg transition-all flex items-center justify-center
                  ${theme === p ? 'ring-2 ring-blue-500' : 'opacity-40 hover:opacity-100'} 
                  bg-${THEME_PLATES[p].primary}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Overview Cards - Professional Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard 
          label="Sales Pipeline" 
          value={`₹${salesData.total.toFixed(1)} Cr`} 
          subValue={`${salesData.growth > 0 ? '+' : ''}${salesData.growth}% Growth`}
          icon={TrendingUp}
          color="blue"
        />
        <InsightCard 
          label="Pending Tasks" 
          value={taskStats.pending} 
          subValue="Real-time queue"
          icon={Activity}
          color="indigo"
        />
        <InsightCard 
          label="System Node" 
          value="ACTIVE" 
          subValue="Latency 12ms"
          icon={Zap}
          color="emerald"
        />
        <InsightCard 
          label="Security Role" 
          value={user.role.toUpperCase()} 
          subValue="Standard Clearance"
          icon={ShieldCheck}
          color="slate"
        />
      </div>

      {/* Main Grid */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 bg-blue-600 rounded-full" />
          <h2 className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
            Operational Ecosystem
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredOther.length > 0 ? (
            filteredOther.map((m, i) => (
              <ModuleCard key={m.id} module={m} index={i} onSelect={onSelectModule} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-white border border-dashed border-slate-200 rounded-3xl">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No assets found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const InsightCard = ({ label, value, subValue, icon: Icon, color }: any) => {
  return (
    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{label}</p>
        <div className={`p-1.5 rounded-lg bg-${color}-50 text-${color}-600`}>
          <Icon size={14} />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-black text-slate-900">{value}</h3>
        <p className="text-[10px] font-bold text-slate-500 mt-0.5">{subValue}</p>
      </div>
    </div>
  );
};

const ModuleCard = ({ module, index, onSelect }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      className="group bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col h-full"
      onClick={() => onSelect(module.url || module.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white rounded-xl transition-all duration-300`}>
          <LucideIcon name={module.icon} size={20} />
        </div>
        {module.badge && (
          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-black tracking-widest uppercase rounded">
            {module.badge}
          </span>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
          {module.title}
        </h3>
        <p className="text-[11px] text-slate-500 font-medium leading-tight line-clamp-2">
          {module.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-end">
        <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
      </div>
    </motion.div>
  );
};
