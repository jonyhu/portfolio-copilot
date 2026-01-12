'use client';

import { useState, useEffect } from 'react';
import { Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import Layout from '@/components/Layout';
import { Portfolio } from '@/types/portfolio';
import { loadPortfolio, clearPortfolio } from '@/lib/portfolio-storage';
import { clearMacroViews } from '@/lib/macro-views-storage';

export default function SettingsPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  useEffect(() => {
    const savedPortfolio = loadPortfolio();
    if (savedPortfolio) {
      setPortfolio(savedPortfolio);
    }
  }, []);

  const exportPortfolio = () => {
    if (!portfolio) return;

    const dataStr = JSON.stringify(portfolio, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importPortfolio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedPortfolio = JSON.parse(e.target?.result as string);
        localStorage.setItem('portfolio', JSON.stringify(importedPortfolio));
        setPortfolio(importedPortfolio);
        alert('Portfolio imported successfully!');
      } catch {
        alert('Error importing portfolio. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  const clearPortfolioData = () => {
    if (confirm('Are you sure you want to clear all portfolio data? This action cannot be undone.')) {
      clearPortfolio();
      setPortfolio(null);
      alert('Portfolio data cleared successfully!');
    }
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear ALL data? This will remove your portfolio and macro views. This action cannot be undone.')) {
      clearPortfolio();
      clearMacroViews();
      setPortfolio(null);
      alert('All data cleared successfully!');
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gradient">Settings</h1>
          <p className="text-gray-600">Manage your portfolio data and application settings</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Portfolio Management */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Portfolio Management</h3>
              <p className="text-sm text-gray-600">Export, import, or clear your portfolio data</p>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {/* Export Portfolio */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Export Portfolio</h4>
                    <p className="text-sm text-gray-500">
                      Download your portfolio data as a JSON file
                    </p>
                  </div>
                  <button
                    onClick={exportPortfolio}
                    disabled={!portfolio}
                    className="btn-primary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                </div>

                {/* Import Portfolio */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Import Portfolio</h4>
                    <p className="text-sm text-gray-500">
                      Import portfolio data from a JSON file
                    </p>
                  </div>
                  <label className="btn-secondary cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={importPortfolio}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Clear Portfolio */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Clear Portfolio</h4>
                    <p className="text-sm text-gray-500">
                      Remove all portfolio data (cannot be undone)
                    </p>
                  </div>
                  <button
                    onClick={clearPortfolioData}
                    disabled={!portfolio}
                    className="btn-danger"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Application Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Application Information</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Version:</span>
                  <span className="text-sm font-medium text-gray-900">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Framework:</span>
                  <span className="text-sm font-medium text-gray-900">Next.js 14</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">AI Model:</span>
                  <span className="text-sm font-medium text-gray-900">OpenAI GPT-4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Data Storage:</span>
                  <span className="text-sm font-medium text-gray-900">Local Storage</span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Data Privacy</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Your portfolio data is stored locally in your browser. When using AI analysis, your portfolio data and macro views are sent to our servers for processing.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">AI Analysis</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      AI analysis uses a server-side OpenAI key and is rate-limited to control usage and costs. We do not store your portfolio data after processing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clear All Data */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Clear All Data</h3>
            </div>
            <div className="card-body">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <h4 className="text-sm font-medium text-red-900">Clear All Data</h4>
                  <p className="text-sm text-red-700">
                    Remove all portfolio data and macro views (cannot be undone)
                  </p>
                </div>
                <button
                  onClick={clearAllData}
                  className="btn-danger"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 
