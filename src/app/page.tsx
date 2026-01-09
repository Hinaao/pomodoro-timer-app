'use client';

import { useEffect } from 'react';
import { TimerDisplay } from '@/components/Timer/TimerDisplay';
import { TimerControls } from '@/components/Timer/TimerControls';
import { TaskList } from '@/components/TaskList/TaskList';
import { useTimer } from '@/hooks/useTimer';
import { useNotification } from '@/hooks/useNotification';
import { useSettingsStore } from '@/store/settingsStore';
import { useTimerStore } from '@/store/timerStore';

export default function Home() {
  const { loadSettings, settings } = useSettingsStore();
  const { initializeFromSettings } = useTimerStore();
  const { requestPermission } = useNotification();

  // タイマーフックを使用（カウントダウン処理）
  useTimer();

  useEffect(() => {
    // 初回マウント時に設定を読み込み
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    // 設定が読み込まれたらタイマーを初期化
    if (settings) {
      initializeFromSettings(settings);
    }
  }, [settings, initializeFromSettings]);

  useEffect(() => {
    // 通知許可をリクエスト（設定で有効な場合）
    if (settings.notificationEnabled) {
      requestPermission();
    }
  }, [settings.notificationEnabled, requestPermission]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Pomodoro Timer</h1>

        <TimerDisplay />
        <TimerControls />

        <TaskList />
      </div>
    </div>
  );
}
