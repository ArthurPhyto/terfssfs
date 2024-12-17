import { create } from 'zustand';
import { Project, RandomURL } from '../types';

interface Store {
  projects: Project[];
  currentProject: Project | null;
  randomUrls: RandomURL[];
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setRandomUrls: (urls: RandomURL[]) => void;
}

export const useStore = create<Store>((set) => ({
  projects: [],
  currentProject: null,
  randomUrls: [],
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setRandomUrls: (urls) => set({ randomUrls: urls }),
}));