'use client';

import { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { Asset } from '@/types/portfolio';
import { validateAsset, generateAssetId } from '@/lib/portfolio-utils';

interface AssetFormProps {
  asset?: Asset;
  onSave: (asset: Asset) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const assetTypes = [
  { value: 'stock', label: 'Stock' },
  { value: 'etf', label: 'ETF' },
  { value: 'bond', label: 'Bond' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'other', label: 'Other' },
];

export default function AssetForm({ asset, onSave, onCancel, isOpen }: AssetFormProps) {
  const [formData, setFormData] = useState<Partial<Asset>>({
    ticker: '',
    name: '',
    type: 'stock',
    quantity: 0,
    purchasePrice: 0,
    currentPrice: 0,
    notes: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (asset) {
      setFormData(asset);
    } else {
      setFormData({
        ticker: '',
        name: '',
        type: 'stock',
        quantity: 0,
        purchasePrice: 0,
        currentPrice: 0,
        notes: '',
      });
    }
    setErrors([]);
  }, [asset, isOpen]);

  const handleInputChange = (field: keyof Asset, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateAsset(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const assetToSave: Asset = {
      id: asset?.id || generateAssetId(),
      ticker: formData.ticker!,
      name: formData.name!,
      type: formData.type!,
      quantity: formData.quantity!,
      purchasePrice: formData.purchasePrice!,
      currentPrice: formData.currentPrice || formData.purchasePrice,
      notes: formData.notes,
      purchaseDate: formData.purchaseDate || new Date().toISOString().split('T')[0],
    };

    onSave(assetToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 modal-backdrop overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-96 shadow-strong rounded-xl bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {asset ? 'Edit Asset' : 'Add Asset'}
            </h3>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label className="form-label">
                Ticker *
              </label>
              <input
                type="text"
                value={formData.ticker || ''}
                onChange={(e) => handleInputChange('ticker', e.target.value.toUpperCase())}
                className="form-input"
                placeholder="AAPL"
              />
            </div>

            <div>
              <label className="form-label">
                Asset Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="form-input"
                placeholder="Apple Inc."
              />
            </div>

            <div>
              <label className="form-label">
                Asset Type *
              </label>
              <select
                value={formData.type || 'stock'}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="form-input"
              >
                {assetTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Quantity *
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.quantity || ''}
                  onChange={(e) => handleInputChange('quantity', parseFloat(e.target.value) || 0)}
                  className="form-input"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="form-label">
                  Purchase Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice || ''}
                  onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
                  className="form-input"
                  placeholder="150.00"
                />
              </div>
            </div>

            <div>
              <label className="form-label">
                Current Price (optional)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.currentPrice || ''}
                onChange={(e) => handleInputChange('currentPrice', parseFloat(e.target.value) || 0)}
                className="form-input"
                placeholder="160.00"
              />
            </div>

            <div>
              <label className="form-label">
                Purchase Date (optional)
              </label>
              <input
                type="date"
                value={formData.purchaseDate || ''}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                Notes (optional)
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="form-input resize-none"
                placeholder="Investment thesis, research notes..."
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                {asset ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Asset
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 