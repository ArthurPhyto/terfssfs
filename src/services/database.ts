import { db } from './firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { Project, RandomURL, TargetURL } from '../types';

const COLLECTIONS = {
  PROJECTS: 'projects',
  URLS: 'urls',
} as const;

export const createProject = async (name: string): Promise<void> => {
  const projectData = {
    name,
    createdAt: serverTimestamp(),
  };
  
  await addDoc(collection(db, COLLECTIONS.PROJECTS), projectData);
};

export const createRandomUrl = async (
  projectId: string,
  path: string,
  targets: Omit<TargetURL, 'id'>[]
): Promise<void> => {
  const urlData = {
    projectId,
    path,
    targets: targets.map((target, index) => ({ ...target, id: `target-${index}` })),
    createdAt: serverTimestamp(),
  };
  
  await addDoc(collection(db, COLLECTIONS.URLS), urlData);
};

export const updateUrlTargets = async (
  urlId: string,
  targets: TargetURL[]
): Promise<void> => {
  const urlRef = doc(db, COLLECTIONS.URLS, urlId);
  await updateDoc(urlRef, { targets });
};

export const deleteUrl = async (urlId: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.URLS, urlId));
};