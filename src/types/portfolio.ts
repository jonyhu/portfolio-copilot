export interface Asset {
  id: string;
  ticker: string;
  name: string;
  type: 'stock' | 'etf' | 'bond' | 'crypto' | 'other';
  quantity: number;
  purchasePrice: number;
  currentPrice?: number;
  purchaseDate?: string;
  notes?: string;
}

export interface Portfolio {
  id: string;
  name: string;
  assets: Asset[];
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  allocationByType: Record<string, number>;
  allocationByTypePercent: Record<string, number>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  portfolioContext?: PortfolioSummary;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface MacroViews {
  economicGrowth: string;
  interestRates: string;
  governmentPolicy: string;
  geopolitics: string;
  industrySpecific: string;
}

export interface AnalysisRequest {
  portfolio: Portfolio;
  macroViews: MacroViews;
  specificQuestions?: string[];
}

export interface AnalysisResponse {
  insights: string[];
  contradictions: string[];
  followUpQuestions: string[];
  recommendations: string[];
  riskAssessment: string;
} 