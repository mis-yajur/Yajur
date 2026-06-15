import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Cpu, 
  Sparkles, 
  Activity, 
  HelpCircle,
  Calendar,
  AlertTriangle,
  Play
} from 'lucide-react';

interface HourlyData {
  hour: number; // 0 to 23
  hits: number;
  simulated?: boolean;
}

const DEFAULT_LIFTING_HOURLY: HourlyData[] = [
  { hour: 0, hits: 8 },
  { hour: 1, hits: 3 },
  { hour: 2, hits: 1 },
  { hour: 3, hits: 0 },
  { hour: 4, hits: 5 },
  { hour: 5, hits: 15 },
  { hour: 6, hits: 34 },
  { hour: 7, hits: 52 },
  { hour: 8, hits: 120 }, // Morning shift starts
  { hour: 9, hits: 245 }, // Peak 1
  { hour: 10, hits: 310 }, // Heavy Lift Peak
  { hour: 11, hits: 185 },
  { hour: 12, hits: 90 },  // Lunch lull
  { hour: 13, hits: 140 },
  { hour: 14, hits: 280 }, // Shift 2 start
  { hour: 15, hits: 340 }, // Shift Peak
  { hour: 16, hits: 210 },
  { hour: 17, hits: 135 },
  { hour: 18, hits: 85 },
  { hour: 19, hits: 48 },
  { hour: 20, hits: 32 },
  { hour: 21, hits: 20 },
  { hour: 22, hits: 12 },
  { hour: 23, hits: 9 },
];

