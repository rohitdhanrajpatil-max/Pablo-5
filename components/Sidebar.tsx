
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  CalendarClock, 
  Settings, 
  ChevronRight
} from 'lucide-react';
import { DashboardTab } from '../types';

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

const Logo: React.FC<{ size?: string }> = ({ size = "w-10 h-10" }) => (
  <div className={`${size} relative overflow-hidden flex items-center justify-center font-black text-white text-xs tracking-tighter`}>
    <div className="absolute inset-0 grid grid-cols-3">
      <div className="bg-brand-brown h-full"></div>
      <div className="bg-brand-orange h-full"></div>
      <div className="bg-brand-brown h-full"></div>
    </div>
    <span className="relative z-10 scale-110">THV</span>
  </div>
);

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
        <Logo />
        <div>
          <h1 className="font-bold text-slate-800 text-lg">RevIQ</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange">by THV Group</p>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-brand-light text-brand-orange shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className={activeTab === item.id ? 'text-brand-orange' : 'text-slate-400 group-hover:text-slate-600'} />
              <span className="font-bold text-sm">{item.label}</span>
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
        <div className="mt-4 p-4 bg-brand-brown rounded-xl text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">Enterprise Tier</p>
          <p className="text-sm mt-1 font-medium leading-tight">Live market connectivity active.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
