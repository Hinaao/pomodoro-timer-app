import { create } from 'zustand';
import { SettingsState } from '@/types';
import { getSettings, saveSettings, DEFAULT_SETTINGS } from '@/lib/localStorage';

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: DEFAULT_SETTINGS,

  // localStorageから設定を読み込み
  loadSettings: () => {
    const settings = getSettings();
    set({ settings });
  },

  // 設定を更新し、localStorageに保存
  updateSettings: (partial) => {
    set((state) => {
      const newSettings = { ...state.settings, ...partial };
      saveSettings(newSettings);
      return { settings: newSettings };
    });
  },

  // 設定をデフォルトにリセット
  resetSettings: () => {
    saveSettings(DEFAULT_SETTINGS);
    set({ settings: DEFAULT_SETTINGS });
  },
}));
