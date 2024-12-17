import React from 'react';
import { AppLayout } from './layouts/AppLayout';
import { ProjectContent } from './components/ProjectContent';

export default function App() {
  return (
    <AppLayout>
      <ProjectContent />
    </AppLayout>
  );
}