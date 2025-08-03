import { AnalysisRequest, AnalysisResponse, Portfolio, MacroViews } from '@/types/portfolio';
import { loadApiKey } from './api-key-storage';

export async function analyzePortfolio(request: AnalysisRequest): Promise<AnalysisResponse> {
  try {
    const apiKey = loadApiKey();
    if (!apiKey) {
      throw new Error('API key not found. Please set up your OpenAI API key first.');
    }

    console.log('Sending analysis request with API key:', apiKey.substring(0, 10) + '...');
    
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...request, apiKey }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('API response error:', response.status, errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to analyze portfolio`);
    }
    
    const result = await response.json();
    console.log('Analysis response received:', result);
    return result;
  } catch (error) {
    console.error('Error analyzing portfolio:', error);
    throw error;
  }
}

export async function generateFollowUpQuestions(
  portfolio: Portfolio,
  macroViews: MacroViews,
  previousAnalysis: AnalysisResponse
): Promise<string[]> {
  try {
    const apiKey = loadApiKey();
    if (!apiKey) {
      throw new Error('API key not found. Please set up your OpenAI API key first.');
    }

    console.log('Sending follow-up questions request with API key:', apiKey.substring(0, 10) + '...');
    
    const response = await fetch('/api/follow-up-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portfolio, macroViews, previousAnalysis, apiKey }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Follow-up questions API response error:', response.status, errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate follow-up questions`);
    }
    
    const result = await response.json();
    console.log('Follow-up questions response received:', result);
    return result;
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    return [
      'What specific data supports your view on economic growth?',
      'How would your portfolio perform in a different interest rate environment?',
      'What evidence contradicts your investment thesis?'
    ];
  }
} 