
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import DashboardCards from './components/DashboardCards';
import { 
  Hotel, 
  DemandEvent, 
  PricingInsights, 
  DashboardTab,
  HistoricalParity
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
  Share2
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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.OVERVIEW);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('Taj Lands End');
  const [city, setCity] = useState('Mumbai');
  const [marketData, setMarketData] = useState<{
    competitors: Hotel[],
    events: DemandEvent[],
    insights: PricingInsights,
    historicalParity: HistoricalParity[],
    sources?: any[]
  } | null>(null);
  const [report, setReport] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchMarketIntelligence(searchQuery, city);
      setMarketData(data);
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm">
            <Diamond size={12} className="text-indigo-500" /> Upscale
          </span>
        );
      case 'Midscale':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
            <HotelIcon size={12} className="text-emerald-500" /> Midscale
          </span>
        );
      case 'Economy':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
            <BadgeDollarSign size={12} className="text-slate-500" /> Economy
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

  const renderMarketReport = () => {
    if (!marketData) return null;

    const chartData = marketData.competitors.map(c => ({
      name: c.name.split(' ').slice(0, 2).join(' '),
      rate: c.currentRate,
    }));

    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Key Metrics Moved Into Report as requested */}
        <DashboardCards insights={marketData.insights} />

        {/* Report Header */}
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
          {/* Strategy Card - Most Important */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border border-white/10">
               <div className="absolute -bottom-20 -right-20 p-8 opacity-10 group-hover:opacity-20 transition-all duration-500 scale-150">
                 <Zap size={200} />
               </div>
               <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-500 rounded-xl text-slate-900">
                    <Flame size={20} />
                  </div>
                  <h3 className="font-bold text-xl tracking-tight">AI Strategic Summary</h3>
                </div>
                <div className="text-base leading-relaxed opacity-100">
                  {report ? (
                    <div className="space-y-4 font-semibold text-slate-100">
                      {report.split('\n').filter(line => line.trim().length > 0).map((line, i) => (
                        <div key={i} className="flex gap-4 items-start bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-indigo-500 flex-shrink-0 flex items-center justify-center text-xs font-black text-white mt-0.5">
                            {i + 1}
                          </div>
                          <p className="text-indigo-100">{line.replace(/^[*-]\s*/, '').replace(/^[0-9]\.\s*/, '')}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 py-8">
                      <Loader2 size={24} className="animate-spin text-indigo-400" />
                      <span className="text-slate-400 text-lg">Generating core strategy...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Visual Analytics */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-800 text-xl tracking-tight uppercase">Competitive Rate Map</h3>
                <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-600"></div> Competitors</span>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                    />
                    <Tooltip 
                      cursor={{stroke: '#e2e8f0'}}
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px'}} 
                    />
                    <Area type="monotone" dataKey="rate" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorRate)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Side Module: Demand Events */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 text-lg uppercase tracking-tight">Demand Pulse</h3>
                <Zap size={18} className="text-amber-500 fill-amber-500" />
              </div>
              <div className="space-y-4">
                {marketData.events.slice(0, 8).map((event, i) => (
                  <div key={i} className="group flex flex-col p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all cursor-default">
                    <div className="flex justify-between items-start mb-2">
                       <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                        event.impact === 'High' ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-600'
                       }`}>
                         {event.impact}
                       </span>
                       <span className="text-xs font-bold text-emerald-600">+{event.suggestedUplift}%</span>
                    </div>
                    <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{event.name}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-2">
                      <CalendarClock size={12} />
                      {event.date}
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setActiveTab(DashboardTab.DEMAND)}
                className="w-full mt-6 py-3 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                View Full Calendar
              </button>
            </div>
          </div>
        </div>

        {/* Report Footer / Grounding */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center gap-2">
            {marketData.sources?.slice(0, 3).map((chunk, i) => chunk.web && (
              <a key={i} href={chunk.web.uri} target="_blank" className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">
                <ExternalLink size={10} /> {chunk.web.title}
              </a>
            ))}
          </div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Powered by RevIQ Gemini Engine</p>
        </div>
      </div>
    );
  };

  const renderCompSet = () => {
    if (!marketData) return null;
    return (
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hotel Identity</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Index</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Tier</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-Time Rate</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Insight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {marketData.competitors.map((comp) => (
              <tr key={comp.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-6">
                  <p className="font-bold text-slate-800 text-base">{comp.name}</p>
                  <p className="text-xs text-slate-400 font-medium">{comp.category}</p>
                </td>
                <td className="px-8 py-6 text-sm text-slate-600 font-semibold">{comp.distance}</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-amber-600">{comp.rating}</span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Scored {comp.reviewCount} reviews</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  {getPositioningBadge(comp.positioning)}
                </td>
                <td className="px-8 py-6">
                  <p className="font-black text-slate-900 text-lg">₹{comp.currentRate.toLocaleString()}</p>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <ChevronRight size={24} />
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

    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl shadow-inner">
              <ShieldAlert size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Leakage Points</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{marketData.competitors.filter(c => c.otaData?.some(o => Math.abs(o.parityGap) > 2)).length}</h3>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Gap Avg</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">3.4%</h3>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Channel Health</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">Fair</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800 text-xl tracking-tight uppercase">7-Day Rate Parity Trend</h3>
            <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-2 text-blue-600"><div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div> Booking</span>
              <span className="flex items-center gap-2 text-red-500"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> MMT</span>
              <span className="flex items-center gap-2 text-emerald-500"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Agoda</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketData.historicalParity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 15px 35px -5px rgba(0,0,0,0.1)'}} />
                <Line type="monotone" dataKey="bookingGap" stroke="#2563eb" strokeWidth={4} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="mmtGap" stroke="#ef4444" strokeWidth={4} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="agodaGap" stroke="#10b981" strokeWidth={4} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderDemandDrivers = () => {
    if (!marketData) return null;
    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {marketData.events.map((event, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group relative overflow-hidden flex flex-col h-full border-b-4 border-b-slate-100">
               <div className="flex justify-between items-start mb-6">
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    event.impact === 'High' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {event.impact} IMPACT
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-black text-base">
                    <ArrowUpRight size={18} /> {event.suggestedUplift}%
                  </div>
               </div>
               <h4 className="font-bold text-slate-900 mb-3 text-xl leading-tight group-hover:text-indigo-600 transition-colors">{event.name}</h4>
               <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium flex-grow">{event.description}</p>
               <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto font-black text-[10px] tracking-widest uppercase">
                  <div className="flex items-center gap-2 text-slate-400">
                    <CalendarClock size={16} /> {event.date}
                  </div>
                  <div className="text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{event.distance}</div>
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-12 overflow-y-auto">
        {/* Unified Dashboard Search Area - Only Hotel and City as requested */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">RevIQ ENGINE</h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1 ml-1">Pan-India Revenue Intelligence</p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-4 p-2 bg-white rounded-3xl shadow-xl shadow-indigo-500/5 border border-slate-100">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="HOTEL NAME"
                className="pl-12 pr-6 py-4 bg-transparent rounded-2xl focus:outline-none w-64 text-sm font-bold placeholder:text-slate-300 placeholder:uppercase placeholder:tracking-widest"
              />
            </div>
            <div className="w-px h-10 bg-slate-100 self-center"></div>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                type="text" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="CITY"
                className="pl-12 pr-6 py-4 bg-transparent rounded-2xl focus:outline-none w-40 text-sm font-bold placeholder:text-slate-300 placeholder:uppercase placeholder:tracking-widest"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-[1.25rem] font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} className="fill-amber-400 text-amber-400" />}
              {loading ? 'SYNCING' : 'GENERATE'}
            </button>
          </form>
        </div>

        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center gap-8">
            <div className="relative">
               <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[80px] opacity-10 animate-pulse"></div>
               <div className="w-24 h-24 border-8 border-slate-100 border-t-indigo-600 rounded-full animate-spin relative"></div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Aggregating Live Market Feeds</p>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mt-3">MMT • Booking • Goibibo • Events</p>
            </div>
          </div>
        ) : (
          <>
            {/* Market Data is shown here as the 'Report' */}
            <div className="mb-12">
              {activeTab === DashboardTab.OVERVIEW && renderMarketReport()}
              {activeTab === DashboardTab.COMPETITORS && renderCompSet()}
              {activeTab === DashboardTab.PRICING && renderRateIntelligence()}
              {activeTab === DashboardTab.DEMAND && renderDemandDrivers()}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
