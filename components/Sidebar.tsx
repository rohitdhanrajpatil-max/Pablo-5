
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  CalendarClock, 
  Settings, 
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { DashboardTab } from '../types';

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: DashboardTab.OVERVIEW, icon: LayoutDashboard, label: 'Market Overview' },
    { id: DashboardTab.COMPETITORS, icon: Users, label: 'CompSet Analysis' },
    { id: DashboardTab.PRICING, icon: TrendingUp, label: 'Rate Intelligence' },
    { id: DashboardTab.DEMAND, icon: CalendarClock, label: 'Demand Drivers' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col sticky top-0">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          R
        </div>
        <div>
          <h1 className="font-bold text-slate-800 text-lg">RevIQ</h1>
          <p className="text-xs text-slate-400">Revenue Engine</p>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className={activeTab === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
              <span className="font-medium">{item.label}</span>
            </div>
            {activeTab === item.id && <ChevronRight size={16} />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-3 w-full p-3 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
        <div className="mt-4 p-4 bg-slate-900 rounded-xl text-white">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-60">Pan-India Support</p>
          <p className="text-sm mt-1">Live rates from 12k+ properties</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
