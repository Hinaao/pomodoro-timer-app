'use client';

import { useTimerStore } from '@/store/timerStore';

export function TimerControls() {
  const { isRunning, isPaused, startTimer, pauseTimer, resetTimer } = useTimerStore();

  return (
    <div className="flex gap-4 justify-center mt-6">
      {!isRunning || isPaused ? (
        <button
          onClick={startTimer}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
        >
          {isPaused ? '再開' : '開始'}
        </button>
      ) : (
        <button
          onClick={pauseTimer}
          className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold"
        >
          一時停止
        </button>
      )}

      <button
        onClick={resetTimer}
        disabled={!isRunning && !isPaused}
        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        リセット
      </button>
    </div>
  );
}
