import { Portfolio, MacroViews } from '@/types/portfolio';
import { generatePortfolioId } from './portfolio-utils';
import { savePortfolio } from './portfolio-storage';
import { saveMacroViews } from './macro-views-storage';

export const demoPortfolio: Portfolio = {
  id: generatePortfolioId(),
  name: 'Demo Portfolio',
  assets: [
    {
      id: '1',
      ticker: 'AAPL',
      name: 'Apple Inc.',
      type: 'stock',
      quantity: 50,
      purchasePrice: 150.00,
      currentPrice: 175.00,
      notes: 'Technology leader with strong ecosystem',
      purchaseDate: '2023-01-15',
    },
    {
      id: '2',
      ticker: 'MSFT',
      name: 'Microsoft Corporation',
      type: 'stock',
      quantity: 30,
      purchasePrice: 280.00,
      currentPrice: 320.00,
      notes: 'Cloud computing and productivity software',
      purchaseDate: '2023-02-20',
    },
    {
      id: '3',
      ticker: 'VTI',
      name: 'Vanguard Total Stock Market ETF',
      type: 'etf',
      quantity: 100,
      purchasePrice: 220.00,
      currentPrice: 240.00,
      notes: 'Broad market exposure for diversification',
      purchaseDate: '2023-03-10',
    },
    {
      id: '4',
      ticker: 'BND',
      name: 'Vanguard Total Bond Market ETF',
      type: 'bond',
      quantity: 200,
      purchasePrice: 80.00,
      currentPrice: 78.00,
      notes: 'Fixed income allocation for stability',
      purchaseDate: '2023-04-05',
    },
    {
      id: '5',
      ticker: 'BTC-USD',
      name: 'Bitcoin',
      type: 'crypto',
      quantity: 0.5,
      purchasePrice: 45000.00,
      currentPrice: 52000.00,
      notes: 'Digital asset allocation',
      purchaseDate: '2023-05-12',
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const demoMacroViews = {
  economicGrowth: 'I expect moderate economic growth with potential for a soft landing. Inflation is cooling but remains above target, and the labor market remains strong.',
  interestRates: 'I believe the Fed will keep rates higher for longer, with potential for 1-2 more hikes before pausing. Rate cuts may not come until late 2024 or early 2025.',
  governmentPolicy: 'Fiscal policy remains expansionary with infrastructure spending, but there\'s uncertainty around debt ceiling negotiations and potential government shutdowns.',
  geopolitics: 'Ongoing tensions between US and China, Russia-Ukraine conflict, and Middle East instability create geopolitical risks that could impact energy prices and supply chains.',
  industrySpecific: 'I\'m bullish on technology (AI/cloud computing), healthcare (aging population), and defensive sectors. Cautious on consumer discretionary and real estate due to high rates.',
};

export function loadDemoData(): { portfolio: Portfolio; macroViews: MacroViews } {
  // Save the demo portfolio and macro views to localStorage
  savePortfolio(demoPortfolio);
  saveMacroViews(demoMacroViews);
  
  return {
    portfolio: demoPortfolio,
    macroViews: demoMacroViews,
  };
} 