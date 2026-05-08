import React from 'react';
import { ArrowLeft, Maximize2, RotateCcw } from 'lucide-react';

interface ModuleFrameProps {
  url: string;
  onBack: () => void;
}

export const ModuleFrame = ({ url, onBack }: ModuleFrameProps) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-t-3xl overflow-hidden shadow-2xl border border-slate-200">
      {/* Frame Control Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-all text-sm font-semibold shadow-sm"
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>
          
          <div className="h-4 w-px bg-slate-300 mx-2" />
          
          <div className="flex items-center gap-2 group">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase group-hover:text-slate-600 transition-colors">
              Live Connection
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
             onClick={() => { const f = document.getElementById('module-iframe') as HTMLIFrameElement; if(f) f.src = f.src; }}
             className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white border-transparent hover:border-slate-200 border rounded-lg transition-all"
             title="Reload Module"
          >
            <RotateCcw size={18} />
          </button>
          <button 
             onClick={() => window.open(url, '_blank')}
             className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white border-transparent hover:border-slate-200 border rounded-lg transition-all"
             title="Open in New Tab"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      {/* Iframe Content */}
      <div className="flex-1 bg-slate-100 relative">
        <iframe 
          id="module-iframe"
          src={url}
          className="w-full h-full border-none"
          allow="camera; microphone; fullscreen; clipboard-read; clipboard-write; geolocation"
          title="Module Content"
        />
      </div>
    </div>
  );
};
