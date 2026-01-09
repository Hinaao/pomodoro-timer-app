import { create } from 'zustand';
import { TimerState, Settings } from '@/types';
import { saveSession } from '@/lib/localStorage';
import { v4 as uuidv4 } from 'uuid';

export const useTimerStore = create<TimerState>((set, get) => ({
  timeRemaining: 25 * 60, // 秒単位（デフォルト25分）
  mode: 'work',
  isRunning: false,
  isPaused: false,
  currentTaskId: null,
  currentTaskTitle: null,
  sessionStartTime: null,
  pomodoroCount: 0,

  // タイマー開始
  startTimer: () => {
    const state = get();
    if (!state.isRunning) {
      set({
        isRunning: true,
        isPaused: false,
        sessionStartTime: new Date(),
      });
    } else if (state.isPaused) {
      set({
        isPaused: false,
      });
    }
  },

  // タイマー一時停止
  pauseTimer: () => {
    set({ isPaused: true });
  },

  // タイマーリセット
  resetTimer: () => {
    const state = get();
    const settings = state.mode === 'work' ? { pomodoroDuration: state.timeRemaining / 60 } : { shortBreakDuration: state.timeRemaining / 60 };

    set({
      isRunning: false,
      isPaused: false,
      sessionStartTime: null,
    });

    // 設定から時間を再読み込み
    get().initializeFromSettings(settings as Settings);
  },

  // 1秒経過
  tick: () => {
    const state = get();
    if (state.isRunning && !state.isPaused && state.timeRemaining > 0) {
      set({ timeRemaining: state.timeRemaining - 1 });

      // 0秒になったら完了処理
      if (state.timeRemaining - 1 === 0) {
        get().completeTimer();
      }
    }
  },

  // タイマー完了処理
  completeTimer: () => {
    const state = get();

    // セッションをlocalStorageに保存
    if (state.sessionStartTime && state.mode === 'work') {
      const session = {
        id: uuidv4(),
        taskId: state.currentTaskId,
        taskTitle: state.currentTaskTitle,
        startedAt: state.sessionStartTime.toISOString(),
        completedAt: new Date().toISOString(),
        duration: state.mode === 'work' ? Math.floor((Date.now() - state.sessionStartTime.getTime()) / 60000) : 0,
        interrupted: false,
        mode: state.mode,
      };

      saveSession(session);
    }

    // work完了後はshort-breakに自動切り替え
    if (state.mode === 'work') {
      set((state) => ({
        mode: 'short-break',
        isRunning: false,
        isPaused: false,
        sessionStartTime: null,
        pomodoroCount: state.pomodoroCount + 1,
      }));
    } else {
      // 休憩完了後はworkに戻る
      set({
        mode: 'work',
        isRunning: false,
        isPaused: false,
        sessionStartTime: null,
      });
    }

    // 通知を表示（ブラウザが対応している場合）
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const title = state.mode === 'work' ? 'ポモドーロ完了！' : '休憩終了！';
      const body = state.mode === 'work' ? '休憩時間です。' : '作業を再開しましょう。';

      new Notification(title, {
        body,
        icon: '/icons/icon-192x192.png',
      });
    }
  },

  // タスクを選択
  setCurrentTask: (taskId, taskTitle) => {
    set({ currentTaskId: taskId, currentTaskTitle: taskTitle });
  },

  // モード切り替え（work ↔ short-break）
  switchMode: () => {
    const state = get();
    const newMode = state.mode === 'work' ? 'short-break' : 'work';

    set({
      mode: newMode,
      isRunning: false,
      isPaused: false,
      sessionStartTime: null,
    });
  },

  // 設定から初期化
  initializeFromSettings: (settings: Settings) => {
    const state = get();
    const duration = state.mode === 'work' ? settings.pomodoroDuration : settings.shortBreakDuration;

    set({
      timeRemaining: duration * 60,
    });
  },
}));
