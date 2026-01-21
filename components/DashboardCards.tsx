
import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle2, IndianRupee, Eye } from 'lucide-react';
import { PricingInsights } from '../types';

interface Props {
  insights: PricingInsights;
}

const DashboardCards: React.FC<Props> = ({ insights }) => {
  const statusColors = {
    Critical: 'text-red-600 bg-red-50',
    Warning: 'text-orange-600 bg-orange-50',
    Optimal: 'text-emerald-600 bg-emerald-50'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <TrendingUp size={20} />
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColors[insights.status]}`}>
            {insights.status}
          </span>
        </div>
        <p className="text-slate-500 text-sm font-medium">Competitor Price Index</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{insights.cpi}%</h3>
        <p className="text-xs text-slate-400 mt-2">Target range: 95% - 105%</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Eye size={20} />
          </div>
        </div>
        <p className="text-slate-500 text-sm font-medium">OTA Visibility Score</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{insights.visibilityScore}/100</h3>
        <p className="text-xs text-slate-400 mt-2">Combined MMT, Booking, Goibibo</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <IndianRupee size={20} />
          </div>
        </div>
        <p className="text-slate-500 text-sm font-medium">Recommended BAR</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">₹{insights.recommendedBar.toLocaleString()}</h3>
        <p className="text-xs text-emerald-600 font-medium mt-2">+12% vs last week</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <AlertCircle size={20} />
          </div>
        </div>
        <p className="text-slate-500 text-sm font-medium">Revenue Opportunity</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">₹{insights.revenueOpportunity.toLocaleString()}</h3>
        <p className="text-xs text-slate-400 mt-2">At-risk leakage monthly</p>
      </div>
    </div>
  );
};

export default DashboardCards;
