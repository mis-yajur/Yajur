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
  ChevronRight,
  Settings,
  Bell,
  MessageSquare,
  MoreHorizontal,
  LayoutDashboard,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
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

  // Simulation data for the chart
  const chartData = [
    { name: 'Jan', val: 30 },
    { name: 'Feb', val: 45 },
    { name: 'Mar', val: 28 },
    { name: 'Apr', val: 78 },
    { name: 'May', val: 40 },
    { name: 'Jun', val: 56 },
    { name: 'Jul', val: 45 },
  ];

  const timelineData = [
    { id: 1, title: 'All Hands Meeting', time: '10:00 AM', status: 'completed', color: 'blue' },
    { id: 2, title: 'Build the production release', time: 'NEW', status: 'new', color: 'red' },
    { id: 3, title: 'Something not important', time: 'Pending', status: 'pending', color: 'yellow' },
    { id: 4, title: 'This dot has an info state', time: '12:00 PM', status: 'info', color: 'cyan' },
  ];

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
    <div className={`p-0 lg:p-0 space-y-0 max-w-full mx-auto pb-24 transition-all duration-700 bg-slate-50 min-h-screen`}>
      
      {/* Architect Top Bar */}
      <div className="bg-white border-b border-slate-100 flex items-center justify-between px-8 py-4 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-sm font-medium w-64 uppercase tracking-widest"
            />
          </div>
          <div className="h-6 w-[1px] bg-slate-100 hidden md:block" />
          <div className="hidden md:flex items-center gap-4">
             <button className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Mega Menu</button>
             <button className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Settings</button>
             <button className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Projects</button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all">
                <Bell size={18} />
             </div>
             <div className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all relative">
                <MessageSquare size={18} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
             </div>
          </div>
          <div className="h-6 w-[1px] bg-slate-100" />
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 leading-none">Alina Mcloud</p>
                <p className="text-[10px] font-medium text-slate-400 mt-1">VP People Manager</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white p-1 shadow-lg shadow-blue-200">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="Avatar" className="w-full h-full object-cover rounded-lg" />
             </div>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-10 space-y-10">
        {/* Analytics Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-4 bg-slate-50 rounded-2xl text-blue-600 shadow-sm">
                <LayoutDashboard size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Analytics Dashboard</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">This is an example dashboard created using built-in elements and components.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 relative z-10">
             <button className="p-3 bg-slate-900 text-white rounded-lg shadow-xl hover:scale-105 active:scale-95 transition-all">
                <TrendingUp size={20} />
             </button>
             <button className="px-6 py-3 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                Buttons <ChevronRight size={14} />
             </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
            <button className={`px-8 py-2.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200`}>Variation 1</button>
            <button className={`px-8 py-2.5 bg-white text-slate-400 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all`}>Variation 2</button>
        </div>

        {/* Portfolio Performance Section */}
        <section className="bg-white border border-slate-100 rounded-2xl p-0 shadow-sm relative overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Portfolio Performance</h2>
            <button className="px-5 py-2 border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">View All</button>
          </div>
          
          <div className="p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <InsightCard 
                label="Cash Deposits" 
                value="₹1,7M" 
                subValue="54.1 % less earnings"
                icon={TrendingUp}
                themeColor="orange-500"
                trend="down"
              />
              <InsightCard 
                label="Invested Dividends" 
                value="₹9M" 
                subValue="Grow Rate: 14.1 %"
                icon={Zap}
                themeColor="pink-500"
                trend="up"
              />
              <InsightCard 
                label="Capital Gains" 
                value="₹563" 
                subValue="Increased by 7.35 %"
                icon={ShieldCheck}
                themeColor="emerald-500"
                trend="up"
              />
            </div>

            <div className="mt-12 flex justify-center">
                <button className={`flex items-center gap-3 px-12 py-4 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-2xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all`}>
                  View Complete Report
                </button>
            </div>
          </div>
        </section>

        {/* Technical Support & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Technical Support Chart */}
            <section className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-blue-500" />
                  <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Technical Support</h2>
                </div>
                <MoreHorizontal size={18} className="text-slate-300" />
              </div>
              <div className="p-8 flex-1">
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">New accounts since 2018</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-900">78 %</span>
                    <span className="flex items-center text-emerald-500 text-xs font-bold">+14</span>
                  </div>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sales Progress</p>
                    <span className="text-xs font-black text-emerald-500">₹1896</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-[70%]" />
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-[9px] font-medium text-slate-400">YoY Growth</p>
                    <p className="text-[9px] font-medium text-slate-400">100%</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Timeline Section */}
            <section className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-rose-500" />
                  <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Timeline Example</h2>
                </div>
                <MoreHorizontal size={18} className="text-slate-300" />
              </div>
              <div className="p-8 flex-1 space-y-8">
                {timelineData.map((item, idx) => (
                  <div key={item.id} className="flex gap-6 items-start relative group">
                    {idx !== timelineData.length - 1 && (
                      <div className="absolute left-[7px] top-[18px] bottom-[-22px] w-[2px] bg-slate-100" />
                    )}
                    <div className={`mt-1.5 w-4 h-4 rounded-full border-2 border-${item.color}-500 bg-white z-10 transition-transform group-hover:scale-125`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.title}</p>
                        {item.status === 'new' && (
                          <span className="bg-rose-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">NEW</span>
                        )}
                      </div>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">Yet another one, at <span className="text-emerald-500">{item.time}</span></p>
                      {item.id === 3 && (
                        <div className="flex -space-x-2 mt-3 cursor-pointer">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                              <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-blue-600 text-[8px] font-bold">
                            +
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="pt-4 flex justify-center">
                    <button className="px-8 py-3 bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all">
                      View All Messages
                    </button>
                </div>
              </div>
            </section>
        </div>

        {/* Bottom Grid Cards (874, 1283, 1286, 564) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { val: '₹ 874', label: 'sales last month', color: 'orange' },
              { val: '₹ 1283', label: 'sales income', color: 'blue' },
              { val: '₹ 1286', label: 'last year expenses', color: 'emerald' },
              { val: '₹ 564', label: 'total revenue', color: 'rose' }
            ].map((card, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                 <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{card.val}</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-70">{card.label}</p>
                 <div className={`h-1 w-full bg-slate-50 mt-4 rounded-full overflow-hidden`}>
                    <div className={`h-full bg-${card.color}-500 w-[40%]`} />
                 </div>
              </div>
            ))}
        </div>
      </div>

      {/* Floating Settings Button */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <button className="w-14 h-14 bg-orange-400 text-slate-900 rounded-full flex items-center justify-center shadow-2xl hover:rotate-90 transition-all hover:scale-110 active:scale-95 shadow-orange-200">
          <Settings size={28} />
        </button>
      </div>
    </div>
  );
};

const InsightCard = ({ label, value, subValue, icon: Icon, themeColor, trend }: any) => {
  return (
    <div className="group">
      <div className="flex items-center gap-6 mb-6">
        <div className={`w-14 h-14 rounded-full bg-${themeColor} flex items-center justify-center text-white shadow-xl shadow-${themeColor}/30 transform group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-3xl font-black text-slate-900 leading-none tracking-tighter mb-2">{value}</h3>
          <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase leading-none">{label}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`flex items-center ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend === 'up' ? <ChevronRight className="-rotate-90" size={14} /> : <ChevronRight className="rotate-90" size={14} />}
          <span className="text-[11px] font-bold tracking-tight italic opacity-80">{subValue}</span>
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
