'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PortfolioSummary } from '@/types/portfolio';
import { getAssetTypeLabel } from '@/lib/portfolio-utils';

interface PortfolioChartProps {
  summary: PortfolioSummary;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280'];

export default function PortfolioChart({ summary }: PortfolioChartProps) {
  const data = Object.entries(summary.allocationByTypePercent).map(([type, value]) => ({
    name: getAssetTypeLabel(type),
    value: parseFloat(value.toFixed(2)),
    type,
    amount: summary.allocationByType[type],
  }));

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: {
        name: string;
        amount: number;
        value: number;
      };
    }>;
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            Value: ${data.amount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Allocation: {data.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  interface LegendProps {
    payload?: Array<{
      value: string;
      color: string;
    }>;
  }

  const CustomLegend = ({ payload }: LegendProps) => (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload?.map((entry, index: number) => (
        <div key={entry.value} className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-700">
            {entry.value} ({data[index]?.value}%)
          </span>
        </div>
      ))}
    </div>
  );

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Portfolio Allocation</h3>
        <div className="text-center py-8 text-gray-500">
          No assets in portfolio yet. Add some assets to see the allocation chart.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Portfolio Allocation</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-xl font-semibold text-gray-900">
            ${summary.totalValue.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Total Gain/Loss</p>
          <p className={`text-xl font-semibold ${
            summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {summary.totalGainLoss >= 0 ? '+' : ''}${summary.totalGainLoss.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
} 