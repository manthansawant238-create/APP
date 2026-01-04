import React, { useState } from 'react';
import { YouTubeScript, ScriptSection } from '../types';
import { regenerateSection } from '../services/gemini';
import { ICONS } from '../constants';

interface ScriptEditorProps {
  script: YouTubeScript;
  tier: string;
  onUpdate: (updated: YouTubeScript) => void;
  onBack: () => void;
}

export default function ScriptEditor({ script, tier, onUpdate, onBack }: ScriptEditorProps) {
  const [activeSectionId, setActiveSectionId] = useState(script.sections[0]?.id);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeSection = script.sections.find(s => s.id === activeSectionId);

  const getWordCount = (text: string) => {
    return (text || '').trim().split(/\s+/).filter(Boolean).length;
  };

  const handleUpdateContent = (content: string) => {
    const updatedSections = script.sections.map(s => 
      s.id === activeSectionId ? { ...s, content } : s
    );
    onUpdate({ ...script, sections: updatedSections });
  };

  const handleRegenerate = async () => {
    if (tier === 'free') {
      alert('Section regeneration is a PRO feature. Please upgrade your plan.');
      return;
    }
    if (!activeSection || !instruction.trim()) return;
    setIsRegenerating(true);
    setError(null);
    try {
      const newContent = await regenerateSection(activeSection.content, instruction, script.tone);
      handleUpdateContent(newContent);
      setInstruction('');
    } catch (e: any) {
      console.warn("Regeneration error handled:", e.message);
      setError(e.message || 'Failed to regenerate. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const copyToClipboard = () => {
    const fullText = script.sections.map(s => `[${s.label}]\n${s.content}`).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:h-[calc(100vh-120px)] animate-in fade-in duration-500 overflow-hidden">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="bg-[#1F262F] p-2.5 rounded-xl text-[#9AA3B2] transition-all active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="min-w-0">
            <h1 className="text-base md:text-2xl font-black text-[#EAEAF0] truncate">{script.title}</h1>
            <div className="flex items-center space-x-2 text-[9px] md:text-xs text-[#9AA3B2] mt-0.5">
              <span className="font-black text-[#FF6A3D] uppercase tracking-widest">{script.framework}</span>
              <span className="opacity-30">•</span>
              <span className="font-bold">{script.tone}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={copyToClipboard}
          className={`${isCopied ? 'bg-[#4ADE80]' : 'bg-[#FF6A3D]'} text-white px-4 md:px-5 py-2.5 rounded-xl font-black transition-all shadow-lg shadow-[#FF6A3D]/20 flex items-center justify-center space-x-2 active:scale-95 text-[10px] uppercase tracking-widest w-full md:w-auto`}
        >
          {isCopied ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2h2a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          )}
          <span>{isCopied ? 'Copied!' : 'Copy Full Script'}</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row md:space-x-8 min-h-0">
        {/* Section Navigation */}
        <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto space-x-2 md:space-x-0 md:space-y-3 pb-3 md:pb-0 md:w-64 scrollbar-hide shrink-0">
          {script.sections.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              className={`flex-shrink-0 md:flex-shrink text-left p-4 rounded-2xl transition-all border-2 group min-w-[140px] md:min-w-0 ${
                activeSectionId === section.id 
                ? 'bg-[#151A22] border-[#FF6A3D] shadow-xl shadow-[#FF6A3D]/5' 
                : 'bg-[#151A22]/50 border-transparent text-[#9AA3B2] hover:bg-[#1F262F]'
              }`}
            >
              <div className="flex justify-between items-center mb-1.5">
                <div className={`text-[8px] font-black uppercase tracking-[0.2em] transition-colors ${activeSectionId === section.id ? 'text-[#FF6A3D]' : 'text-[#2D3643]'}`}>
                  Phase {idx + 1}
                </div>
                <div className="text-[8px] font-black text-[#9AA3B2] opacity-50 uppercase tracking-tighter">
                  {getWordCount(section.content)} words
                </div>
              </div>
              <div className="text-[11px] md:text-sm font-black truncate uppercase tracking-tight">{section.label}</div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#151A22] rounded-3xl border border-[#1F262F] shadow-2xl overflow-hidden mt-1 md:mt-0 relative">
          {activeSection ? (
            <>
              <div className="px-6 md:px-8 py-4 border-b border-[#1F262F] bg-[#1F262F]/20 flex items-center justify-between">
                <span className="text-[9px] md:text-[10px] font-black text-[#FF6A3D] uppercase tracking-[0.2em]">{activeSection.label}</span>
                <span className="text-[9px] md:text-[10px] text-[#9AA3B2] font-black uppercase tracking-widest">{getWordCount(activeSection.content)} total words</span>
              </div>
              
              <div className="flex-1 p-6 md:p-8 overflow-y-auto min-h-[40vh] md:min-h-0 bg-gradient-to-b from-[#151A22] to-[#0E1116]/30">
                <textarea
                  value={activeSection.content || ''}
                  onChange={(e) => handleUpdateContent(e.target.value)}
                  className="w-full h-full text-base md:text-lg leading-[1.8] text-[#EAEAF0] bg-transparent outline-none resize-none font-medium placeholder-[#9AA3B2]/10"
                  placeholder="The script continues here..."
                />
              </div>

              {/* AI Quick Edit Bar */}
              <div className="p-4 md:p-6 bg-[#0E1116] border-t border-[#1F262F]">
                {error && (
                   <div className="mb-3 text-red-400 text-xs font-bold uppercase tracking-widest bg-red-900/10 p-2 rounded border border-red-500/20 text-center animate-pulse">
                     {error}
                   </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#151A22] p-2 rounded-2xl border border-[#1F262F] shadow-2xl">
                  <div className="relative flex-1 flex items-center">
                    <input 
                      type="text" 
                      value={instruction}
                      onChange={(e) => setInstruction(e.target.value)}
                      placeholder={tier === 'free' ? "Pro: Regeneration Locked" : "Edit instructions (e.g. 'shorter')"} 
                      className={`flex-1 px-4 py-3 bg-transparent outline-none text-[#EAEAF0] text-sm placeholder-[#9AA3B2]/30 ${tier === 'free' ? 'cursor-not-allowed opacity-50 font-black italic' : 'font-medium'}`}
                      disabled={tier === 'free'}
                    />
                    {tier === 'free' && (
                      <div className="absolute right-4 text-[8px] font-black text-[#C77DFF] uppercase tracking-[0.2em] bg-[#C77DFF]/10 px-2 py-1 rounded">Locked</div>
                    )}
                  </div>
                  <button 
                    onClick={handleRegenerate}
                    disabled={isRegenerating || (tier !== 'free' && !instruction.trim())}
                    className="bg-[#FF6A3D] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF8A66] disabled:opacity-50 transition-all active:scale-95 shadow-xl shadow-[#FF6A3D]/10 whitespace-nowrap"
                  >
                    {isRegenerating ? 'Rewriting...' : 'Regenerate'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#9AA3B2] py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-[#1F262F] rounded-2xl flex items-center justify-center opacity-30">
                <ICONS.Script />
              </div>
              <p className="text-xs font-black uppercase tracking-widest">Select a phase to start editing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}