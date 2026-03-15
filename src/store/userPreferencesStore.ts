import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeKey } from '../theme/themes';

export interface NotificationPreferences {
  bible: { enabled: boolean; times: string[]; days: number[] };
  stoic: { enabled: boolean; times: string[]; days: number[] };
  prayer: { enabled: boolean; times: string[]; days: number[] };
  torah: { enabled: boolean; times: string[]; days: number[] };
  novena: { enabled: boolean };
}

export interface UserPreferences {
  tradition: 'catholic' | 'universal';
  rosaryMystery: 'auto' | 'manual';
  bibleVersion: 'RVR1960' | 'NVI';
  theme: ThemeKey;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  language: 'es' | 'en';
  enabledModules: {
    catholic: boolean;
    rosary: boolean;
    bible: boolean;
    stoic: boolean;
    torah: boolean;
  };
  notifications: NotificationPreferences;
  onboardingComplete: boolean;
}

const defaultPreferences: UserPreferences = {
  tradition: 'catholic',
  rosaryMystery: 'auto',
  bibleVersion: 'RVR1960',
  theme: 'light',
  fontSize: 'medium',
  language: 'es',
  enabledModules: {
    catholic: true,
    rosary: true,
    bible: true,
    stoic: true,
    torah: true,
  },
  notifications: {
    bible: { enabled: true, times: ['06:00'], days: [0, 1, 2, 3, 4, 5, 6] },
    stoic: { enabled: true, times: ['07:00'], days: [0, 1, 2, 3, 4, 5, 6] },
    prayer: { enabled: true, times: ['06:00', '12:00', '18:00'], days: [0, 1, 2, 3, 4, 5, 6] },
    torah: { enabled: true, times: ['12:15'], days: [5, 6] },
    novena: { enabled: true },
  },
  onboardingComplete: false,
};

const STORAGE_KEY = '@anima_mundi_preferences';

interface PreferencesStore {
  preferences: UserPreferences;
  isLoaded: boolean;
  loadPreferences: () => Promise<void>;
  updatePreferences: (partial: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
}

export const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  preferences: defaultPreferences,
  isLoaded: false,

  loadPreferences: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<UserPreferences>;
        set({ preferences: { ...defaultPreferences, ...parsed }, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  updatePreferences: async (partial) => {
    const updated = { ...get().preferences, ...partial };
    set({ preferences: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  resetPreferences: async () => {
    set({ preferences: defaultPreferences });
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
}));
