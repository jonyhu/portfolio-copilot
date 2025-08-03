import { NextRequest, NextResponse } from 'next/server';
import { analyzePortfolio } from '@/lib/ai-server';
import { AnalysisRequest } from '@/types/portfolio';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { portfolio, macroViews, specificQuestions, apiKey } = body;

    console.log('API: Received analyze request');
    console.log('API: Portfolio assets:', portfolio?.assets?.length || 0);
    console.log('API: Has API key:', !!apiKey);

    if (!apiKey) {
      console.error('API: Missing API key');
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    if (!portfolio || !macroViews) {
      console.error('API: Missing portfolio or macro views');
      return NextResponse.json(
        { error: 'Portfolio and macro views are required' },
        { status: 400 }
      );
    }

    const analysisRequest: AnalysisRequest = {
      portfolio,
      macroViews,
      specificQuestions,
    };

    console.log('API: Calling analyzePortfolio function');
    const result = await analyzePortfolio(analysisRequest, apiKey);
    console.log('API: Analysis completed successfully');
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API: Error in analyze endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Failed to analyze portfolio: ${errorMessage}` },
      { status: 500 }
    );
  }
} 