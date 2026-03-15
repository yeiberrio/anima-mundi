import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import novenasData from '../data/novenas.json';

interface NovenaProgress {
  novenaId: string;
  currentDay: number;
  startDate: string;
  completedDays: number[];
}

const STORAGE_KEY = '@anima_mundi_novena_progress';

export function useNovena(novenaId?: string) {
  const [progress, setProgress] = useState<NovenaProgress | null>(null);
  const [allProgress, setAllProgress] = useState<Record<string, NovenaProgress>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const novena = novenaId ? novenasData.find((n) => n.id === novenaId) : null;

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as Record<string, NovenaProgress>;
        setAllProgress(data);
        if (novenaId && data[novenaId]) {
          setProgress(data[novenaId]);
        }
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  };

  const startNovena = useCallback(
    async (id: string) => {
      const newProgress: NovenaProgress = {
        novenaId: id,
        currentDay: 1,
        startDate: new Date().toISOString(),
        completedDays: [],
      };
      const updated = { ...allProgress, [id]: newProgress };
      setAllProgress(updated);
      if (id === novenaId) setProgress(newProgress);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [allProgress, novenaId]
  );

  const completeDay = useCallback(
    async (day: number) => {
      if (!novenaId || !progress) return;
      const updatedProgress: NovenaProgress = {
        ...progress,
        completedDays: [...new Set([...progress.completedDays, day])],
        currentDay: Math.min(day + 1, 9),
      };
      const updated = { ...allProgress, [novenaId]: updatedProgress };
      setAllProgress(updated);
      setProgress(updatedProgress);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [novenaId, progress, allProgress]
  );

  const resetNovena = useCallback(
    async (id: string) => {
      const updated = { ...allProgress };
      delete updated[id];
      setAllProgress(updated);
      if (id === novenaId) setProgress(null);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [allProgress, novenaId]
  );

  const getActiveNovenas = useCallback(() => {
    return Object.values(allProgress).filter((p) => p.completedDays.length < 9);
  }, [allProgress]);

  return {
    novena,
    progress,
    allProgress,
    isLoaded,
    startNovena,
    completeDay,
    resetNovena,
    getActiveNovenas,
    novenasList: novenasData,
  };
}
