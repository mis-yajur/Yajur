import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, ListChecks, FolderTree, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { LucideIcon } from './LucideIcon';
import { MODULES } from '../constants';
import { TaskStats, SalesData } from '../types';

interface DashboardProps {
  onSelectModule: (url: string) => void;
  role: string;
}

const API_KEY = 'AIzaSyAriKmI0OQAzmO3uH3EAK7598TkQBYT52I';
const SALES_SHEET_ID = '1TSheb5J1eGE7Ve_aeAbqe6_7CoOVwwxgxkLLpQB9GlA';
const TASK_SHEET_ID = '1aq7CXHNkpkWoJLhTDWkYG9CrszsRAY0v4sswWZC6fYE';
const CHECKLIST_SHEET_ID = '1fGudRr5zZy_3qDGloCptok3VtXbR3L5pK1fBHC4tb8c';

export const Dashboard = ({ onSelectModule, role }: DashboardProps) => {
  const [taskStats, setTaskStats] = useState<TaskStats>({ total: 0, pending: 0, done: 0 });
  const [checklistStats, setChecklistStats] = useState<TaskStats>({ total: 0, pending: 0, done: 0 });
  const [salesData, setSalesData] = useState<SalesData>({ total: 0, target: 24, growth: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Tasks
        const taskUrl = `https://sheets.googleapis.com/v4/spreadsheets/${TASK_SHEET_ID}/values/Task-Data!A2:C2?key=${API_KEY}`;
        const taskRes = await fetch(taskUrl);
        const taskJson = await taskRes.json();
        if (taskJson.values?.[0]) {
          setTaskStats({
            total: parseInt(taskJson.values[0][0]) || 0,
            pending: parseInt(taskJson.values[0][1]) || 0,
            done: parseInt(taskJson.values[0][2]) || 0,
          });
        }

        // Fetch Checklist
        const checkUrl = `https://sheets.googleapis.com/v4/spreadsheets/${CHECKLIST_SHEET_ID}/values/Task-Data!A2:C2?key=${API_KEY}`;
        const checkRes = await fetch(checkUrl);
        const checkJson = await checkRes.json();
        if (checkJson.values?.[0]) {
          setChecklistStats({
            total: parseInt(checkJson.values[0][0]) || 0,
            pending: parseInt(checkJson.values[0][1]) || 0,
            done: parseInt(checkJson.values[0][2]) || 0,
          });
        }

        // Fetch Sales
        const salesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SALES_SHEET_ID}/values/Sale!A2:C2?key=${API_KEY}`;
        const salesRes = await fetch(salesUrl);
        const salesJson = await salesRes.json();
        if (salesJson.values?.[0]) {
          const rawTotal = parseFloat(salesJson.values[0][0].replace(/[^0-9.-]+/g, '')) || 0;
          const rawTarget = parseFloat(salesJson.values[0][1].replace(/[^0-9.-]+/g, '')) || 240000;
          const rawGrowth = parseFloat(salesJson.values[0][2].replace(/[^0-9.-]+/g, '')) || 0;
          
          setSalesData({
            total: rawTotal / 10, // Million to Crore
            target: rawTarget / 10000, // Thousands to Crore
            growth: rawGrowth
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredModules = MODULES.filter(module => {
    if (role === 'admin') return true;
    if (role === 'store') return module.id === 'ims';
    if (role === 'hr') return module.id === 'hr';
    if (role === 'production') return module.id === 'production';
    if (role === 'pms') return module.id === 'pms';
    if (role === 'sales') return module.id === 'sales';
    if (role === 'office') return module.id === 'task';
    return false;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-8 border border-slate-200 shadow-sm">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Yajur Fibres LTD.</h1>
          <p className="text-slate-500 mt-2 text-lg">Enterprise Workflow Management Platform Overview</p>
          
          <div className="flex flex-wrap gap-8 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Globe size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">9</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Modules Active</p>
              </div>
            </div>
            <div className="w-px bg-slate-100 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                <Zap size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">24/7</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">System Uptime</p>
              </div>
            </div>
            <div className="w-px bg-slate-100 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">99.9%</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Reliability</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 text-slate-50/50 -mr-8 -mt-8 pointer-events-none">
          <TrendingUp size={240} strokeWidth={1} />
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredModules.map((module, idx) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => {
              if (module.url) onSelectModule(module.url);
              else if (module.items) onSelectModule(module.items[0].url);
            }}
            className="group relative bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                    <LucideIcon name={module.icon} size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{module.title}</h3>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                      {module.badge}
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                  {module.description}
                </p>

                {/* Specific Stats for certain modules */}
                {module.id === 'task' && (
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <StatItem label="Total" value={taskStats.total} />
                    <StatItem label="Pending" value={taskStats.pending} color="amber" />
                    <StatItem label="Done" value={taskStats.done} color="green" />
                  </div>
                )}
                {module.id === 'checklist' && (
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <StatItem label="Total" value={checklistStats.total} />
                    <StatItem label="Pending" value={checklistStats.pending} color="amber" />
                    <StatItem label="Done" value={checklistStats.done} color="green" />
                  </div>
                )}
                {module.id === 'sales' && (
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <StatItem label="Total Cr" value={salesData.total.toFixed(2)} />
                    <StatItem label="Target Cr" value={salesData.target.toFixed(2)} color="indigo" />
                    <StatItem label="Growth" value={`${salesData.growth > 0 ? '+' : ''}${salesData.growth}%`} color="emerald" />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between group/link">
              <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                VIEW MODULE
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover/link:bg-blue-600 group-hover/link:text-white transition-all duration-300">
                <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const StatItem = ({ label, value, color = 'blue' }: { label: string; value: string | number; color?: string }) => {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50/50',
    amber: 'text-amber-600 bg-amber-50/50',
    green: 'text-green-600 bg-green-50/50',
    indigo: 'text-indigo-600 bg-indigo-50/50',
    emerald: 'text-emerald-600 bg-emerald-50/50',
  };

  return (
    <div className={`p-2 rounded-xl border border-slate-100/50 text-center ${colorMap[color] || colorMap.blue}`}>
      <p className="text-[10px] font-bold uppercase tracking-tighter opacity-70 truncate">{label}</p>
      <p className="text-base font-black leading-tight mt-1 truncate">{value}</p>
    </div>
  );
};
