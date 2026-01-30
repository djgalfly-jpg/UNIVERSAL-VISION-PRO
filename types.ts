export interface BilingualContent {
  en: string;
  es: string;
}

export interface BilingualArray {
  en: string[];
  es: string[];
}

export interface DetailedSocialPlatform {
  concept: BilingualContent;
  artDirection: BilingualContent; // Specific visual details (LUTS, Camera angles, lighting)
}

export interface SocialStrategy {
  tiktok: BilingualContent;
  instagram: DetailedSocialPlatform;
  youtube: DetailedSocialPlatform;
}

export interface ComparableTrack {
  title: string;
  artist: string;
  similarityScore: number; // 0-100
  reason: BilingualContent; // Why it sounds similar
  differentiator: BilingualContent; // Why this track is unique compared to the hit
}

export interface PreReleaseTimeline {
  checklist: BilingualArray; // 4 weeks before
  assetsNeeded: BilingualArray; // Covers, Canvas, Teasers
}

export interface PostReleaseTimeline {
  week1: BilingualArray; // "Launch & Hype"
  week2: BilingualArray; // "Data & Sustain"
  month1: BilingualArray; // "Expansion"
}

export interface SongAnalysisData {
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  mood: BilingualContent; 
  
  // Technical Breakdown
  productionScore: number; // 0-100
  mixQuality: BilingualContent; 
  vocalPresence: BilingualContent; 
  
  // A&R Commercial
  successScore: number; // 0-100
  commercialViability: BilingualContent; 
  targetAudience: BilingualContent; 
  
  // Strategy
  viralHooks: BilingualArray; 
  socialStrategy: SocialStrategy;
  marketingCampaign: BilingualContent; 

  // New Modules
  marketComparison: ComparableTrack[];
  preRelease: PreReleaseTimeline;
  postReleaseSchedule: PostReleaseTimeline;
}

export interface AnalysisState {
  isLoading: boolean;
  data: SongAnalysisData | null;
  error: string | null;
}

export interface CoverArtState {
  isLoading: boolean;
  originalImage: string | null;
  generatedImage: string | null;
  prompt: string;
  error: string | null;
}