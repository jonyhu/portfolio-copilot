import { NextRequest, NextResponse } from 'next/server';
import { analyzePortfolio } from '@/lib/ai-server';
import { AnalysisRequest } from '@/types/portfolio';
import { AI_MAX_QUESTION_CHARS } from '@/lib/ai-config';
import { enforceRateLimit, getClientIp, isBodyTooLarge, validatePortfolioInputs } from '@/lib/ai-guards';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Server is missing OpenAI API key configuration.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { portfolio, macroViews, specificQuestions } = body;
    const questionList = Array.isArray(specificQuestions) ? specificQuestions : undefined;

    console.log('API: Received analyze request');
    console.log('API: Portfolio assets:', portfolio?.assets?.length || 0);

    if (isBodyTooLarge(body)) {
      return NextResponse.json(
        { error: 'Request payload is too large.' },
        { status: 413 }
      );
    }

    const validationError = validatePortfolioInputs(portfolio, macroViews);
    if (validationError) {
      console.error('API: Invalid portfolio inputs:', validationError);
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    if (questionList && questionList.length > 1) {
      return NextResponse.json(
        { error: 'Only one follow-up question is allowed at a time.' },
        { status: 400 }
      );
    }

    const question = questionList?.[0];
    if (question && question.length > AI_MAX_QUESTION_CHARS) {
      return NextResponse.json(
        { error: `Question exceeds ${AI_MAX_QUESTION_CHARS} characters.` },
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

    const analysisRequest: AnalysisRequest = {
      portfolio,
      macroViews,
      specificQuestions: questionList,
    };

    console.log('API: Calling analyzePortfolio function');
    const result = await analyzePortfolio(analysisRequest);
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
