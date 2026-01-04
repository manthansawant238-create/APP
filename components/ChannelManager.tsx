
import React, { useState } from 'react';
import { ChannelProfile, Tone } from '../types';
import { TONES, ICONS } from '../constants';

interface ChannelManagerProps {
  profiles: ChannelProfile[];
  tier: 'free' | 'creator' | 'agency';
  onUpdate: (profiles: ChannelProfile[]) => void;
}

export default function ChannelManager({ profiles, tier, onUpdate }: ChannelManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const getLimit = () => {
    if (tier === 'free') return 1;
    if (tier === 'creator') return 5;
    return 20;
  };

  const addProfile = () => {
    if (profiles.length >= getLimit()) {
      alert(`The ${tier} plan is limited to ${getLimit()} channel profile(s). Please upgrade to add more.`);
      return;
    }
    const newProfile: ChannelProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Channel',
      niche: '',
      targetAudience: '',
      defaultTone: Tone.Conversational
    };
    onUpdate([...profiles, newProfile]);
    setEditingId(newProfile.id);
  };

  const updateProfile = (id: string, updates: Partial<ChannelProfile>) => {
    onUpdate(profiles.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const removeProfile = (id: string) => {
    if (profiles.length === 1) return alert('You must have at least one profile.');
    onUpdate(profiles.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in slide-in-from-right-4 duration-300">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#EAEAF0]">Channels</h1>
          <p className="text-[#9AA3B2] text-xs md:text-sm mt-1">
            {profiles.length}/{getLimit()} used ({tier})
          </p>
        </div>
        <button 
          onClick={addProfile}
          className="flex items-center space-x-2 text-[#FF6A3D] font-bold hover:bg-[#FF6A3D]/10 px-4 py-2 rounded-xl transition-all active:scale-95 text-sm"
        >
          <ICONS.Plus />
          <span className="hidden sm:inline">Add Profile</span>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {profiles.map(profile => (
          <div key={profile.id} className="bg-[#151A22] border border-[#1F262F] rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF6A3D]/5 rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <div className="flex items-center space-x-4 md:space-x-5">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-[#1F262F] rounded-xl md:rounded-2xl flex items-center justify-center text-[#FF6A3D] shadow-lg border border-[#2D3643]">
                  <ICONS.Channel />
                </div>
                <input 
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateProfile(profile.id, { name: e.target.value })}
                  className="text-lg md:text-2xl font-bold text-[#EAEAF0] outline-none border-b-2 border-transparent focus:border-[#FF6A3D] transition-all bg-transparent w-full"
                />
              </div>
              <button 
                onClick={() => removeProfile(profile.id)}
                className="text-[#9AA3B2] hover:text-red-500 transition-colors p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div>
                <label className="block text-[10px] font-bold text-[#9AA3B2] uppercase tracking-widest mb-2">Niche</label>
                <input 
                  type="text"
                  value={profile.niche}
                  onChange={(e) => updateProfile(profile.id, { niche: e.target.value })}
                  placeholder="e.g., Tech Documentary"
                  className="w-full bg-[#0E1116] px-4 py-3 rounded-xl border border-[#1F262F] text-[#EAEAF0] focus:border-[#FF6A3D] outline-none transition-all placeholder-[#9AA3B2]/20 text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#9AA3B2] uppercase tracking-widest mb-2">Audience</label>
                <input 
                  type="text"
                  value={profile.targetAudience}
                  onChange={(e) => updateProfile(profile.id, { targetAudience: e.target.value })}
                  placeholder="e.g., 18-35 Males"
                  className="w-full bg-[#0E1116] px-4 py-3 rounded-xl border border-[#1F262F] text-[#EAEAF0] focus:border-[#FF6A3D] outline-none transition-all placeholder-[#9AA3B2]/20 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-[#9AA3B2] uppercase tracking-widest mb-3">Brand Voice</label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map(t => (
                    <button
                      key={t}
                      onClick={() => updateProfile(profile.id, { defaultTone: t as Tone })}
                      className={`px-3 py-1.5 md:px-5 md:py-2.5 rounded-lg md:rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest ${
                        profile.defaultTone === t 
                        ? 'bg-[#FF6A3D] text-white shadow-lg' 
                        : 'bg-[#1F262F] text-[#9AA3B2]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
