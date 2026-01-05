
export interface UserProfile {
  name: string;
  hairType: 'straight' | 'wavy' | 'curly' | 'coily';
  growthRate: 'slow' | 'average' | 'fast';
  preferredStyle: string;
  weeklyRhythm: 'social-weekend' | 'busy-midweek' | 'consistent';
  lastCutDate: string;
}

export interface RecommendedSlot {
  date: string;
  reason: string;
  score: 'optimal' | 'good' | 'risky';
  event?: string;
}

export interface AppState {
  onboardingComplete: boolean;
  profile: UserProfile | null;
  recommendations: RecommendedSlot[];
  streak: number;
}
