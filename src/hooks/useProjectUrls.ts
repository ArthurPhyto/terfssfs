import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { RandomURL } from '../types';

export function useProjectUrls(projectId: string | undefined) {
  const [urls, setUrls] = useState<RandomURL[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      setUrls([]);
      setIsLoading(false);
      return;
    }

    const urlsQuery = query(
      collection(db, 'urls'),
      where('projectId', '==', projectId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(urlsQuery, (snapshot) => {
      const urlsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as RandomURL[];
      
      setUrls(urlsData);
      setIsLoading(false);
    }, (error) => {
      console.error('Error loading URLs:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [projectId]);

  return { urls, setUrls, isLoading };
}