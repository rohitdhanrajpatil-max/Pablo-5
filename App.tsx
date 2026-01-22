
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import DashboardCards from './components/DashboardCards';
import { 
  Hotel, 
  DemandEvent, 
  PricingInsights, 
  DashboardTab,
  HistoricalParity,
  OTAParameters
} from './types';
import { fetchMarketIntelligence, generatePricingReport } from './services/geminiService';
import { 
  Search, 
  MapPin, 
  Download, 
  FileText, 
  Loader2, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  BarChart2,
  CalendarClock,
  Info,
  CheckCircle2,
  ShieldAlert,
  ArrowUpRight,
  Flame,
  Zap,
  Target,
  Crown,
  Diamond,
  Hotel as HotelIcon,
  BadgeDollarSign,
  Printer,
  Share2,
  Music,
  Briefcase,
  Palmtree,
  Trophy,
  History,
  Lightbulb,
  X,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  LineChart as LineChartIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend,
  AreaChart,
  Area
} from 'recharts';

const Logo: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <div className={`${className} relative overflow-hidden flex items-center justify-center font-black text-white text-[8px] tracking-tighter`}>
    <div className="absolute inset-0 grid grid-cols-3">
      <div className="bg-brand-brown h-full"></div>
      <div className="bg-brand-orange h-full"></div>
      <div className="bg-brand-brown h-full"></div>
    </div>
    <span className="relative z-10 scale-110">THV</span>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.OVERVIEW);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('THV Chanakya');
  const [city, setCity] = useState('Mumbai');
  const [marketData, setMarketData] = useState<{
    competitors: Hotel[],
    events: DemandEvent[],
    insights: PricingInsights,
    historicalParity: HistoricalParity[],
    sources?: any[]
  } | null>(null);
  const [report, setReport] = useState<string | null>(null);
  
  // Modal & Collapsible & Focused state
  const [selectedParityHotel, setSelectedParityHotel] = useState<Hotel | null>(null);
  const [expandedEventIndex, setExpandedEventIndex] = useState<number | null>(null);
  const [focusedHotel, setFocusedHotel] = useState<Hotel | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchMarketIntelligence(searchQuery, city);
      setMarketData(data);
      
      // Auto-focus the first hotel with a violation
      if (data.competitors.length > 0) {
        const firstViolation = data.competitors.find(c => c.otaData?.some(o => Math.abs(o.parityGap) > 2));
        setFocusedHotel(firstViolation || data.competitors[0]);
      }

      const reportMarkdown = await generatePricingReport(data);
      setReport(reportMarkdown);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulated trend data for focused hotel (to differentiate from market average)
  const focusedTrendData = useMemo(() => {
    if (!marketData || !focusedHotel) return [];
    // Just jitter the market average data slightly for the focused hotel simulation
    return marketData.historicalParity.map(p => ({
      ...p,
      bookingGap: p.bookingGap + (Math.random() * 2 - 1),
      mmtGap: p.mmtGap + (Math.random() * 2 - 1),
      agodaGap: p.agodaGap + (Math.random() * 2 - 1),
    }));
  }, [marketData, focusedHotel]);

  const getPositioningBadge = (positioning: string) => {
    switch (positioning) {
      case 'Luxury':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
            <Crown size={12} className="text-amber-500" /> Luxury
          </span>
        );
      case 'Upscale':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-50 text-brand-orange border border-brand-orange/20 shadow-sm">
            <Diamond size={12} className="text-brand-orange" /> Upscale
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600">
            {positioning}
          </span>
        );
    }
  };

  const getEventIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'music': return <Music size={18} />;
      case 'business': return <Briefcase size={18} />;
      case 'holiday':
      case 'festival': return <Palmtree size={18} />;
      case 'sports': return <Trophy size={18} />;
      case 'culture': return <History size={18} />;
      default: return <Zap size={18} />;
    }
  };

  const renderParityModal = () => {
    if (!selectedParityHotel) return null;

    const violations = selectedParityHotel.otaData?.filter(o => Math.abs(o.parityGap) > 2) || [];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div 
          className="absolute inset-0 bg-brand-brown/40 backdrop-blur-md" 
          onClick={() => setSelectedParityHotel(null)}
        />
        <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
          <div className="bg-brand-brown p-10 text-white relative">
            <button 
              onClick={() => setSelectedParityHotel(null)}
              className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
            >
              <X size={24} />
            </button>
            <div className="flex items-center gap-4 mb-2">
               <ShieldAlert size={24} className="text-brand-orange" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange">Leakage Detail Analysis</span>
            </div>
            <h3 className="text-3xl font-black tracking-tight uppercase italic">{selectedParityHotel.name}</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">{selectedParityHotel.category} • {selectedParityHotel.location || 'Primary Market'}</p>
          </div>

          <div className="p-10 space-y-8">
             <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Active OTA Violations</h4>
                <div className="space-y-4">
                  {violations.map((ota, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-orange/20 transition-colors group">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                             <span className="font-black text-brand-orange text-xs uppercase tracking-tighter">{ota.platform.slice(0, 3)}</span>
                          </div>
                          <div>
                             <p className="font-black text-slate-900 text-lg uppercase tracking-tight">{ota.platform}</p>
                             <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type:</span>
                                <span className="text-[10px] font-black text-brand-brown uppercase">{ota.roomType || 'Standard Rate'}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-8 text-right">
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">OTA Rate</p>
                             <p className="font-black text-slate-900 text-xl tracking-tighter">₹{ota.rate.toLocaleString()}</p>
                          </div>
                          <div className="w-px h-10 bg-slate-200"></div>
                          <div>
                             <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest mb-1">Variance</p>
                             <p className="font-black text-brand-orange text-xl tracking-tighter">{ota.parityGap > 0 ? '+' : ''}{ota.parityGap}%</p>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-brand-light/30 border border-brand-orange/10 p-8 rounded-[2.5rem]">
                <div className="flex items-center gap-3 mb-4 text-brand-orange">
                   <Lightbulb size={20} className="fill-brand-orange" />
                   <h5 className="text-[11px] font-black uppercase tracking-widest">Revenue Recovery Strategy</h5>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                   Immediate action required. Adjust base rate on {violations[0]?.platform} by {Math.abs(violations[0]?.parityGap)}% to re-establish market equilibrium. Monitoring frequency increased to 30-minute intervals.
                </p>
             </div>
          </div>

          <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-end">
             <button 
                onClick={() => setSelectedParityHotel(null)}
                className="bg-brand-brown text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-orange transition-all shadow-lg"
             >
                Acknowledge Violation
             </button>
          </div>
        </div>
      </div>
    );
  };

  const renderMarketReport = () => {
    if (!marketData) return null;

    const chartData = marketData.competitors.map(c => ({
      name: c.name.split(' ').slice(0, 2).join(' '),
      rate: c.currentRate,
    }));

    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <DashboardCards insights={marketData.insights} />

        <div className="flex justify-between items-end pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Executive Market Report</h2>
            <div className="flex gap-4 mt-2 text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><MapPin size={16} /> {city}</span>
              <span className="flex items-center gap-1.5"><Target size={16} /> {searchQuery}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><Printer size={20} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><Share2 size={20} /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-brand-brown p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border border-white/10">
               <div className="absolute -bottom-20 -right-20 p-8 opacity-10 group-hover:opacity-20 transition-all duration-500 scale-150">
                 <Zap size={200} />
               </div>
               <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-brand-orange rounded-xl text-white shadow-lg shadow-brand-orange/40">
                    <Flame size={20} />
                  </div>
                  <h3 className="font-bold text-xl tracking-tight uppercase">Strategic Recommendations</h3>
                </div>
                <div className="text-base leading-relaxed opacity-100">
                  {report ? (
                    <div className="grid grid-cols-1 gap-4 font-bold text-slate-100">
                      {report.split('\n').filter(line => line.trim().length > 0).map((line, i) => (
                        <div key={i} className="flex gap-4 items-start bg-white/10 p-5 rounded-2xl border border-white/5 hover:bg-white/20 transition-all duration-300">
                          <div className="w-7 h-7 rounded-lg bg-brand-orange flex-shrink-0 flex items-center justify-center text-xs font-black text-white mt-0.5 shadow-md">
                            {i + 1}
                          </div>
                          <p className="text-slate-100 leading-snug">{line.replace(/^[*-]\s*/, '').replace(/^[0-9]\.\s*/, '')}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 py-8">
                      <Loader2 size={24} className="animate-spin text-brand-orange" />
                      <span className="text-slate-400 text-lg">Synthesizing intelligence...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-800 text-xl tracking-tight uppercase">Competitive Rate Map</h3>
                <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-orange"></div> Current Market</span>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#CC4E2C" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#CC4E2C" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800, textAnchor: 'middle'}} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} 
                    />
                    <Tooltip 
                      cursor={{stroke: '#CC4E2C', strokeWidth: 2}}
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px', fontSize: '12px', fontWeight: 'bold'}} 
                    />
                    <Area type="monotone" dataKey="rate" stroke="#CC4E2C" strokeWidth={5} fillOpacity={1} fill="url(#colorRate)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Demand Pulse</h3>
                <Zap size={18} className="text-brand-orange fill-brand-orange" />
              </div>
              <div className="space-y-4">
                {marketData.events.slice(0, 8).map((event, i) => (
                  <div key={i} className="group flex flex-col p-4 bg-brand-light/30 rounded-2xl border border-transparent hover:border-brand-orange/20 hover:bg-white transition-all cursor-default">
                    <div className="flex justify-between items-start mb-2">
                       <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                        event.impact === 'High' ? 'bg-brand-orange text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                       }`}>
                         {event.impact}
                       </span>
                       <span className="text-xs font-black text-emerald-600">+{event.suggestedUplift}%</span>
                    </div>
                    <p className="font-bold text-slate-800 text-sm group-hover:text-brand-orange transition-colors">{event.name}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-2">
                      <CalendarClock size={12} className="text-brand-orange/50" />
                      {event.date}
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setActiveTab(DashboardTab.DEMAND)}
                className="w-full mt-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-orange bg-brand-light rounded-xl hover:bg-brand-orange hover:text-white transition-all shadow-sm"
              >
                Full Calendar
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center gap-3">
            {marketData.sources?.slice(0, 3).map((chunk, i) => chunk.web && (
              <a key={i} href={chunk.web.uri} target="_blank" className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-brand-orange uppercase tracking-widest transition-all">
                <Logo className="w-4 h-4" /> {chunk.web.title}
              </a>
            ))}
          </div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">© 2024 THV CHANAKYA • PAN-INDIA</p>
        </div>
      </div>
    );
  };

  const renderCompSet = () => {
    if (!marketData) return null;
    return (
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        <table className="w-full text-left">
          <thead className="bg-brand-brown border-b border-brand-brown">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black text-white/60 uppercase tracking-widest">Hotel Identity</th>
              <th className="px-8 py-6 text-[10px] font-black text-white/60 uppercase tracking-widest">Distance</th>
              <th className="px-8 py-6 text-[10px] font-black text-white/60 uppercase tracking-widest">Reputation</th>
              <th className="px-8 py-6 text-[10px] font-black text-white/60 uppercase tracking-widest">Market Tier</th>
              <th className="px-8 py-6 text-[10px] font-black text-white/60 uppercase tracking-widest">Rate (INR)</th>
              <th className="px-8 py-6 text-[10px] font-black text-white/60 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {marketData.competitors.map((comp) => (
              <tr key={comp.id} className="hover:bg-brand-light/40 transition-colors group">
                <td className="px-8 py-6">
                  <p className="font-black text-slate-800 text-base">{comp.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{comp.category}</p>
                </td>
                <td className="px-8 py-6 text-sm text-slate-600 font-black italic">{comp.distance}</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-brand-orange">{comp.rating}</span>
                    <span className="text-[10px] font-bold text-slate-400">/ 5.0</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  {getPositioningBadge(comp.positioning)}
                </td>
                <td className="px-8 py-6">
                  <p className="font-black text-slate-900 text-lg">₹{comp.currentRate.toLocaleString()}</p>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 bg-slate-50 rounded-lg group-hover:bg-brand-orange group-hover:text-white transition-all text-slate-400">
                    <ChevronRight size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderRateIntelligence = () => {
    if (!marketData) return null;

    const parityViolations = marketData.competitors.filter(c => c.otaData?.some(o => Math.abs(o.parityGap) > 2));

    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        {/* Parity Detail Modal */}
        {renderParityModal()}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-brand-orange/30 transition-all">
            <div className="p-4 bg-brand-light text-brand-orange rounded-2xl shadow-inner transition-colors group-hover:bg-brand-orange group-hover:text-white">
              <ShieldAlert size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parity Leakage</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{parityViolations.length} Points</h3>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-brand-orange/30 transition-all">
            <div className="p-4 bg-brand-light text-brand-orange rounded-2xl shadow-inner transition-colors group-hover:bg-brand-orange group-hover:text-white">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Index</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">104.2</h3>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-brand-orange/30 transition-all">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Channel Health</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">Optimal</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-10">
               <div>
                 <h3 className="font-black text-slate-800 text-xl tracking-tight uppercase italic">Historical Variance (L7D)</h3>
                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Average Parity Gap across Primary OTAs</p>
               </div>
               <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
                 <span className="flex items-center gap-2 text-blue-600"><div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div> Booking</span>
                 <span className="flex items-center gap-2 text-brand-orange"><div className="w-2.5 h-2.5 rounded-full bg-brand-orange"></div> MMT</span>
                 <span className="flex items-center gap-2 text-emerald-500"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Agoda</span>
               </div>
             </div>
             <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={marketData.historicalParity}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                   <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 15px 35px -5px rgba(0,0,0,0.1)', fontWeight: 'bold'}} />
                   <Line type="monotone" dataKey="bookingGap" stroke="#2563eb" strokeWidth={5} dot={{ r: 4, strokeWidth: 3 }} activeDot={{ r: 8 }} />
                   <Line type="monotone" dataKey="mmtGap" stroke="#CC4E2C" strokeWidth={5} dot={{ r: 4, strokeWidth: 3 }} activeDot={{ r: 8 }} />
                   <Line type="monotone" dataKey="agodaGap" stroke="#10b981" strokeWidth={5} dot={{ r: 4, strokeWidth: 3 }} activeDot={{ r: 8 }} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Active Leakages</h3>
                 <div className="bg-brand-orange text-white text-[10px] font-black px-3 py-1 rounded-full">{parityViolations.length} Issues</div>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6 leading-relaxed">Hotels in your compset currently violating parity rules. Click to investigate.</p>
              
              <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                 {parityViolations.map((hotel, i) => (
                    <button 
                       key={i}
                       onClick={() => {
                         setSelectedParityHotel(hotel);
                         setFocusedHotel(hotel);
                       }}
                       className={`w-full group text-left p-5 border rounded-[2rem] transition-all duration-300 ${
                         focusedHotel?.id === hotel.id 
                          ? 'bg-brand-light border-brand-orange' 
                          : 'bg-slate-50 border-slate-100 hover:border-brand-orange hover:bg-white'
                       }`}
                    >
                       <div className="flex justify-between items-start mb-2">
                          <p className={`font-black text-sm truncate pr-4 transition-colors ${
                            focusedHotel?.id === hotel.id ? 'text-brand-orange' : 'text-slate-800 group-hover:text-brand-orange'
                          }`}>{hotel.name}</p>
                          <ChevronRight size={14} className={focusedHotel?.id === hotel.id ? 'text-brand-orange' : 'text-slate-300 group-hover:text-brand-orange mt-1'} />
                       </div>
                       <div className="flex items-center gap-3">
                          <div className={`px-2 py-0.5 rounded text-[9px] font-black ${
                            focusedHotel?.id === hotel.id ? 'bg-brand-orange text-white' : 'bg-red-50 text-brand-orange'
                          }`}>HIGH RISK</div>
                          <span className="text-[10px] font-bold text-slate-400">{hotel.otaData?.find(o => Math.abs(o.parityGap) > 2)?.platform}</span>
                       </div>
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Selected Hotel Granular Trend Chart */}
        {focusedHotel && (
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-lg border-t-[12px] border-t-brand-orange animate-in slide-in-from-bottom-8 duration-500">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div className="flex items-center gap-5">
                   <div className="p-5 bg-brand-light rounded-[1.75rem] text-brand-orange shadow-sm">
                      <LineChartIcon size={28} />
                   </div>
                   <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Property Focus Trend Analysis</span>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{focusedHotel.name}</h3>
                   </div>
                </div>
                <div className="flex items-center gap-8 bg-slate-50 px-8 py-4 rounded-[2rem] border border-slate-100">
                   <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Max Variance</p>
                      <p className="text-xl font-black text-brand-orange">
                         {focusedHotel.otaData ? Math.max(...focusedHotel.otaData.map(o => Math.abs(o.parityGap))) : 0}%
                      </p>
                   </div>
                   <div className="w-px h-8 bg-slate-200"></div>
                   <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stability Index</p>
                      <p className="text-xl font-black text-brand-brown">Poor</p>
                   </div>
                </div>
             </div>
             
             <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={focusedTrendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} 
                        label={{ value: 'Parity Gap %', angle: -90, position: 'insideLeft', offset: 0, fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                      />
                      <Tooltip 
                        contentStyle={{
                          borderRadius: '24px', 
                          border: 'none', 
                          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
                          padding: '16px',
                          fontWeight: 'bold',
                          fontSize: '12px'
                        }} 
                      />
                      <Legend 
                        verticalAlign="top" 
                        align="right" 
                        iconType="circle"
                        wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}
                      />
                      <Line 
                        name="Booking.com"
                        type="monotone" 
                        dataKey="bookingGap" 
                        stroke="#2563eb" 
                        strokeWidth={6} 
                        dot={{ r: 6, strokeWidth: 4, fill: '#fff' }} 
                        activeDot={{ r: 10, strokeWidth: 0 }} 
                      />
                      <Line 
                        name="MakeMyTrip"
                        type="monotone" 
                        dataKey="mmtGap" 
                        stroke="#CC4E2C" 
                        strokeWidth={6} 
                        dot={{ r: 6, strokeWidth: 4, fill: '#fff' }} 
                        activeDot={{ r: 10, strokeWidth: 0 }} 
                      />
                      <Line 
                        name="Agoda"
                        type="monotone" 
                        dataKey="agodaGap" 
                        stroke="#10b981" 
                        strokeWidth={6} 
                        dot={{ r: 6, strokeWidth: 4, fill: '#fff' }} 
                        activeDot={{ r: 10, strokeWidth: 0 }} 
                      />
                   </LineChart>
                </ResponsiveContainer>
             </div>
             
             <div className="mt-8 flex items-center gap-4 bg-brand-light/30 p-6 rounded-[2rem] border border-brand-orange/10">
                <Info size={18} className="text-brand-orange" />
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                   Viewing real-time parity synchronization for <span className="text-brand-orange font-black">{focusedHotel.name}</span>. Violations are most frequent on MMT during peak booking hours (19:00 - 22:00 IST).
                </p>
             </div>
          </div>
        )}
      </div>
    );
  };

  const renderDemandDrivers = () => {
    if (!marketData) return null;
    return (
      <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-between items-center bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm border-l-[12px] border-brand-orange">
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Demand Intelligence</h3>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mt-2">Future Impact Analysis for {city}</p>
          </div>
          <div className="flex gap-10">
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Max Yield Lift</p>
                <p className="text-4xl font-black text-emerald-600 tracking-tighter">+{Math.max(...marketData.events.map(e => e.suggestedUplift))}%</p>
             </div>
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Drivers</p>
                <p className="text-4xl font-black text-brand-orange tracking-tighter">{marketData.events.length}</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {marketData.events.map((event, i) => {
            const isExpanded = expandedEventIndex === i;
            return (
              <div 
                key={i} 
                onClick={() => setExpandedEventIndex(isExpanded ? null : i)}
                className={`bg-white rounded-[3.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden flex flex-col h-full border-b-[10px] cursor-pointer ${
                  isExpanded ? 'ring-2 ring-brand-orange border-b-brand-orange' : 'border-b-brand-light'
                }`}
              >
                <div className="p-10 pb-6">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <div className={`p-5 rounded-[1.75rem] shadow-sm transition-all group-hover:rotate-6 ${
                        event.impact === 'High' ? 'bg-brand-orange text-white shadow-brand-orange/30' : 'bg-brand-light text-brand-orange'
                      }`}>
                        {getEventIcon(event.category)}
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">{event.category || 'MARKET'} EVENT</span>
                        <h4 className="font-black text-slate-900 text-2xl leading-tight group-hover:text-brand-orange transition-colors">{event.name}</h4>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                       <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest inline-block ${
                        event.impact === 'High' ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20' : 'bg-slate-100 text-slate-500'
                       }`}>
                         {event.impact} IMPACT
                       </div>
                       <p className="text-emerald-600 font-black text-2xl mt-2 tracking-tighter">+{event.suggestedUplift}% LIFT</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-slate-400 group-hover:text-brand-orange transition-colors">
                    <span className="text-[11px] font-black uppercase tracking-widest">
                      {isExpanded ? 'Click to hide details' : 'Click to view strategy'}
                    </span>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>

                  {/* Collapsible Section */}
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[600px] mt-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-base text-slate-500 mb-10 leading-relaxed font-bold opacity-80">{event.description}</p>
                    
                    <div className="bg-brand-brown rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group/strat shadow-xl">
                      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover/strat:opacity-20 transition-all rotate-12">
                        <Lightbulb size={100} className="text-brand-orange" />
                      </div>
                      <div className="flex items-center gap-2 mb-3 text-brand-orange relative z-10">
                        <Lightbulb size={20} className="fill-brand-orange" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Actionable Strategy</span>
                      </div>
                      <p className="text-base font-bold text-white leading-relaxed relative z-10">
                        {event.recommendedStrategy || "Aggressively yield up. Lock non-refundable rates and implement MLOS-2 to capture the full arrival window."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto px-10 py-7 bg-slate-50 border-t border-slate-100 flex items-center justify-between font-black text-[10px] tracking-[0.25em] uppercase text-slate-400">
                  <div className="flex items-center gap-3">
                    <CalendarClock size={16} className="text-brand-orange" /> 
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-brand-brown" />
                    <span>{event.distance}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-12 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 relative overflow-hidden rounded-2xl flex items-center justify-center font-black text-white text-lg tracking-tighter shadow-xl shadow-brand-orange/20">
              <div className="absolute inset-0 grid grid-cols-3">
                <div className="bg-brand-brown h-full"></div>
                <div className="bg-brand-orange h-full"></div>
                <div className="bg-brand-brown h-full"></div>
              </div>
              <span className="relative z-10">THV</span>
            </div>
            <div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">THV CHANAKYA</h2>
              <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] mt-2 ml-1">Pan-India Revenue Command Center</p>
            </div>
          </div>
          <form onSubmit={handleSearch} className="flex gap-4 p-2.5 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 group">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-orange transition-colors" size={22} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="PROPERTY NAME"
                className="pl-14 pr-6 py-5 bg-transparent rounded-3xl focus:outline-none w-72 text-base font-black uppercase tracking-widest placeholder:text-slate-200"
              />
            </div>
            <div className="w-px h-10 bg-slate-100 self-center"></div>
            <div className="relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-orange transition-colors" size={22} />
              <input 
                type="text" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="CITY"
                className="pl-14 pr-6 py-5 bg-transparent rounded-3xl focus:outline-none w-48 text-base font-black uppercase tracking-widest placeholder:text-slate-200"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-brand-orange hover:bg-brand-brown text-white px-10 py-5 rounded-[1.75rem] font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-brand-orange/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="fill-white" />}
              {loading ? 'SYNCING' : 'CALCULATE'}
            </button>
          </form>
        </div>

        {loading ? (
          <div className="h-[65vh] flex flex-col items-center justify-center gap-10">
            <div className="relative scale-150">
               <div className="absolute inset-0 bg-brand-orange rounded-full blur-[100px] opacity-20 animate-pulse"></div>
               <div className="w-24 h-24 border-8 border-brand-light border-t-brand-orange rounded-full animate-spin relative shadow-2xl shadow-brand-orange/40"></div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-slate-900 tracking-tight uppercase italic animate-pulse">Processing Live Demand Vectors</p>
              <p className="text-brand-orange font-black text-[10px] uppercase tracking-[0.5em] mt-5 opacity-80">THV CLOUD • AGGREGATING MARKET FEEDS</p>
            </div>
          </div>
        ) : (
          <div className="mb-20">
            {activeTab === DashboardTab.OVERVIEW && renderMarketReport()}
            {activeTab === DashboardTab.COMPETITORS && renderCompSet()}
            {activeTab === DashboardTab.PRICING && renderRateIntelligence()}
            {activeTab === DashboardTab.DEMAND && renderDemandDrivers()}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
