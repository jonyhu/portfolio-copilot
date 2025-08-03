import { NextRequest, NextResponse } from 'next/server';
import { generateFollowUpQuestions } from '@/lib/ai-server';
import { Portfolio, MacroViews, AnalysisResponse } from '@/types/portfolio';

interface FollowUpRequest {
  portfolio: Portfolio;
  macroViews: MacroViews;
  previousAnalysis: AnalysisResponse;
  apiKey: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: FollowUpRequest = await request.json();
    const { portfolio, macroViews, previousAnalysis, apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    const questions = await generateFollowUpQuestions(portfolio, macroViews, previousAnalysis, apiKey);
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate follow-up questions' },
      { status: 500 }
    );
  }
} 