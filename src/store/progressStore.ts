import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProgressEntry {
  type: 'rosary' | 'novena' | 'bible_reading' | 'torah_study' | 'stoic_exercise';
  referenceId?: string;
  completedAt: string;
  notes?: string;
}

interface ProgressStore {
  entries: ProgressEntry[];
  streak: number;
  lastStreakDate: string | null;
  isLoaded: boolean;
  loadProgress: () => Promise<void>;
  addEntry: (entry: Omit<ProgressEntry, 'completedAt'>) => Promise<void>;
  getEntriesByType: (type: ProgressEntry['type']) => ProgressEntry[];
  getRosaryCount: () => number;
}

const STORAGE_KEY = '@anima_mundi_progress';

export const useProgressStore = create<ProgressStore>((set, get) => ({
  entries: [],
  streak: 0,
  lastStreakDate: null,
  isLoaded: false,

  loadProgress: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        set({ ...data, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  addEntry: async (entry) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const newEntry: ProgressEntry = { ...entry, completedAt: now.toISOString() };
    const state = get();
    const entries = [...state.entries, newEntry];

    let streak = state.streak;
    if (state.lastStreakDate !== today) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      streak = state.lastStreakDate === yesterdayStr ? streak + 1 : 1;
    }

    const newState = { entries, streak, lastStreakDate: today };
    set(newState);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...newState, isLoaded: true }));
  },

  getEntriesByType: (type) => get().entries.filter((e) => e.type === type),

  getRosaryCount: () => get().entries.filter((e) => e.type === 'rosary').length,
}));