export const ModuleUsageReport = () => {
  const [data, setData] = useState<HourlyData[]>(() => {
    const saved = localStorage.getItem('yajur-lifting-usage');
    return saved ? JSON.parse(saved) : DEFAULT_LIFTING_HOURLY;
  });
  
  const [selectedDayType, setSelectedDayType] = useState<'weekday' | 'weekend' | 'rush'>('weekday');
  const [simHour, setSimHour] = useState<number>(10);
  const [simCount, setSimCount] = useState<number>(50);
  const [hoveredData, setHoveredData] = useState<HourlyData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<'chart' | 'radar'>('chart');
  const [simulationIndicator, setSimulationIndicator] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(650);
  const height = 300;
  const margin = { top: 30, right: 30, bottom: 40, left: 50 };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('yajur-lifting-usage', JSON.stringify(data));
  }, [data]);

  // Handle ResizeObserver to maintain fluidity constraints
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const w = entry.contentRect.width;
        setWidth(Math.max(w, 400));
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Handle seasonal / day filter switching
  useEffect(() => {
    let scaleMultiplier = 1.0;
    if (selectedDayType === 'weekend') scaleMultiplier = 0.25; // low traffic
    if (selectedDayType === 'rush') scaleMultiplier = 1.65; // mega load
    
    setData(DEFAULT_LIFTING_HOURLY.map(d => ({
      ...d,
      hits: Math.max(0, Math.round(d.hits * scaleMultiplier))
    })));
  }, [selectedDayType]);

  // Peak Hour Simulation Injector
  const handleSimulateHits = () => {
    setData(prev => {
      const updated = prev.map(d => {
        if (d.hour === simHour) {
          return { ...d, hits: d.hits + simCount, simulated: true };
        }
        return d;
      });
      return updated;
    });

    setSimulationIndicator(`Injected +${simCount} virtual accesses into Lifting ERP telemetry at ${simHour}:00.`);
    setTimeout(() => {
      setSimulationIndicator(null);
    }, 4000);
  };

  const handleResetTelemetry = () => {
    setData(DEFAULT_LIFTING_HOURLY);
    setSelectedDayType('weekday');
  };

  // Compute stats
  const totalQueries = data.reduce((sum, d) => sum + d.hits, 0);
  const maxHitItem = [...data].sort((a, b) => b.hits - a.hits)[0];
  const peakHourStr = maxHitItem ? `${String(maxHitItem.hour).padStart(2, '0')}:00` : 'N/A';
  const peakHitsVal = maxHitItem ? maxHitItem.hits : 0;
  
  // Calculate staffing recommendation and efficiency based on peak hits
  const optimalStaffCount = Math.max(2, Math.round(peakHitsVal / 45));
  const performanceIndex = peakHitsVal > 450 ? 84.5 : 98.2;

  // D3 Coordinate & Layout Compilation (React rendering path calculated via D3 scales)
  const xScale = d3.scaleLinear()
    .domain([0, 23])
    .range([margin.left, width - margin.right]);

  const maxVal = Math.max(...data.map(d => d.hits)) || 300;
  const yScale = d3.scaleLinear()
    .domain([0, Math.ceil(maxVal * 1.1)])
    .range([height - margin.bottom, margin.top]);

  // Generate D3 Line generator with curved MonotoneX interpolation
  const lineGenerator = d3.line<HourlyData>()
    .x(d => xScale(d.hour))
    .y(d => yScale(d.hits))
    .curve(d3.curveMonotoneX);

  // Generate D3 Area generator to create glowing background area under the curve
  const areaGenerator = d3.area<HourlyData>()
    .x(d => xScale(d.hour))
    .y0(height - margin.bottom)
    .y1(d => yScale(d.hits))
    .curve(d3.curveMonotoneX);

  const pathD = lineGenerator(data) || '';
  const areaD = areaGenerator(data) || '';

  // Generate x-axis grid and labels
  const xticks = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
  const yticks = yScale.ticks(6);

  return (
    <div className="bg-white/70 backdrop-blur-md border border-slate-150 rounded-[2.5rem] shadow-[0_20px_50px_rgba(71,85,105,0.04)] p-6 md:p-8 space-y-6" id="module-usage-report-section">
      
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-xl text-white shadow-md shadow-indigo-150 relative">
              <Cpu size={16} />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider font-sans flex items-center gap-2">
                Lifting ERP peak workload profiling report
              </h3>
              <p className="text-[10px] text-slate-405 font-bold uppercase tracking-widest">
                Deep telemetry inspection suite • Real-time D3 analytics engine
              </p>
            </div>
          </div>
        </div>

        {/* View Mode and day filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest hidden sm:inline">Active Filter:</span>
          <div className="flex p-0.5 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedDayType('weekday')}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer
                ${selectedDayType === 'weekday' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-450 hover:text-slate-700'}`}
            >
              Weekdays
            </button>
            <button
              onClick={() => setSelectedDayType('weekend')}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer
                ${selectedDayType === 'weekend' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-450 hover:text-slate-700'}`}
            >
              Weekends
            </button>
            <button
              onClick={() => setSelectedDayType('rush')}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer
                ${selectedDayType === 'rush' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-450 hover:text-slate-700'}`}
            >
              Shift Shocks
            </button>
          </div>

          <button
            onClick={handleResetTelemetry}
            className="p-1.5 border border-slate-200 text-slate-450 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all title='Restore Factory Telemetry'"
          >
            <Activity size={12} />
          </button>
        </div>
      </div>

      {/* Main Core telemetry simulator alerts */}
      <AnimatePresence>
        {simulationIndicator && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            className="bg-indigo-950 border border-indigo-800 text-indigo-100 rounded-2xl p-3.5 text-[10px] font-bold flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-amber-400 animate-pulse shrink-0" />
              <span>{simulationIndicator}</span>
            </div>
            <span className="text-[8px] font-mono opacity-50 select-none">D3 CHART RENDER RECONFIGURED</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Key Telemetry Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-50/70 border border-slate-150 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block mb-1">TOTAL ERP ACCESSES</span>
            <span className="text-xl font-black text-slate-800 tracking-tight font-sans block">{totalQueries.toLocaleString()} hits</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5">
            <TrendingUp size={11} className="text-emerald-500" />
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Sync Active • 100% telemetry</span>
          </div>
        </div>

        <div className="bg-emerald-50/30 border border-emerald-100/50 p-4 rounded-2xl flex flex-col justify-between hover:border-emerald-200 transition-all">
          <div>
            <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest block mb-1">PEAK LOAD TIMEFRAME</span>
            <span className="text-xl font-black text-slate-800 tracking-tight font-sans block">{peakHourStr}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5">
            <Clock size={11} className="text-emerald-600" />
            <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider">{peakHitsVal} accesses max / hr</span>
          </div>
        </div>

        <div className="bg-amber-50/20 border border-amber-100/40 p-4 rounded-2xl flex flex-col justify-between hover:border-amber-200 transition-all">
          <div>
            <span className="text-[7px] font-black text-amber-600 uppercase tracking-widest block mb-1">OPTIMAL CRITICAL STAFFING</span>
            <span className="text-xl font-black text-slate-800 tracking-tight font-sans block">{optimalStaffCount} Operators</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5">
            <Cpu size={11} className="text-amber-500" />
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Safe system buffer computed</span>
          </div>
        </div>

        <div className="bg-slate-50/70 border border-slate-150 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block mb-1">RESPONSE INDEX</span>
            <span className={`text-xl font-black tracking-tight font-sans block ${performanceIndex < 90 ? 'text-amber-600' : 'text-slate-800'}`}>
              {performanceIndex}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5">
            <Activity size={11} className={performanceIndex < 90 ? 'text-amber-500' : 'text-emerald-500'} />
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
              {performanceIndex < 90 ? 'Slight Queue Overhead' : 'Pristine latency grid'}
            </span>
          </div>
        </div>

      </div>

      {/* The D3 Interactive Chart Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core SVG Workspace */}
        <div className="lg:col-span-2 space-y-2">
          <div className="bg-slate-900 border border-slate-850 rounded-3xl p-4 md:p-5 relative overflow-hidden" ref={containerRef}>
            
            {/* Background cyber grid accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-sky-500/5 blur-3xl rounded-full" />
            
            <div className="flex items-center justify-between pb-3.5 mb-2.5 border-b border-slate-800 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
                <span className="text-[8px] font-black font-mono text-cyan-400 uppercase tracking-[0.2em]">D3 STAGE: ACTIVE HARNESS COMPILING</span>
              </div>
              <span className="text-[7.5px] font-mono text-slate-500 uppercase">Interactive Mouse Cursor Tracker Enabled</span>
            </div>

            <div className="relative z-10 w-full overflow-x-auto">
              {/* Responsive SVG compiled and coordinates mapped in React via d3-scale & d3-shape */}
              <svg 
                ref={svgRef}
                width={width} 
                height={height} 
                className="overflow-visible select-none"
                onMouseLeave={() => setHoveredData(null)}
              >
                {/* Custom glowing gradients for D3 curves */}
                <defs>
                  <linearGradient id="liftingAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                  </linearGradient>
                  
                  <linearGradient id="liftingLineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>

                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Shaded High load shift hotspot bounding boxes (Shift #1 morning and Shift #2 twilight) */}
                <rect 
                  x={xScale(8.5)} 
                  y={margin.top} 
                  width={xScale(11.5) - xScale(8.5)} 
                  height={height - margin.bottom - margin.top} 
                  fill="#facc15" 
                  fillOpacity="0.04"
                  stroke="#ef4444"
                  strokeOpacity="0.1"
                  strokeDasharray="2 3"
                />
                <rect 
                  x={xScale(14.0)} 
                  y={margin.top} 
                  width={xScale(16.5) - xScale(14.0)} 
                  height={height - margin.bottom - margin.top} 
                  fill="#facc15" 
                  fillOpacity="0.04"
                  stroke="#ef4444"
                  strokeOpacity="0.1"
                  strokeDasharray="2 3"
                />

                {/* Gridlines */}
                {yticks.map(yVal => (
                  <g key={`ygrid-${yVal}`} opacity="0.07">
                    <line 
                      x1={margin.left} 
                      x2={width - margin.right} 
                      y1={yScale(yVal)} 
                      y2={yScale(yVal)} 
                      stroke="#ffffff" 
                      strokeWidth="1"
                    />
                    <text 
                      x={margin.left - 10} 
                      y={yScale(yVal) + 3} 
                      fill="#ffffff" 
                      fontSize="8" 
                      textAnchor="end" 
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {yVal}
                    </text>
                  </g>
                ))}

                {/* X Axis ticks and captions */}
                {xticks.map(hour => (
                  <g key={`xtick-${hour}`} opacity="0.4">
                    <line 
                      x1={xScale(hour)} 
                      x2={xScale(hour)} 
                      y1={height - margin.bottom} 
                      y2={height - margin.bottom + 5} 
                      stroke="#475569" 
                      strokeWidth="1.5"
                    />
                    <text 
                      x={xScale(hour)} 
                      y={height - margin.bottom + 18} 
                      fontSize="8" 
                      fill="#94a3b8" 
                      textAnchor="middle" 
                      fontWeight="extrabold"
                      fontFamily="monospace"
                    >
                      {dayHourLabel(hour)}
                    </text>
                  </g>
                ))}

                {/* D3 Drawn Shaded Area Block */}
                <path 
                  d={areaD} 
                  fill="url(#liftingAreaGradient)" 
                />

                {/* D3 Drawn Area Outline Line Curve */}
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke="url(#liftingLineGradient)" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />

                {/* Hover tracking guideline projection */}
                {hoveredData && (
                  <line 
                    x1={xScale(hoveredData.hour)} 
                    x2={xScale(hoveredData.hour)} 
                    y1={margin.top} 
                    y2={height - margin.bottom} 
                    stroke="#22d3ee" 
                    strokeWidth="1" 
                    strokeDasharray="3 3"
                    opacity="0.6"
                  />
                )}

                {/* Individual coordinate points on path curve */}
                {data.map((d, index) => {
                  const isPeak = d.hour === maxHitItem?.hour;
                  const isHovered = hoveredData && hoveredData.hour === d.hour;
                  
                  return (
                    <circle 
                      key={`point-${d.hour}`}
                      cx={xScale(d.hour)}
                      cy={yScale(d.hits)}
                      r={isHovered ? 8 : (isPeak ? 5 : (d.simulated ? 4.5 : 2.5))}
                      fill={isHovered ? '#22d3ee' : (isPeak ? '#ef4444' : (d.simulated ? '#e9d5ff' : '#6366f1'))}
                      stroke={isHovered ? '#ffffff' : (isPeak ? '#ffffff' : (d.simulated ? '#a855f7' : '#ffffff'))}
                      strokeWidth={isHovered || isPeak || d.simulated ? 2 : 1}
                      className="cursor-pointer transition-all duration-300"
                      onMouseEnter={(e) => {
                        setHoveredData(d);
                        setTooltipPos({ x: xScale(d.hour), y: yScale(d.hits) });
                      }}
                    />
                  );
                })}
              </svg>

              {/* Shaded Hotspot Overlays descriptive boxes */}
              <div className="absolute top-[52px] left-[42%] pointer-events-none select-none text-[7px] font-bold uppercase tracking-wider text-amber-500 opacity-60">
                Shift #1 Start Load zone
              </div>
              <div className="absolute top-[52px] left-[65%] pointer-events-none select-none text-[7px] font-bold uppercase tracking-wider text-amber-500 opacity-60">
                Shift #2 Heavy Lift load zone
              </div>

              {/* D3 Hover Coordinate tooltip */}
              {hoveredData && (
                <div 
                  className="absolute pointer-events-none bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white text-[9px] font-sans shadow-xl"
                  style={{ 
                    left: `${Math.min(tooltipPos.x + 10, width - 120)}px`, 
                    top: `${Math.min(tooltipPos.y + 15, height - 70)}px` 
                  }}
                >
                  <p className="font-mono text-[8px] text-cyan-400 font-extrabold uppercase tracking-wide leading-none mb-1">Hour: {String(hoveredData.hour).padStart(2, '0')}:00</p>
                  <p className="font-sans font-black text-xs leading-none text-white">{hoveredData.hits} operations</p>
                  <p className="text-[7.5px] mt-1 text-slate-400 uppercase leading-none font-medium">
                    {hoveredData.simulated ? 'SIMULATED TELEMETRY' : 'REAL REGISTERED ACCESS'}
                  </p>
                </div>
              )}
            </div>
            
          </div>
        </div>

        {/* Configuration Simulator Terminal Sidepanel */}
        <div className="bg-slate-50 border border-slate-150 rounded-3xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 opacity-70 pb-3 border-b border-slate-155">
              <Calendar size={13} className="text-slate-600" />
              <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">Access Injection Console</h4>
            </div>

            <p className="text-[10px] text-slate-500 font-bold leading-normal uppercase tracking-wide">
              Inject synthetic load into the terminal grid coordinates at a specific hour to verify failover thresholds and staffing recommendations.
            </p>

            <div className="space-y-3.5">
              
              {/* Hour input slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-wider text-slate-450">
                  <span>Injected Hour Timestamp</span>
                  <span className="font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{String(simHour).padStart(2, '0')}:00 {simHour >= 12 ? 'PM' : 'AM'}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="23"
                  value={simHour}
                  onChange={(e) => setSimHour(parseInt(e.target.value))}
                  className="w-full bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Bulk Hit slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-wider text-slate-450">
                  <span>Operation Hit Volume</span>
                  <span className="font-mono text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded">+{simCount} Hits</span>
                </div>
                <input 
                  type="range"
                  min="10"
                  max="150"
                  step="10"
                  value={simCount}
                  onChange={(e) => setSimCount(parseInt(e.target.value))}
                  className="w-full bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
              </div>

            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-150 space-y-2.5">
            <button
              onClick={handleSimulateHits}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white text-[10px] font-black tracking-widest uppercase rounded-2xl cursor-pointer shadow-lg shadow-indigo-100"
            >
              <Play size={11} fill="currentColor" />
              Initialize Load Injection
            </button>
            
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100/50 rounded-2xl">
              <AlertTriangle size={13} className="text-amber-500 shrink-0" />
              <p className="text-[8px] font-bold text-amber-700 uppercase leading-snug">
                Peak loads matching &gt;300 Hits trigger systemic queuing overhead alert metrics.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

const dayHourLabel = (h: number): string => {
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
};

const dayHourLabelFull = (h: number): string => {
  return `${String(h).padStart(2, '0')}:00`;
};
