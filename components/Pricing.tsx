
import React from 'react';

interface PricingProps {
  currentTier: 'free' | 'creator' | 'agency';
  onSelectTier: (tier: 'free' | 'creator' | 'agency') => void;
}

export default function Pricing({ currentTier, onSelectTier }: PricingProps) {
  const tiers = [
    {
      id: 'free',
      name: 'Starter',
      price: '$0',
      description: 'Ideal for solo creators just starting out.',
      features: [
        '5 Scripts / month',
        'Standard AI Reasoning',
        '1 Channel Profile',
      ],
      buttonText: 'Current Plan',
      accent: 'text-[#9AA3B2]'
    },
    {
      id: 'creator',
      name: 'Creator',
      price: '$29',
      description: 'Scale your channel with viral logic.',
      features: [
        '50 Scripts / month',
        'Google Search Engine',
        '5 Channel Profiles',
        'Regeneration Logic',
      ],
      buttonText: 'Upgrade',
      popular: true,
      accent: 'text-[#FF6A3D]'
    },
    {
      id: 'agency',
      name: 'Agency',
      price: '$99',
      description: 'The ultimate tool for empires.',
      features: [
        'Unlimited Scripts',
        'Priority Pro Reasoning',
        '20+ Channel Profiles',
        'VIP Support',
      ],
      buttonText: 'Go Pro',
      accent: 'text-[#C77DFF]'
    }
  ];

  const comparisonFeatures = [
    { name: 'Scripts', free: '5', creator: '50', agency: '∞' },
    { name: 'Reasoning', free: 'Std', creator: 'Adv', agency: 'Pro' },
    { name: 'Profiles', free: '1', creator: '5', agency: '20+' },
    { name: 'Google', free: false, creator: true, agency: true },
    { name: 'Rewrite', free: false, creator: true, agency: true },
  ];

  const CheckIcon = () => (
    <svg className="w-4 h-4 text-[#FF6A3D] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );

  const CrossIcon = () => (
    <svg className="w-4 h-4 text-[#1F262F] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <div className="pb-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="text-center mb-10 md:mb-16 pt-4">
        <h2 className="text-[10px] font-bold text-[#FF6A3D] uppercase tracking-[0.3em] mb-3">Upgrade Dashboard</h2>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#EAEAF0] mb-4 tracking-tight">Growth Engine</h1>
        <p className="text-[#9AA3B2] max-w-lg mx-auto text-sm md:text-lg leading-relaxed">
          Choose the plan that matches your creative ambition.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {tiers.map((tier) => (
          <div 
            key={tier.id}
            className={`relative flex flex-col bg-[#151A22] border-2 rounded-[2rem] p-6 md:p-10 transition-all duration-300 ${
              tier.id === currentTier 
                ? 'border-[#FF6A3D] bg-[#FF6A3D]/5' 
                : 'border-[#1F262F]'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF6A3D] text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className={`text-sm font-black uppercase tracking-widest mb-1 ${tier.accent}`}>{tier.name}</h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-black text-[#EAEAF0]">{tier.price}</span>
                <span className="text-[#9AA3B2] text-xs font-medium">/mo</span>
              </div>
            </div>

            <div className="flex-1 space-y-3 mb-8">
              {tier.features.map((feature, i) => (
                <div key={i} className="flex items-center space-x-3 text-xs">
                  <div className={`flex-shrink-0 w-1 h-1 rounded-full ${tier.id === currentTier ? 'bg-[#FF6A3D]' : 'bg-[#2D3643]'}`} />
                  <span className="text-[#EAEAF0]/80">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onSelectTier(tier.id as any)}
              disabled={tier.id === currentTier}
              className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                tier.id === currentTier 
                  ? 'bg-[#1F262F] text-[#9AA3B2]' 
                  : tier.popular 
                    ? 'bg-[#FF6A3D] text-white' 
                    : 'bg-[#1F262F] text-[#EAEAF0]'
              }`}
            >
              {tier.id === currentTier ? 'Active' : tier.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-xl mx-auto overflow-hidden">
        <h3 className="text-lg font-bold text-[#EAEAF0] mb-6 text-center">Feature Breakdown</h3>
        <div className="bg-[#151A22] border border-[#1F262F] rounded-2xl overflow-x-auto">
          <table className="w-full text-left min-w-[300px]">
            <thead>
              <tr className="bg-[#1F262F]/50 border-b border-[#1F262F]">
                <th className="px-4 py-3 text-[9px] font-bold text-[#9AA3B2] uppercase tracking-widest">Feature</th>
                <th className="px-4 py-3 text-[9px] font-bold text-[#9AA3B2] uppercase tracking-widest text-center">S</th>
                <th className="px-4 py-3 text-[9px] font-bold text-[#FF6A3D] uppercase tracking-widest text-center">C</th>
                <th className="px-4 py-3 text-[9px] font-bold text-[#C77DFF] uppercase tracking-widest text-center">A</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F262F]">
              {comparisonFeatures.map((f, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 text-xs font-semibold text-[#EAEAF0]">{f.name}</td>
                  <td className="px-4 py-3 text-[10px] text-[#9AA3B2] text-center">
                    {typeof f.free === 'boolean' ? (f.free ? <CheckIcon /> : <CrossIcon />) : f.free}
                  </td>
                  <td className="px-4 py-3 text-[10px] text-[#FF6A3D] text-center font-bold">
                    {typeof f.creator === 'boolean' ? (f.creator ? <CheckIcon /> : <CrossIcon />) : f.creator}
                  </td>
                  <td className="px-4 py-3 text-[10px] text-[#C77DFF] text-center font-bold">
                    {typeof f.agency === 'boolean' ? (f.agency ? <CheckIcon /> : <CrossIcon />) : f.agency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
