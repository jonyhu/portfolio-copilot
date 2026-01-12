'use client';

import { useState, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import Layout from '@/components/Layout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Portfolio, MacroViews, ChatMessage, AnalysisResponse } from '@/types/portfolio';
import { analyzePortfolio } from '@/lib/ai-utils';
import { loadPortfolio } from '@/lib/portfolio-storage';
import { getOrCreateMacroViews, saveMacroViews } from '@/lib/macro-views-storage';
import Link from 'next/link';

export default function AnalysisPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [macroViews, setMacroViews] = useState<MacroViews>(getOrCreateMacroViews());
  const [showMacroForm, setShowMacroForm] = useState(true);

  // Load portfolio from localStorage
  useEffect(() => {
    const savedPortfolio = loadPortfolio();
    if (savedPortfolio) {
      setPortfolio(savedPortfolio);
    }
  }, []);

  // Save macro views whenever they change
  useEffect(() => {
    saveMacroViews(macroViews);
  }, [macroViews]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !portfolio) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const analysis = await analyzePortfolio({
        portfolio,
        macroViews,
        specificQuestions: [inputMessage],
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: analysis.riskAssessment, // For follow-up questions, this contains the conversational response
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Send message error:', error);
      let errorMessage = 'Sorry, I encountered an error while analyzing your portfolio. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to analyze portfolio')) {
          errorMessage = 'Failed to analyze portfolio. Please try again.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      const errorMessageChat: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessageChat]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMacroViewsSubmit = async () => {
    if (!portfolio) return;

    setShowMacroForm(false);
    setIsLoading(true);

    try {
      const analysis = await analyzePortfolio({
        portfolio,
        macroViews,
      });

      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: formatInitialAnalysis(analysis),
        timestamp: new Date().toISOString(),
      };

      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Analysis error:', error);
      let errorMessage = 'Sorry, I encountered an error while analyzing your portfolio. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to analyze portfolio')) {
          errorMessage = 'Failed to analyze portfolio. Please try again.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      const errorChatMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages([errorChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatInitialAnalysis = (analysis: AnalysisResponse): string => {
    // Simply return the full AI response with a follow-up question
    return analysis.riskAssessment + '\n\n**What would you like to explore further about your portfolio or investment strategy?**';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!portfolio) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Portfolio Found</h3>
          <p className="text-gray-500 mb-6">Please add some assets to your portfolio first.</p>
          <Link href="/" className="btn-primary">
            Go to Portfolio
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gradient">Portfolio Analysis</h1>
          </div>
          <p className="text-gray-600">Think deeper about your investment thesis with AI</p>
        </div>

        {showMacroForm ? (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Share Your Investment Views</h3>
              <p className="text-sm text-gray-600">Help your thinking partner understand your investment thesis</p>
            </div>
            <div className="card-body">
              <form onSubmit={(e) => { e.preventDefault(); handleMacroViewsSubmit(); }} className="space-y-6">
                <div>
                  <label className="form-label">Economic Growth Outlook</label>
                  <textarea
                    value={macroViews.economicGrowth}
                    onChange={(e) => setMacroViews(prev => ({ ...prev, economicGrowth: e.target.value }))}
                    className="form-input resize-none"
                    rows={3}
                    placeholder="What&apos;s your view on economic growth? (e.g., recession, slow growth, strong recovery)"
                  />
                </div>

                <div>
                  <label className="form-label">Interest Rate Expectations</label>
                  <textarea
                    value={macroViews.interestRates}
                    onChange={(e) => setMacroViews(prev => ({ ...prev, interestRates: e.target.value }))}
                    className="form-input resize-none"
                    rows={3}
                    placeholder="What do you expect for interest rates? (e.g., higher for longer, cuts coming, stable)"
                  />
                </div>

                <div>
                  <label className="form-label">Government Policy Impact</label>
                  <textarea
                    value={macroViews.governmentPolicy}
                    onChange={(e) => setMacroViews(prev => ({ ...prev, governmentPolicy: e.target.value }))}
                    className="form-input resize-none"
                    rows={3}
                    placeholder="How do you think government policies will impact markets?"
                  />
                </div>

                <div>
                  <label className="form-label">Geopolitical Factors</label>
                  <textarea
                    value={macroViews.geopolitics}
                    onChange={(e) => setMacroViews(prev => ({ ...prev, geopolitics: e.target.value }))}
                    className="form-input resize-none"
                    rows={3}
                    placeholder="What geopolitical factors are you considering?"
                  />
                </div>

                <div>
                  <label className="form-label">Industry/Sector Views</label>
                  <textarea
                    value={macroViews.industrySpecific}
                    onChange={(e) => setMacroViews(prev => ({ ...prev, industrySpecific: e.target.value }))}
                    className="form-input resize-none"
                    rows={3}
                    placeholder="Any specific views on industries or sectors?"
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Portfolio
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">AI Portfolio Advisor</h3>
                </div>
                <button
                  onClick={() => setShowMacroForm(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit Views
                </button>
              </div>
              <p className="text-sm text-gray-600">Ask questions about your portfolio and investment strategy</p>
            </div>
            <div className="card-body">
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className={`chat-message ${message.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}`}>
                    <div className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}>
                      <div className="flex items-start space-x-2">
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 mt-1 flex-shrink-0" />
                        ) : (
                          <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                        )}
                        <div className="w-full">
                          {message.role === 'assistant' ? (
                            <MarkdownRenderer content={message.content} />
                          ) : (
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="chat-message chat-message-assistant">
                    <div className="chat-bubble chat-bubble-assistant">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing your portfolio...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your portfolio, investment strategy, or request specific analysis..."
                  className="form-input flex-1"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="btn-primary"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 
