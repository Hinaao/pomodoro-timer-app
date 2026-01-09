'use client';

import { useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

export function SettingsForm() {
  const { settings, updateSettings } = useSettingsStore();

  const [pomodoroDuration, setPomodoroDuration] = useState(settings.pomodoroDuration);
  const [shortBreakDuration, setShortBreakDuration] = useState(settings.shortBreakDuration);
  const [notificationEnabled, setNotificationEnabled] = useState(settings.notificationEnabled);
  const [linearApiToken, setLinearApiToken] = useState(settings.linearApiToken);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings({
      pomodoroDuration,
      shortBreakDuration,
      notificationEnabled,
      linearApiToken,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">設定</h2>

      <div className="space-y-6">
        {/* ポモドーロ時間 */}
        <div>
          <label className="block text-sm font-medium mb-2">ポモドーロ時間（分）</label>
          <input
            type="number"
            min="1"
            max="60"
            value={pomodoroDuration}
            onChange={(e) => setPomodoroDuration(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 短休憩時間 */}
        <div>
          <label className="block text-sm font-medium mb-2">短休憩時間（分）</label>
          <input
            type="number"
            min="1"
            max="30"
            value={shortBreakDuration}
            onChange={(e) => setShortBreakDuration(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 通知設定 */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="notification"
            checked={notificationEnabled}
            onChange={(e) => setNotificationEnabled(e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor="notification" className="text-sm font-medium">
            通知を有効にする
          </label>
        </div>

        {/* Linear APIトークン */}
        <div>
          <label className="block text-sm font-medium mb-2">Linear APIトークン</label>
          <input
            type="password"
            value={linearApiToken}
            onChange={(e) => setLinearApiToken(e.target.value)}
            placeholder="lin_api_..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            LinearのSettings → API → Personal API keysから取得できます
          </p>
        </div>

        {/* 保存ボタン */}
        <div className="flex gap-4 items-center">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            保存
          </button>

          {saved && <span className="text-green-600 font-semibold">保存しました！</span>}
        </div>
      </div>
    </div>
  );
}
