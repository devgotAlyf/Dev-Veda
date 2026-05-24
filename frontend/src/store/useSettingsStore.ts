import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  defaultGradeLevel: string;
  defaultDifficulty: string;
  promptTone: string;
  setSettings: (settings: Partial<Omit<SettingsState, 'setSettings'>>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      defaultGradeLevel: '',
      defaultDifficulty: '',
      promptTone: 'Neutral',
      setSettings: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    {
      name: 'vedaai-settings',
    }
  )
);
