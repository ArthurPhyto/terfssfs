import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { URLTable } from './URLTable';
import { URLDialog } from './URLDialog';
import { useStore } from '../store/useStore';
import { useProjectUrls } from '../hooks/useProjectUrls';
import { createRandomUrl, deleteUrl } from '../services/database';
import { LoadingSpinner } from './common/LoadingSpinner';

export function ProjectContent() {
  const { currentProject } = useStore();
  const { urls: randomUrls, setUrls: setRandomUrls, isLoading } = useProjectUrls(currentProject?.id);
  const [isURLDialogOpen, setIsURLDialogOpen] = useState(false);

  const handleCreateUrl = async (path: string, targets: { url: string; percentage: number }[]) => {
    if (!currentProject) return;
    
    try {
      const newUrl = await createRandomUrl(currentProject.id, path, targets);
      setRandomUrls(prevUrls => [...prevUrls, newUrl]);
    } catch (error) {
      console.error('Error creating URL:', error);
    }
  };

  const handleDeleteUrl = async (id: string) => {
    try {
      await deleteUrl(id);
      setRandomUrls(prevUrls => prevUrls.filter(url => url.id !== id));
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">
          Select a project to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {currentProject.name}
        </h1>
        <button 
          className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-700"
          onClick={() => setIsURLDialogOpen(true)}
        >
          <Plus size={20} />
          <span>New URL</span>
        </button>
      </div>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <URLTable urls={randomUrls} onDelete={handleDeleteUrl} />
      )}
      
      <URLDialog
        isOpen={isURLDialogOpen}
        onClose={() => setIsURLDialogOpen(false)}
        onSubmit={handleCreateUrl}
      />
    </>
  );
}