'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Layout from '@/components/Layout';
import PortfolioChart from '@/components/PortfolioChart';
import { Portfolio, PortfolioSummary } from '@/types/portfolio';
import { calculatePortfolioSummary, formatCurrency } from '@/lib/portfolio-utils';

export default function ChartsPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);

  // Load portfolio from localStorage
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedPortfolio) {
      const parsedPortfolio = JSON.parse(savedPortfolio);
      setPortfolio(parsedPortfolio);
      setSummary(calculatePortfolioSummary(parsedPortfolio));
    }
  }, []);

  if (!portfolio || !summary) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No Portfolio Data</h3>
          <p className="mt-1 text-sm text-gray-500">
            Please add some assets to your portfolio to see charts and analytics.
          </p>
        </div>
      </Layout>
    );
  }

  // Prepare data for asset value chart
  const assetValueData = portfolio.assets.map(asset => ({
    name: asset.ticker,
    value: (asset.currentPrice || asset.purchasePrice) * asset.quantity,
    cost: asset.purchasePrice * asset.quantity,
    gainLoss: ((asset.currentPrice || asset.purchasePrice) - asset.purchasePrice) * asset.quantity,
  }));

  // Prepare data for allocation by type
  const allocationData = Object.entries(summary.allocationByType).map(([type, value]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    value: value as number,
    percentage: summary.allocationByTypePercent[type],
  }));

  // Prepare data for gain/loss by asset
  const gainLossData = portfolio.assets.map(asset => {
    const currentPrice = asset.currentPrice || asset.purchasePrice;
    const gainLoss = (currentPrice - asset.purchasePrice) * asset.quantity;
    const gainLossPercent = ((currentPrice - asset.purchasePrice) / asset.purchasePrice) * 100;
    
    return {
      name: asset.ticker,
      gainLoss,
      gainLossPercent,
      color: gainLoss >= 0 ? '#10B981' : '#EF4444',
    };
  });

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-sm text-gray-600" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Gain/Loss' ? formatCurrency(entry.value) : `${entry.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Charts</h1>
          <p className="text-gray-600">Visual insights for deeper portfolio thinking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio Allocation Pie Chart */}
          <div className="lg:col-span-2">
            <PortfolioChart summary={summary} />
          </div>

          {/* Asset Values Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Values</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetValueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#3B82F6" name="Current Value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation by Type Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Allocation by Asset Type</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={allocationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="percentage" fill="#10B981" name="Allocation %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gain/Loss by Asset */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Gain/Loss by Asset</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gainLossData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="gainLoss" fill="#8B5CF6" name="Gain/Loss">
                    {gainLossData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Portfolio Summary Stats */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Portfolio Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Assets:</span>
                <span className="font-medium">{portfolio.assets.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Value:</span>
                <span className="font-medium">{formatCurrency(summary.totalValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Cost:</span>
                <span className="font-medium">{formatCurrency(summary.totalCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Gain/Loss:</span>
                <span className={`font-medium ${
                  summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {summary.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(summary.totalGainLoss)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gain/Loss %:</span>
                <span className={`font-medium ${
                  summary.totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {summary.totalGainLossPercent >= 0 ? '+' : ''}{summary.totalGainLossPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Type Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Type Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allocationData.map((item) => (
              <div key={item.type} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{item.type}</div>
                <div className="text-lg text-gray-600">{formatCurrency(item.value)}</div>
                <div className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 