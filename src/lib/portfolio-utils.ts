import { Asset, Portfolio, PortfolioSummary } from '@/types/portfolio';

export function calculatePortfolioSummary(portfolio: Portfolio): PortfolioSummary {
  const assets = portfolio.assets;
  
  let totalValue = 0;
  let totalCost = 0;
  const allocationByType: Record<string, number> = {};
  
  assets.forEach(asset => {
    const currentPrice = asset.currentPrice || asset.purchasePrice;
    const assetValue = asset.quantity * currentPrice;
    const assetCost = asset.quantity * asset.purchasePrice;
    
    totalValue += assetValue;
    totalCost += assetCost;
    
    // Calculate allocation by type
    if (!allocationByType[asset.type]) {
      allocationByType[asset.type] = 0;
    }
    allocationByType[asset.type] += assetValue;
  });
  
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  
  // Calculate percentage allocation by type
  const allocationByTypePercent: Record<string, number> = {};
  Object.keys(allocationByType).forEach(type => {
    allocationByTypePercent[type] = totalValue > 0 ? (allocationByType[type] / totalValue) * 100 : 0;
  });
  
  return {
    totalValue,
    totalCost,
    totalGainLoss,
    totalGainLossPercent,
    allocationByType,
    allocationByTypePercent
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function getAssetTypeColor(type: string): string {
  const colors: Record<string, string> = {
    stock: 'bg-blue-500',
    etf: 'bg-green-500',
    bond: 'bg-yellow-500',
    crypto: 'bg-purple-500',
    other: 'bg-gray-500'
  };
  return colors[type] || colors.other;
}

export function getAssetTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    stock: 'Stock',
    etf: 'ETF',
    bond: 'Bond',
    crypto: 'Crypto',
    other: 'Other'
  };
  return labels[type] || 'Other';
}

export function validateAsset(asset: Partial<Asset>): string[] {
  const errors: string[] = [];
  
  if (!asset.ticker?.trim()) {
    errors.push('Ticker is required');
  }
  
  if (!asset.name?.trim()) {
    errors.push('Asset name is required');
  }
  
  if (!asset.type) {
    errors.push('Asset type is required');
  }
  
  if (!asset.quantity || asset.quantity <= 0) {
    errors.push('Quantity must be greater than 0');
  }
  
  if (!asset.purchasePrice || asset.purchasePrice <= 0) {
    errors.push('Purchase price must be greater than 0');
  }
  
  return errors;
}

export function generatePortfolioId(): string {
  return `portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateAssetId(): string {
  return `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
} 