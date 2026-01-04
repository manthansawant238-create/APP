
import React, { useState } from 'react';
import { ChannelProfile, ScriptFramework, Tone, YouTubeScript } from '../types';
import { FRAMEWORKS, TONES } from '../constants';
import { generateResearchAndHooks, generateFullScript } from '../services/gemini';

interface GeneratorModalProps {
  profiles: ChannelProfile[];
  tier: 'free' | 'creator' | 'agency';
  onClose: () => void;
  onSubmit: (script: YouTubeScript) => void;
}

export default function GeneratorModal({ profiles, tier, onClose, onSubmit }: GeneratorModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [topic, setTopic] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(profiles[0]);
  const [framework, setFramework] = useState(ScriptFramework.Documentary);
  const [tone, setTone] = useState(Tone.Dramatic);
  
  // AI Derived State
  const [research, setResearch] = useState('');
  const [hooks, setHooks] = useState<string[]>([]);
  const [selectedHookIndex, setSelectedHookIndex] = useState(0);

  const isProFramework = (f: string) => {
    return [ScriptFramework.ViralShortLong, ScriptFramework.CaseStudy].includes(f as any);
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!topic.trim()) return setError('Please enter a topic');
      setLoading(true);
      setError(null);
      try {
        const data = await generateResearchAndHooks(topic, selectedProfile.niche);
        setResearch(data.research);
        setHooks(data.hooks);
        setStep(2);
      } catch (e) {
        setError('Failed to research topic. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      setLoading(true);
      setError(null);
      try {
        const sectionsData = await generateFullScript(
          topic, 
          framework, 
          tone, 
          selectedProfile, 
          research, 
          hooks[selectedHookIndex]
        );
        
        const newScript: YouTubeScript = {
          id: Math.random().toString(36).substr(2, 9),
          title: topic,
          topic,
          framework,
          tone,
          createdAt: Date.now(),
          metadata: {
            researchSummary: research,
            hookOptions: hooks
          },
          sections: sectionsData.map((s: any, i: number) => ({
            id: `s-${i}`,
            label: s.label,
            content: s.content,
            status: 'draft'
          }))
        };
        onSubmit(newScript);
      } catch (e) {
        setError('Failed to generate script. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E1116] md:bg-[#0E1116]/80 backdrop-blur-md">
      <div className="bg-[#151A22] w-full h-full md:h-auto md:max-w-2xl md:max-h-[90vh] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-slide-up md:animate-in md:zoom-in-95 border-t md:border border-[#1F262F]">
        {/* Modal Header */}
        <div className="px-6 py-5 md:p-8 flex justify-between items-center border-b border-[#1F262F] bg-[#151A22]">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-[#EAEAF0]">Viral Script Engine</h2>
            <div className="flex space-x-2 mt-2">
              {[1, 2].map(s => (
                <div key={s} className={`h-1 w-8 rounded-full transition-all duration-300 ${step >= s ? 'bg-[#FF6A3D] w-12' : 'bg-[#1F262F]'}`} />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="bg-[#1F262F] text-[#9AA3B2] p-2 rounded-full hover:text-[#EAEAF0] active:scale-90 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-[#9AA3B2] uppercase tracking-[0.2em] mb-2">Target Idea / Topic</label>
                <textarea 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. The psychology behind why people buy Rolex watches..."
                  className="w-full h-32 md:h-40 px-5 py-4 rounded-2xl bg-[#0E1116] border border-[#1F262F] text-[#EAEAF0] focus:ring-2 focus:ring-[#FF6A3D] focus:border-transparent outline-none transition-all resize-none placeholder-[#9AA3B2]/30 text-sm md:text-base font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-[#9AA3B2] uppercase tracking-[0.2em] mb-2">Channel Context</label>
                  <select 
                    className="w-full px-5 py-4 rounded-2xl bg-[#0E1116] border border-[#1F262F] text-[#EAEAF0] outline-none focus:ring-2 focus:ring-[#FF6A3D] text-sm font-bold appearance-none"
                    value={selectedProfile.id}
                    onChange={(e) => setSelectedProfile(profiles.find(p => p.id === e.target.value)!)}
                  >
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#9AA3B2] uppercase tracking-[0.2em] mb-2">Retention Logic</label>
                  <select 
                    className="w-full px-5 py-4 rounded-2xl bg-[#0E1116] border border-[#1F262F] text-[#EAEAF0] outline-none focus:ring-2 focus:ring-[#FF6A3D] text-sm font-bold appearance-none"
                    value={framework}
                    onChange={(e) => setFramework(e.target.value as ScriptFramework)}
                  >
                    {FRAMEWORKS.map(f => (
                      <option key={f} value={f} disabled={tier === 'free' && isProFramework(f)}>
                        {f} {tier === 'free' && isProFramework(f) ? '(PRO)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-[#9AA3B2] uppercase tracking-[0.2em] mb-3">Select the Hook</label>
                <div className="space-y-3">
                  {hooks.map((h, i) => (
                    <div 
                      key={i}
                      onClick={() => setSelectedHookIndex(i)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedHookIndex === i 
                        ? 'border-[#FF6A3D] bg-[#FF6A3D]/5 ring-4 ring-[#FF6A3D]/5' 
                        : 'border-[#1F262F] bg-[#0E1116] hover:border-[#2D3643]'
                      }`}
                    >
                      <p className="text-xs md:text-sm text-[#EAEAF0] leading-relaxed italic font-medium">"{h}"</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#9AA3B2] uppercase tracking-[0.2em] mb-3">Narrative Tone</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TONES.map(t => (
                    <button
                      key={t}
                      onClick={() => setTone(t as Tone)}
                      className={`px-4 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest border ${
                        tone === t 
                        ? 'bg-[#FF6A3D] text-white border-[#FF6A3D] shadow-lg shadow-[#FF6A3D]/20' 
                        : 'bg-[#1F262F] text-[#9AA3B2] border-transparent'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer - Sticky on mobile */}
        <div className="px-6 py-6 md:p-8 bg-[#1F262F]/30 border-t border-[#1F262F] flex items-center justify-between pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-8">
          {step > 1 && (
            <button 
              onClick={() => setStep(s => s - 1)}
              className="text-[#9AA3B2] font-black hover:text-[#EAEAF0] transition-colors uppercase text-[10px] tracking-[0.2em]"
            >
              Back
            </button>
          )}
          <button 
            onClick={handleNext}
            disabled={loading}
            className={`ml-auto flex items-center space-x-3 bg-[#FF6A3D] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-[#FF6A3D]/20 disabled:opacity-50 transition-all active:scale-95`}
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            <span>{loading ? 'Analyzing...' : step === 1 ? 'Next Phase' : 'Construct Script'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
