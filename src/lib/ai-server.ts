import OpenAI from 'openai';
import { Portfolio, MacroViews, AnalysisRequest, AnalysisResponse } from '@/types/portfolio';
import { calculatePortfolioSummary } from './portfolio-utils';

export async function analyzePortfolio(request: AnalysisRequest, apiKey: string): Promise<AnalysisResponse> {
  const { portfolio, macroViews, specificQuestions } = request;
  const summary = calculatePortfolioSummary(portfolio);

  console.log('Server: Analyzing portfolio with', portfolio.assets.length, 'assets');
  console.log('Server: API key provided:', apiKey ? 'Yes' : 'No');

  const openai = new OpenAI({ apiKey });

  const isFollowUp = specificQuestions && specificQuestions.length > 0;

  if (isFollowUp) {
    return await handleFollowUpQuestion(portfolio, summary, macroViews, specificQuestions![0], openai);
  } else {
    return await handleInitialAnalysis(portfolio, summary, macroViews, openai);
  }
}

async function handleInitialAnalysis(
  portfolio: Portfolio,
  summary: any,
  macroViews: MacroViews,
  openai: OpenAI
): Promise<AnalysisResponse> {
  const prompt = buildInitialAnalysisPrompt(portfolio, summary, macroViews);
  try {
    console.log('Server: Sending initial analysis request to OpenAI');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an experienced investment committee member at a sophisticated hedge fund. Your role is to evaluate investment decisions with rigor and skepticism.

For the INITIAL analysis, provide a comprehensive overview that includes:

1. INSIGHTS: How well does this portfolio align with the stated macro views? What are the key strengths and strategic positioning?

2. CONTRADICTIONS: What contradictions exist between the macro views and portfolio positioning? What potential misalignments should be addressed?

3. RECOMMENDATIONS: What specific actions would you recommend to optimize the portfolio given the macro environment?

4. RISK ASSESSMENT: What are the key risks given the macro environment described? Include both portfolio-specific and macro risks.

5. FOLLOW-UP QUESTIONS: What critical questions would you ask to deepen the investment thesis and identify potential blind spots?

Format your response with clear section headers using **bold** text. Be direct, analytical, and provide actionable insights. Focus on the big picture alignment between macro views and portfolio positioning.`
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
    const response = completion.choices[0]?.message?.content || '';
    console.log('Server: Received OpenAI response:', response.substring(0, 200) + '...');
    return parseAnalysisResponse(response);
  } catch (error) {
    console.error('Server: Error analyzing portfolio:', error);
    throw new Error(`Failed to analyze portfolio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function handleFollowUpQuestion(
  portfolio: Portfolio,
  summary: any,
  macroViews: MacroViews,
  question: string,
  openai: OpenAI
): Promise<AnalysisResponse> {
  const prompt = buildFollowUpPrompt(portfolio, summary, macroViews, question);
  try {
    console.log('Server: Sending follow-up question to OpenAI:', question.substring(0, 100) + '...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an experienced investment committee member having a conversation with an investor.
          For follow-up questions, respond conversationally and naturally. Don't repeat the structured format. Instead:
          - Answer the specific question asked
          - Provide actionable insights
          - Ask clarifying questions if needed
          - Reference the portfolio context when relevant
          - Be conversational but professional
          Keep your response focused and direct. Don't regurgitate the initial analysis structure.`
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });
    const response = completion.choices[0]?.message?.content || '';
    console.log('Server: Received follow-up response:', response.substring(0, 200) + '...');
    return {
      insights: [], contradictions: [], followUpQuestions: [], recommendations: [], riskAssessment: response
    };
  } catch (error) {
    console.error('Server: Error handling follow-up question:', error);
    throw new Error(`Failed to process your question: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function buildInitialAnalysisPrompt(portfolio: Portfolio, summary: any, macroViews: MacroViews): string {
  return `Please analyze this investment portfolio in the context of the stated macro views:

PORTFOLIO SUMMARY:
- Total Value: $${summary.totalValue.toLocaleString()}
- Total Cost: $${summary.totalCost.toLocaleString()}
- Total Gain/Loss: $${summary.totalGainLoss.toLocaleString()} (${summary.totalGainLossPercent.toFixed(2)}%)

ASSET ALLOCATION:
${Object.entries(summary.allocationByType).map(([type, amount]) => `- ${type}: $${(amount as number).toLocaleString()} (${(summary.allocationByTypePercent[type] as number).toFixed(1)}%)`).join('\n')}

ASSETS:
${portfolio.assets.map(asset => {
  const value = asset.quantity * (asset.currentPrice || asset.purchasePrice);
  const gainLoss = value - (asset.quantity * asset.purchasePrice);
  const gainLossPercent = ((gainLoss / (asset.quantity * asset.purchasePrice)) * 100);
  return `- ${asset.ticker} (${asset.name}): ${asset.quantity} shares @ $${asset.purchasePrice} = $${value.toLocaleString()} (${gainLoss >= 0 ? '+' : ''}${gainLoss.toLocaleString()}, ${gainLossPercent.toFixed(1)}%)`;
}).join('\n')}

MACRO VIEWS:
- Economic Growth: ${macroViews.economicGrowth}
- Interest Rates: ${macroViews.interestRates}
- Government Policy: ${macroViews.governmentPolicy}
- Geopolitics: ${macroViews.geopolitics}
- Industry/Sector Views: ${macroViews.industrySpecific}

Please provide a comprehensive analysis following the structured format requested.`;
}

function buildFollowUpPrompt(portfolio: Portfolio, summary: any, macroViews: MacroViews, question: string): string {
  return `Based on this portfolio and macro context, please answer this specific question: "${question}"

PORTFOLIO CONTEXT:
- Total Value: $${summary.totalValue.toLocaleString()}
- Asset Allocation: ${Object.entries(summary.allocationByTypePercent).map(([type, percent]) => `${type}: ${(percent as number).toFixed(1)}%`).join(', ')}

MACRO CONTEXT:
- Economic Growth: ${macroViews.economicGrowth}
- Interest Rates: ${macroViews.interestRates}
- Government Policy: ${macroViews.governmentPolicy}
- Geopolitics: ${macroViews.geopolitics}

Please provide a conversational, direct answer to the question while referencing the portfolio and macro context when relevant.`;
}

function parseAnalysisResponse(response: string): AnalysisResponse {
  console.log('Server: Parsing response:', response.substring(0, 500) + '...');
  
  // Try different parsing strategies
  let sections: string[] = [];
  
  // Strategy 1: Split by bold headers with colons
  sections = response.split(/\*\*([^*]+)\*\*:/g);
  console.log('Server: Strategy 1 - Split sections:', sections.length, 'parts');
  
  // If we don't get enough sections, try strategy 2
  if (sections.length < 6) {
    // Strategy 2: Split by numbered sections
    sections = response.split(/\d+\.\s*\*\*([^*]+)\*\*:/g);
    console.log('Server: Strategy 2 - Split sections:', sections.length, 'parts');
  }
  
  // If still not enough, try strategy 3
  if (sections.length < 6) {
    // Strategy 3: Split by any bold text
    sections = response.split(/\*\*([^*]+)\*\*/g);
    console.log('Server: Strategy 3 - Split sections:', sections.length, 'parts');
  }
  
  const result = {
    insights: extractSection(sections, 'INSIGHTS') as string[],
    contradictions: extractSection(sections, 'CONTRADICTIONS') as string[],
    followUpQuestions: extractSection(sections, 'FOLLOW-UP QUESTIONS') as string[],
    recommendations: extractSection(sections, 'RECOMMENDATIONS') as string[],
    riskAssessment: extractSection(sections, 'RISK ASSESSMENT') as string,
  };
  
  console.log('Server: Parsed result:', {
    insightsCount: result.insights.length,
    contradictionsCount: result.contradictions.length,
    followUpQuestionsCount: result.followUpQuestions.length,
    recommendationsCount: result.recommendations.length,
    riskAssessmentLength: result.riskAssessment.length
  });
  
  // If parsing failed completely, return the full response as risk assessment
  const totalItems = result.insights.length + result.contradictions.length + 
                    result.followUpQuestions.length + result.recommendations.length;
  
  if (totalItems === 0 && result.riskAssessment.length === 0) {
    console.log('Server: Parsing failed, returning full response as risk assessment');
    return {
      insights: [],
      contradictions: [],
      followUpQuestions: [],
      recommendations: [],
      riskAssessment: response
    };
  }
  
  return result;
}

function extractSection(sections: string[], sectionName: string): string[] | string {
  console.log('Server: Looking for section:', sectionName);
  
  // Try different variations of the section name
  const variations = [
    sectionName.toUpperCase(),
    sectionName,
    sectionName.replace('-', ' '),
    sectionName.replace(' ', '-'),
    sectionName.replace('UP QUESTIONS', 'UP QUESTIONS'),
    sectionName.replace('UP QUESTIONS', 'UP_QUESTIONS')
  ];
  
  let sectionIndex = -1;
  let foundVariation = '';
  
  for (const variation of variations) {
    sectionIndex = sections.findIndex(section => 
      section.trim().toUpperCase() === variation.toUpperCase()
    );
    if (sectionIndex !== -1) {
      foundVariation = variation;
      break;
    }
  }
  
  console.log('Server: Section index for', sectionName, ':', sectionIndex, 'found variation:', foundVariation);
  
  if (sectionIndex === -1 || sectionIndex + 1 >= sections.length) {
    console.log('Server: Section not found or no content:', sectionName);
    return sectionName === 'RISK ASSESSMENT' ? '' : [];
  }
  
  const content = sections[sectionIndex + 1].trim();
  console.log('Server: Content for', sectionName, ':', content.substring(0, 200) + '...');
  
  if (sectionName === 'RISK ASSESSMENT') {
    return content;
  }
  
  // Parse bullet points for other sections - be more flexible
  const items = content.split('\n')
    .map(line => line.trim())
    .filter(line => 
      line.startsWith('-') || 
      line.startsWith('•') || 
      line.startsWith('*') ||
      line.match(/^[A-Z][a-z]/) // Lines starting with capital letters
    )
    .map(line => {
      // Remove bullet points and numbering
      return line.replace(/^[-•*\d\.]\s*/, '').trim();
    })
    .filter(item => item.length > 0 && !item.match(/^[A-Z\s]+$/)); // Filter out all-caps headers
  
  console.log('Server: Extracted items for', sectionName, ':', items.length, 'items');
  return items;
}

export async function generateFollowUpQuestions(
  portfolio: Portfolio,
  macroViews: MacroViews,
  previousAnalysis: AnalysisResponse,
  apiKey: string
): Promise<string[]> {
  const openai = new OpenAI({ apiKey });
  const summary = calculatePortfolioSummary(portfolio);
  
  try {
    console.log('Server: Generating follow-up questions');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an investment committee member. Generate 3-5 follow-up questions based on the portfolio analysis and macro views. Questions should be specific, actionable, and help deepen the investment thesis.`
        },
        {
          role: 'user',
          content: `Based on this portfolio analysis and macro views, generate follow-up questions:

PORTFOLIO: ${portfolio.assets.length} assets, total value $${summary.totalValue.toLocaleString()}
MACRO VIEWS: ${Object.values(macroViews).filter(v => v.trim()).join('; ')}
PREVIOUS ANALYSIS: ${previousAnalysis.insights.join('; ')}

Generate 3-5 specific follow-up questions.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    const response = completion.choices[0]?.message?.content || '';
    const questions = response.split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.startsWith('•') || line.startsWith('*') || line.match(/^\d+\./))
      .map(line => line.replace(/^[-•*\d\.]\s*/, ''))
      .filter(q => q.length > 0);
    
    return questions.length > 0 ? questions : [
      'What specific data supports your view on economic growth?',
      'How would your portfolio perform in a different interest rate environment?',
      'What evidence contradicts your investment thesis?'
    ];
  } catch (error) {
    console.error('Server: Error generating follow-up questions:', error);
    return [
      'What specific data supports your view on economic growth?',
      'How would your portfolio perform in a different interest rate environment?',
      'What evidence contradicts your investment thesis?'
    ];
  }
}