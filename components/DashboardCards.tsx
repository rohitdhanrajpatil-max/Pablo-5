
import React from 'react';
// Added missing ArrowUpRight icon import from lucide-react
import { TrendingUp, AlertCircle, CheckCircle2, IndianRupee, Eye, ArrowUpRight } from 'lucide-react';
import { PricingInsights } from '../types';

interface Props {
  insights: PricingInsights;
}

const DashboardCards: React.FC<Props> = ({ insights }) => {
  const statusColors = {
    Critical: 'text-white bg-brand-orange shadow-lg shadow-brand-orange/20',
    Warning: 'text-brand-orange bg-brand-light border border-brand-orange/20',
    Optimal: 'text-emerald-700 bg-emerald-50 border border-emerald-100'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-brand-light rounded-2xl text-brand-orange">
            <TrendingUp size={24} />
          </div>
          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${statusColors[insights.status]}`}>
            {insights.status}
          </span>
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Comp Price Index</p>
        <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{insights.cpi}%</h3>
        <div className="w-full bg-slate-100 h-1 rounded-full mt-4 overflow-hidden">
          <div className="bg-brand-orange h-full" style={{ width: `${Math.min(insights.cpi, 100)}%` }}></div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-brand-light rounded-2xl text-brand-orange">
            <Eye size={24} />
          </div>
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Visibility Index</p>
        <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{insights.visibilityScore}<span className="text-sm text-slate-300 ml-1">/100</span></h3>
        <p className="text-[10px] font-bold text-slate-400 mt-3 flex items-center gap-1 uppercase tracking-tighter">
           <CheckCircle2 size={12} className="text-emerald-500" /> Across major OTAs
        </p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 border-t-8 border-t-brand-orange">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-brand-light rounded-2xl text-brand-orange shadow-inner">
            <IndianRupee size={24} />
          </div>
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Suggested BAR</p>
        <h3 className="text-3xl font-black text-brand-orange mt-1 tracking-tighter">₹{insights.recommendedBar.toLocaleString()}</h3>
        <div className="flex items-center gap-1.5 mt-3">
          {/* Use the newly imported ArrowUpRight icon */}
          <ArrowUpRight size={14} className="text-emerald-500" />
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">+12% Optimal</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-slate-100 rounded-2xl text-brand-brown">
            <AlertCircle size={24} />
          </div>
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Leakage Risk</p>
        <h3 className="text-3xl font-black text-brand-brown mt-1 tracking-tighter">₹{insights.revenueOpportunity.toLocaleString()}</h3>
        <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-tighter">Monthly projected variance</p>
      </div>
    </div>
  );
};

export default DashboardCards;
