
import React from 'react';
import { YouTubeScript } from '../types';
import { ICONS } from '../constants';

interface DashboardProps {
  scripts: YouTubeScript[];
  tier: string;
  credits: number;
  onNewScript: () => void;
  onOpenScript: (id: string) => void;
  onUpgrade: () => void;
}

export default function Dashboard({ scripts, tier, credits, onNewScript, onOpenScript, onUpgrade }: DashboardProps) {
  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold text-[#EAEAF0]">Workspace</h1>
            <span className="hidden md:inline-block px-2 py-0.5 bg-[#FF6A3D]/10 text-[#FF6A3D] text-[10px] font-black uppercase tracking-widest rounded border border-[#FF6A3D]/20">
              {tier}
            </span>
          </div>
          <p className="text-[#9AA3B2] text-sm mt-1">Manage and create viral YouTube scripts.</p>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {tier === 'free' && (
            <button 
              onClick={onUpgrade}
              className="text-[#C77DFF] font-black text-xs uppercase tracking-widest hover:text-white transition-colors"
            >
              Get More Credits
            </button>
          )}
          <button 
            onClick={onNewScript}
            disabled={credits <= 0 && tier !== 'agency'}
            className="bg-[#FF6A3D] hover:bg-[#FF8A66] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#FF6A3D]/20 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:grayscale"
          >
            <ICONS.Plus />
            <span>New Script</span>
          </button>
        </div>
      </header>

      {scripts.length === 0 ? (
        <div className="bg-[#151A22] border-2 border-dashed border-[#1F262F] rounded-3xl p-10 md:p-20 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#1F262F] text-[#FF6A3D] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <ICONS.Script />
          </div>
          <h3 className="text-xl font-bold text-[#EAEAF0]">No scripts yet</h3>
          <p className="text-[#9AA3B2] mt-3 max-w-sm mx-auto leading-relaxed text-sm md:text-base">
            Kickstart your next viral video with our AI-powered scriptwriting engine.
          </p>
          <button 
            onClick={onNewScript}
            className="mt-8 text-[#FF6A3D] font-bold hover:text-[#FF8A66] transition-colors"
          >
            Create your first script &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {scripts.map(script => (
            <div 
              key={script.id}
              onClick={() => onOpenScript(script.id)}
              className="bg-[#151A22] border border-[#1F262F] rounded-2xl p-5 md:p-6 hover:shadow-2xl hover:border-[#FF6A3D]/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 bg-[#FF6A3D]/10 text-[#FF6A3D] text-[9px] font-bold rounded-full uppercase tracking-widest border border-[#FF6A3D]/20">
                  {script.framework}
                </span>
                <span className="text-[10px] text-[#9AA3B2]">
                  {new Date(script.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-[#EAEAF0] group-hover:text-[#FF6A3D] transition-colors line-clamp-2 leading-tight">
                {script.title || script.topic}
              </h3>
              <p className="text-[#9AA3B2] text-xs md:text-sm mt-2 line-clamp-2 leading-relaxed">
                {script.sections[0]?.content.substring(0, 100)}...
              </p>
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-[#1F262F]">
                <span className="text-[10px] font-medium text-[#9AA3B2] uppercase tracking-widest">
                  {script.sections.length} Sections
                </span>
                <span className="text-[10px] font-bold text-[#FF6A3D] group-hover:translate-x-1 transition-transform uppercase tracking-widest">
                  Edit &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
