'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import Layout from '@/components/Layout';
import AssetForm from '@/components/AssetForm';
import PortfolioChart from '@/components/PortfolioChart';
import { Asset, Portfolio } from '@/types/portfolio';
import { calculatePortfolioSummary, formatCurrency, formatPercentage, getAssetTypeLabel } from '@/lib/portfolio-utils';
import { loadDemoData } from '@/lib/demo-data';
import { getOrCreatePortfolio, savePortfolio } from '@/lib/portfolio-storage';

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio>(getOrCreatePortfolio());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>();
  const [summary, setSummary] = useState(calculatePortfolioSummary(portfolio));

  // Update summary whenever portfolio changes
  useEffect(() => {
    setSummary(calculatePortfolioSummary(portfolio));
  }, [portfolio]);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    savePortfolio(portfolio);
  }, [portfolio]);

  const handleAddAsset = () => {
    setEditingAsset(undefined);
    setIsFormOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setIsFormOpen(true);
  };

  const handleDeleteAsset = (assetId: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      setPortfolio(prev => ({
        ...prev,
        assets: prev.assets.filter(asset => asset.id !== assetId),
        updatedAt: new Date().toISOString(),
      }));
    }
  };

  const handleSaveAsset = (asset: Asset) => {
    if (editingAsset) {
      // Update existing asset
      setPortfolio(prev => ({
        ...prev,
        assets: prev.assets.map(a => a.id === asset.id ? asset : a),
        updatedAt: new Date().toISOString(),
      }));
    } else {
      // Add new asset
      setPortfolio(prev => ({
        ...prev,
        assets: [...prev.assets, asset],
        updatedAt: new Date().toISOString(),
      }));
    }
    setIsFormOpen(false);
    setEditingAsset(undefined);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingAsset(undefined);
  };

  const handleLoadDemoData = () => {
    if (confirm('This will replace your current portfolio with demo data. Continue?')) {
      const { portfolio: demoPortfolio } = loadDemoData();
      setPortfolio(demoPortfolio);
    }
  };

  const calculateAssetValue = (asset: Asset) => {
    const currentPrice = asset.currentPrice || asset.purchasePrice;
    return asset.quantity * currentPrice;
  };

  const calculateAssetGainLoss = (asset: Asset) => {
    const currentPrice = asset.currentPrice || asset.purchasePrice;
    const cost = asset.quantity * asset.purchasePrice;
    const value = asset.quantity * currentPrice;
    return value - cost;
  };

  const calculateAssetGainLossPercent = (asset: Asset) => {
    const currentPrice = asset.currentPrice || asset.purchasePrice;
    const cost = asset.quantity * asset.purchasePrice;
    const value = asset.quantity * currentPrice;
    return cost > 0 ? ((value - cost) / cost) * 100 : 0;
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gradient">Portfolio</h1>
          </div>
          <p className="text-gray-600">Manage your investment assets and prepare for analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalValue)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalCost)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-lg ${summary.totalGainLoss >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <TrendingUp className={`h-6 w-6 ${summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Gain/Loss</p>
                  <p className={`text-2xl font-bold ${summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {summary.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(summary.totalGainLoss)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-lg ${summary.totalGainLossPercent >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <TrendingUp className={`h-6 w-6 ${summary.totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Gain/Loss %</p>
                  <p className={`text-2xl font-bold ${summary.totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {summary.totalGainLossPercent >= 0 ? '+' : ''}{formatPercentage(summary.totalGainLossPercent)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Assets</h3>
                  <button onClick={handleAddAsset} className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Asset
                  </button>
                </div>
              </div>
              <div className="card-body">
                {portfolio.assets.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No assets yet</h3>
                    <p className="text-gray-500 mb-6">Start building your portfolio by adding your first investment.</p>
                    <div className="space-x-4">
                      <button onClick={handleAddAsset} className="btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Asset
                      </button>
                      <button onClick={handleLoadDemoData} className="btn-secondary">
                        Load Demo Data
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <table className="table">
                      <thead className="table-header">
                        <tr>
                          <th className="table-header-cell">Asset</th>
                          <th className="table-header-cell">Type</th>
                          <th className="table-header-cell">Quantity</th>
                          <th className="table-header-cell">Value</th>
                          <th className="table-header-cell">Gain/Loss</th>
                          <th className="table-header-cell text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="table-body">
                        {portfolio.assets.map((asset) => {
                          const gainLoss = calculateAssetGainLoss(asset);
                          const value = calculateAssetValue(asset);
                          return (
                            <tr key={asset.id} className="table-row">
                              <td className="table-cell">
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{asset.ticker}</div>
                                  <div className="text-sm text-gray-500">{asset.name}</div>
                                </div>
                              </td>
                              <td className="table-cell">
                                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {getAssetTypeLabel(asset.type)}
                                </span>
                              </td>
                              <td className="table-cell text-sm text-gray-900">{asset.quantity}</td>
                              <td className="table-cell text-sm font-medium text-gray-900">{formatCurrency(value)}</td>
                              <td className="table-cell">
                                <div className="text-sm">
                                  <div className={`font-semibold ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss)}
                                  </div>
                                  <div className={`text-gray-500 ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    ({gainLoss >= 0 ? '+' : ''}{formatPercentage(calculateAssetGainLossPercent(asset))})
                                  </div>
                                </div>
                              </td>
                              <td className="table-cell text-right">
                                <div className="flex justify-end space-x-2">
                                  <button onClick={() => handleEditAsset(asset)} className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteAsset(asset.id)} className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <PortfolioChart summary={summary} />
          </div>
        </div>
      </div>

      {isFormOpen && (
        <AssetForm
          asset={editingAsset}
          onSave={handleSaveAsset}
          onCancel={handleCancelForm}
          isOpen={isFormOpen}
        />
      )}
    </Layout>
  );
}
