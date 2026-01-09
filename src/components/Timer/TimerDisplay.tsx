'use client';

import { useTimerStore } from '@/store/timerStore';

export function TimerDisplay() {
  const { timeRemaining, mode, currentTaskTitle } = useTimerStore();

  // 秒を MM:SS 形式に変換
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // モードの日本語表示
  const modeText = mode === 'work' ? '作業中' : '休憩中';
  const modeColor = mode === 'work' ? 'text-red-600' : 'text-green-600';

  return (
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <div className={`text-2xl font-bold mb-4 ${modeColor}`}>{modeText}</div>

      <div className="text-7xl font-mono font-bold mb-4">{timeString}</div>

      {currentTaskTitle && (
        <div className="text-lg text-gray-600 mt-4">
          タスク: <span className="font-semibold">{currentTaskTitle}</span>
        </div>
      )}
    </div>
  );
}
