import { Portfolio } from '@/types/portfolio';
import { generatePortfolioId } from './portfolio-utils';

const PORTFOLIO_STORAGE_KEY = 'portfolio';

export function savePortfolio(portfolio: Portfolio): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolio));
    }
  } catch (error) {
    console.error('Failed to save portfolio to localStorage:', error);
  }
}

export function loadPortfolio(): Portfolio | null {
  try {
    if (typeof window !== 'undefined') {
      const savedPortfolio = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      if (savedPortfolio) {
        return JSON.parse(savedPortfolio);
      }
    }
  } catch (error) {
    console.error('Failed to load portfolio from localStorage:', error);
  }
  return null;
}

export function createDefaultPortfolio(): Portfolio {
  return {
    id: generatePortfolioId(),
    name: 'My Portfolio',
    assets: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function getOrCreatePortfolio(): Portfolio {
  const savedPortfolio = loadPortfolio();
  if (savedPortfolio) {
    return savedPortfolio;
  }
  
  const defaultPortfolio = createDefaultPortfolio();
  savePortfolio(defaultPortfolio);
  return defaultPortfolio;
}

export function clearPortfolio(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PORTFOLIO_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to clear portfolio from localStorage:', error);
  }
} 