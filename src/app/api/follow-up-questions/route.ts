import { NextRequest, NextResponse } from 'next/server';
import { generateFollowUpQuestions } from '@/lib/ai-server';
import { Portfolio, MacroViews, AnalysisResponse } from '@/types/portfolio';
import { enforceRateLimit, getClientIp, isBodyTooLarge, validatePortfolioInputs } from '@/lib/ai-guards';

interface FollowUpRequest {
  portfolio: Portfolio;
  macroViews: MacroViews;
  previousAnalysis: AnalysisResponse;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Server is missing OpenAI API key configuration.' },
        { status: 500 }
      );
    }

    const body: FollowUpRequest = await request.json();
    const { portfolio, macroViews, previousAnalysis } = body;

    if (isBodyTooLarge(body)) {
      return NextResponse.json(
        { error: 'Request payload is too large.' },
        { status: 413 }
      );
    }

    const validationError = validatePortfolioInputs(portfolio, macroViews);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    if (!previousAnalysis) {
      return NextResponse.json(
        { error: 'Previous analysis is required.' },
        { status: 400 }
      );
    }

    const ip = getClientIp(request);
    const rateLimit = enforceRateLimit(ip, 'ai');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.message },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfterSeconds.toString(),
          },
        }
      );
    }

    const questions = await generateFollowUpQuestions(portfolio, macroViews, previousAnalysis);
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate follow-up questions' },
      { status: 500 }
    );
  }
} 
