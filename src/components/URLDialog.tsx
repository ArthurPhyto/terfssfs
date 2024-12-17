import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from './common/Button';
import { validateUrl, generateRandomPath } from '../utils/url';

interface URLDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (path: string, targets: { url: string; percentage: number }[]) => void;
}

export const URLDialog: React.FC<URLDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [path, setPath] = useState(generateRandomPath());
  const [targets, setTargets] = useState([{ url: '', percentage: 100 }]);

  if (!isOpen) return null;

  const addTarget = () => {
    if (targets.length >= 5) return;
    const currentTotal = targets.reduce((sum, t) => sum + t.percentage, 0);
    const remaining = Math.max(0, 100 - currentTotal);
    setTargets([...targets, { url: '', percentage: remaining }]);
  };

  const removeTarget = (index: number) => {
    if (targets.length <= 1) return;
    const newTargets = targets.filter((_, i) => i !== index);
    const total = newTargets.reduce((sum, t) => sum + t.percentage, 0);
    if (total < 100) {
      newTargets[0].percentage += (100 - total);
    }
    setTargets(newTargets);
  };

  const updateTarget = (index: number, field: 'url' | 'percentage', value: string | number) => {
    const newTargets = [...targets];
    newTargets[index] = { ...newTargets[index], [field]: value };
    setTargets(newTargets);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = targets.every(t => validateUrl(t.url));
    const totalPercentage = targets.reduce((sum, t) => sum + t.percentage, 0);
    
    if (isValid && totalPercentage === 100) {
      onSubmit(path, targets);
      setPath(generateRandomPath());
      setTargets([{ url: '', percentage: 100 }]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">New Random URL</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Random Path
            </label>
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter custom path or use generated one"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">Target URLs</h3>
              <Button
                type="button"
                onClick={addTarget}
                disabled={targets.length >= 5}
                size="sm"
              >
                <Plus size={16} className="mr-1" />
                Add Target
              </Button>
            </div>
            
            {targets.map((target, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="url"
                    value={target.url}
                    onChange={(e) => updateTarget(index, 'url', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    value={target.percentage}
                    onChange={(e) => updateTarget(index, 'percentage', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                    max="100"
                    required
                  />
                </div>
                {targets.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeTarget(index)}
                  >
                    <Minus size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create URL
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};