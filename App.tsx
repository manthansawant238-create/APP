
import React, { useState, useEffect } from 'react';
import { UserState, YouTubeScript, ChannelProfile, Tone, ScriptFramework } from './types';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import ScriptEditor from './components/ScriptEditor';
import ChannelManager from './components/ChannelManager';
import GeneratorModal from './components/GeneratorModal';
import Pricing from './components/Pricing';
import { ICONS } from './constants';

const INITIAL_USER: UserState = {
  credits: 5,
  tier: 'free',
  scripts: [],
  profiles: [
    {
      id: 'default',
      name: 'Main Channel',
      niche: 'Educational Tech',
      targetAudience: 'Early adopters and developers',
      defaultTone: Tone.Authoritative
    }
  ]
};

export default function App() {
  const [view, setView] = useState<'dashboard' | 'editor' | 'channels' | 'pricing'>('dashboard');
  const [user, setUser] = useState<UserState>(INITIAL_USER);
  const [activeScriptId, setActiveScriptId] = useState<string | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('scriptarc_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load user state", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('scriptarc_user', JSON.stringify(user));
  }, [user]);

  const activeScript = user.scripts.find(s => s.id === activeScriptId);

  const handleCreateScript = (newScript: YouTubeScript) => {
    setUser(prev => ({
      ...prev,
      scripts: [newScript, ...prev.scripts],
      credits: Math.max(0, prev.credits - 1)
    }));
    setActiveScriptId(newScript.id);
    setView('editor');
    setIsGeneratorOpen(false);
  };

  const handleUpdateScript = (updatedScript: YouTubeScript) => {
    setUser(prev => ({
      ...prev,
      scripts: prev.scripts.map(s => s.id === updatedScript.id ? updatedScript : s)
    }));
  };

  const handleUpgrade = (tier: 'free' | 'creator' | 'agency') => {
    const creditsMap = { free: 5, creator: 50, agency: 999 };
    setUser(prev => ({
      ...prev,
      tier,
      credits: creditsMap[tier]
    }));
    setView('dashboard');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0E1116] text-[#EAEAF0]">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <Sidebar 
          currentView={view} 
          onViewChange={setView} 
          credits={user.credits}
          tier={user.tier}
        />
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-[#151A22] border-b border-[#1F262F] sticky top-0 z-30">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-[#FF6A3D] rounded flex items-center justify-center shadow-lg shadow-[#FF6A3D]/20">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-black tracking-tighter text-[#EAEAF0]">ScriptArc</span>
        </div>
        <div className="flex items-center space-x-3">
           <span className="text-[9px] font-black uppercase text-[#FF6A3D] bg-[#FF6A3D]/10 px-2 py-0.5 rounded border border-[#FF6A3D]/20">
            {user.tier}
          </span>
        </div>
      </div>
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 md:p-8 mb-20 md:mb-0">
          {view === 'dashboard' && (
            <Dashboard 
              scripts={user.scripts} 
              tier={user.tier}
              credits={user.credits}
              onNewScript={() => setIsGeneratorOpen(true)}
              onOpenScript={(id) => { setActiveScriptId(id); setView('editor'); }}
              onUpgrade={() => setView('pricing')}
            />
          )}

          {view === 'editor' && activeScript && (
            <ScriptEditor 
              script={activeScript} 
              tier={user.tier}
              onUpdate={handleUpdateScript}
              onBack={() => setView('dashboard')}
            />
          )}

          {view === 'channels' && (
            <ChannelManager 
              profiles={user.profiles}
              tier={user.tier}
              onUpdate={(profiles) => setUser(prev => ({ ...prev, profiles }))}
            />
          )}

          {view === 'pricing' && (
            <Pricing 
              currentTier={user.tier}
              onSelectTier={handleUpgrade}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Enhanced for touch targets */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#151A22]/95 backdrop-blur-md border-t border-[#1F262F] px-8 py-3 flex items-center justify-between z-40 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button onClick={() => setView('dashboard')} className={`flex flex-col items-center space-y-1 active:scale-90 transition-transform ${view === 'dashboard' ? 'text-[#FF6A3D]' : 'text-[#9AA3B2]'}`}>
          <div className={`${view === 'dashboard' ? 'scale-110' : ''}`}><ICONS.Dashboard /></div>
          <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
        </button>
        
        <button onClick={() => setIsGeneratorOpen(true)} className="flex flex-col items-center -mt-10 active:scale-95 transition-transform">
          <div className="w-14 h-14 bg-[#FF6A3D] rounded-full shadow-2xl shadow-[#FF6A3D]/40 flex items-center justify-center text-white border-4 border-[#0E1116]">
            <ICONS.Plus />
          </div>
        </button>

        <button onClick={() => setView('pricing')} className={`flex flex-col items-center space-y-1 active:scale-90 transition-transform ${view === 'pricing' ? 'text-[#FF6A3D]' : 'text-[#9AA3B2]'}`}>
          <div className={`${view === 'pricing' ? 'scale-110' : ''}`}><ICONS.Settings /></div>
          <span className="text-[9px] font-black uppercase tracking-widest">Upgrade</span>
        </button>
      </div>

      {isGeneratorOpen && (
        <GeneratorModal 
          profiles={user.profiles}
          tier={user.tier}
          onClose={() => setIsGeneratorOpen(false)}
          onSubmit={handleCreateScript}
        />
      )}
    </div>
  );
}
