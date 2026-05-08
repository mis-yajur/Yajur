import React from 'react';
import { ArrowLeft, CloudUpload, FolderSymlink, Search, HardDrive, FileText, Image as ImageIcon, Music, Film, MoreHorizontal } from 'lucide-react';

interface FMSPageProps {
  onBack: () => void;
}

export const FMSPage = ({ onBack }: FMSPageProps) => {
  const stats = [
    { label: 'Total Files', value: '156', icon: FileText, color: 'blue' },
    { label: 'Used Space', value: '2.4 GB', icon: HardDrive, color: 'amber' },
    { label: 'Free Space', value: '7.6 GB', icon: CloudUpload, color: 'green' },
  ];

  const recentFiles = [
    { name: 'Financial_Report_Q1.pdf', size: '2.4 MB', date: '2 hours ago', type: 'pdf' },
    { name: 'Product_Catalog_Final.zip', size: '45.8 MB', date: '5 hours ago', type: 'zip' },
    { name: 'Warehouse_Layout.dwg', size: '12.1 MB', date: 'Yesterday', type: 'file' },
    { name: 'Staff_Guidelines.docx', size: '1.2 MB', date: 'May 5, 2024', type: 'doc' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:translate-x-[-4px] transition-transform"
          >
            <ArrowLeft size={16} />
            BACK TO DASHBOARD
          </button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">File Management System</h1>
          <p className="text-slate-500">Centralized document storage and organization</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search files..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all w-full md:w-64"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center gap-2 shrink-0">
            <CloudUpload size={20} />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Folders */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-slate-800">Folders</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FolderCard title="Documents" count="45 files" color="blue" />
            <FolderCard title="Reports" count="28 files" color="amber" />
            <FolderCard title="Assets" count="112 files" color="green" />
            <FolderCard title="Personal" count="12 files" color="indigo" />
          </div>

          <h3 className="text-lg font-bold text-slate-800 pt-4">Recent Files</h3>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">File Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentFiles.map((file, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                          <FileText size={20} />
                        </div>
                        <span className="font-semibold text-slate-700">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{file.size}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{file.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <HardDrive className="mb-6 opacity-50" size={32} />
              <h4 className="text-xl font-bold">Storage Full?</h4>
              <p className="text-slate-400 mt-2 text-sm">You have used 80% of your total storage capacity in the enterprise cloud.</p>
              <button className="mt-8 w-full py-3 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-colors">
                Upgrade Storage
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 text-white/5">
              <CloudUpload size={200} />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
            <h4 className="font-bold text-slate-800">Storage Distribution</h4>
            <div className="space-y-4">
              <StorageDist label="Documents" percentage={45} color="bg-blue-500" icon={FileText} />
              <StorageDist label="Images" percentage={30} color="bg-green-500" icon={ImageIcon} />
              <StorageDist label="Media" percentage={15} color="bg-amber-500" icon={Film} />
              <StorageDist label="Other" percentage={10} color="bg-slate-400" icon={MoreHorizontal} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FolderCard = ({ title, count, color }: { title: string; count: string; color: string }) => {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    green: 'text-green-600 bg-green-50 border-green-100',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  };

  return (
    <div className={`p-5 rounded-3xl border transition-all hover:scale-[1.02] cursor-pointer hover:shadow-lg ${colorMap[color] || colorMap.blue}`}>
      <div className="flex items-center gap-4">
        <FolderSymlink size={32} />
        <div>
          <h4 className="font-bold text-slate-900">{title}</h4>
          <p className="text-xs font-bold opacity-70 uppercase tracking-wider">{count}</p>
        </div>
      </div>
    </div>
  );
};

const StorageDist = ({ label, percentage, color, icon: Icon }: { label: string; percentage: number; color: string; icon: any }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-sm font-bold">
      <div className="flex items-center gap-2 text-slate-600">
        <Icon size={16} />
        {label}
      </div>
      <span className="text-slate-400">{percentage}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
    </div>
  </div>
);
