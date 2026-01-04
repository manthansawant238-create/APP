
export enum ScriptFramework {
  Documentary = 'Documentary Style',
  Storytelling = 'Narrative Storytelling',
  Listicle = 'Top 10 / Listicle',
  Explainer = 'Educational Explainer',
  ViralShortLong = 'Short-to-Long Conversion',
  CaseStudy = 'Case Study / deep Dive'
}

export enum Tone {
  Authoritative = 'Authoritative',
  Dramatic = 'Dramatic',
  Storytelling = 'Storytelling',
  Conversational = 'Conversational',
  Minimalist = 'Minimalist',
  Viral = 'High Energy / Viral'
}

export interface ChannelProfile {
  id: string;
  name: string;
  niche: string;
  targetAudience: string;
  defaultTone: Tone;
}

export interface ScriptSection {
  id: string;
  label: string;
  content: string;
  status: 'draft' | 'final';
}

export interface YouTubeScript {
  id: string;
  title: string;
  topic: string;
  framework: ScriptFramework;
  tone: Tone;
  sections: ScriptSection[];
  createdAt: number;
  metadata?: {
    hookOptions: string[];
    researchSummary: string;
  };
}

export interface UserState {
  credits: number;
  tier: 'free' | 'creator' | 'agency';
  scripts: YouTubeScript[];
  profiles: ChannelProfile[];
}
