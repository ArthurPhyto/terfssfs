import React, { useState } from 'react';
import { RandomURL } from '../types';
import { Link2, Trash2, Edit2, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from './common/Button';
import { EditURLDialog } from './EditURLDialog';
import { getRedirectUrl } from '../utils/url';
import { copyToClipboard } from '../utils/clipboard';

interface URLTableProps {
  urls: RandomURL[];
  onDelete: (id: string) => void;
}

export const URLTable = ({ urls, onDelete }: URLTableProps) => {
  const [editingUrl, setEditingUrl] = useState<RandomURL | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyUrl = async (url: RandomURL) => {
    const fullUrl = getRedirectUrl(url.path);
    const success = await copyToClipboard(fullUrl);
    if (success) {
      setCopiedId(url.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Rest of the component remains the same */}
      </div>

      {editingUrl && (
        <EditURLDialog
          url={editingUrl}
          isOpen={!!editingUrl}
          onClose={() => setEditingUrl(null)}
        />
      )}
    </>
  );
};