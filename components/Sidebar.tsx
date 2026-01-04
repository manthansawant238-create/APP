
import React from 'react';
import { ICONS } from '../constants';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: any) => void;
  credits: number;
  tier: 'free' | 'creator' | 'agency';
}

export default function Sidebar({ currentView, onViewChange, credits, tier }: SidebarProps) {
  const NavItem = ({ view, label, icon: Icon }: any) => (
    <button
      onClick={() => onViewChange(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        currentView === view 
          ? 'bg-[#FF6A3D] text-white shadow-lg shadow-[#FF6A3D]/20' 
          : 'text-[#9AA3B2] hover:bg-[#1F262F] hover:text-[#EAEAF0]'
      }`}
    >
      <Icon />
      <span className="font-medium">{label}</span>
    </button>
  );

  // Define limits for visual representation
  const limits = {
    free: 5,
    creator: 50,
    agency: 999
  };

  const currentLimit = limits[tier];
  const usedCredits = tier === 'agency' ? 0 : currentLimit - credits;
  const progressPercent = tier === 'agency' ? 100 : Math.min(100, (credits / currentLimit) * 100);
  
  const getNextTierInfo = () => {
    if (tier === 'free') return { name: 'Creator', perk: '50 Scripts & Research' };
    if (tier === 'creator') return { name: 'Agency', perk: 'Unlimited Everything' };
    return null;
  };

  const nextTier = getNextTierInfo();

  return (
    <aside className="w-64 bg-[#151A22] border-r border-[#1F262F] flex flex-col h-screen sticky top-0 shadow-xl">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-10 group cursor-pointer" onClick={() => onViewChange('dashboard')}>
          <div className="w-8 h-8 bg-[#FF6A3D] rounded-lg flex items-center justify-center shadow-lg shadow-[#FF6A3D]/30 group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#EAEAF0]">ScriptArc</span>
        </div>

        <nav className="space-y-3">
          <NavItem view="dashboard" label="Dashboard" icon={ICONS.Dashboard} />
          <NavItem view="channels" label="Channel Profiles" icon={ICONS.Channel} />
          <NavItem view="pricing" label="Plans & Billing" icon={ICONS.Settings} />
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-6">
        {/* Plan Status Card */}
        <div className="bg-[#1F262F] p-4 rounded-2xl border border-[#2D3643] shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#9AA3B2] mb-0.5">Current Plan</span>
              <span className={`text-sm font-bold capitalize ${tier === 'agency' ? 'text-[#C77DFF]' : 'text-[#EAEAF0]'}`}>
                {tier}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#9AA3B2] mb-0.5 block">Credits</span>
              <span className="text-sm font-bold text-[#FF6A3D]">
                {tier === 'agency' ? '∞' : credits}
              </span>
            </div>
          </div>

          <div className="w-full bg-[#0E1116] rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${tier === 'agency' ? 'bg-[#C77DFF]' : 'bg-[#FF6A3D]'}`} 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {nextTier ? (
            <div className="pt-3 border-t border-[#2D3643]">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#9AA3B2] mb-2">
                Unlock {nextTier.name}
              </p>
              <div className="flex items-center justify-between bg-[#0E1116]/40 p-2 rounded-lg border border-white/5 group cursor-pointer hover:border-[#FF6A3D]/30 transition-colors" onClick={() => onViewChange('pricing')}>
                <span className="text-[10px] text-[#EAEAF0]/70 truncate max-w-[120px]">
                  {nextTier.perk}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#FF6A3D] group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="pt-2 flex items-center space-x-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse"></div>
               <span className="text-[10px] font-bold text-[#4ADE80] uppercase tracking-widest">Maximum Power Unlocked</span>
            </div>
          )}
        </div>
        
        {/* User Profile Area */}
        <div className="flex items-center space-x-3 px-2 py-1 bg-[#1F262F]/30 rounded-2xl border border-[#2D3643]/30">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#2D3643] border border-[#FF6A3D]/20 flex items-center justify-center text-[#FF6A3D] font-bold text-sm">
              CU
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-[#151A22] rounded-full ${tier === 'agency' ? 'bg-[#C77DFF]' : tier === 'creator' ? 'bg-[#FF6A3D]' : 'bg-[#9AA3B2]'}`}></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#EAEAF0] truncate">Creator User</p>
            <p className="text-[10px] text-[#9AA3B2] font-black uppercase tracking-tighter">Script Arc Studio</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
