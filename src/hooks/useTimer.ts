import { useEffect, useRef } from 'react';
import { useTimerStore } from '@/store/timerStore';

/**
 * タイマーのカウントダウン処理を管理するフック
 * 1秒ごとにtick()を呼び出す
 */
export function useTimer() {
  const { isRunning, isPaused, tick } = useTimerStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      // 1秒ごとにtickを呼び出す
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      // タイマーが停止または一時停止中はintervalをクリア
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // クリーンアップ
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, tick]);
}
