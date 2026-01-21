
export interface Hotel {
  id: string;
  name: string;
  category: string;
  starLevel: number;
  distance: string;
  location: string;
  currentRate: number;
  otaRanking: number;
  rating: number;
  reviewCount: number;
  positioning: 'Luxury' | 'Midscale' | 'Economy' | 'Upscale';
  otaData?: OTAParameters[];
}

export interface OTAParameters {
  platform: string;
  rate: number;
  cancellationPolicy: string;
  breakfast: boolean;
  visibilityScore: number;
  parityGap: number; // Percentage difference from official/lowest rate
}

export interface HistoricalParity {
  date: string;
  bookingGap: number;
  mmtGap: number;
  agodaGap: number;
}

export interface DemandEvent {
  name: string;
  date: string;
  distance: string;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  suggestedUplift: number;
}

export interface PricingInsights {
  recommendedBar: number;
  cpi: number; // Competitor Price Index
  visibilityScore: number;
  revenueOpportunity: number;
  status: 'Critical' | 'Warning' | 'Optimal';
  summary: string;
}

export enum DashboardTab {
  OVERVIEW = 'overview',
  COMPETITORS = 'competitors',
  DEMAND = 'demand',
  PRICING = 'pricing'
}
