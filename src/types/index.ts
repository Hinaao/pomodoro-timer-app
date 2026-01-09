// タイマーモード
export type TimerMode = 'work' | 'short-break';

// 設定
export interface Settings {
  pomodoroDuration: number; // デフォルト: 25分
  shortBreakDuration: number; // デフォルト: 5分
  notificationEnabled: boolean; // デフォルト: true
  linearApiToken: string;
}

// ポモドーロセッション履歴
export interface Session {
  id: string; // UUID
  taskId: string | null; // Linear Issue ID（nullの場合は未選択）
  taskTitle: string | null;
  startedAt: string; // ISO 8601形式
  completedAt: string | null; // ISO 8601形式、中断時はnull
  duration: number; // 分単位
  interrupted: boolean; // 中断されたか
  mode: TimerMode;
}

// Linearタスク
export interface LinearTask {
  id: string;
  title: string;
  description: string;
  priority: number; // 0-4（Linearの優先度）
  state: string; // "Todo", "In Progress", etc.
  dueDate: string | null; // ISO 8601形式
}

// タイマー状態（Zustandストア用）
export interface TimerState {
  timeRemaining: number; // 残り秒数
  mode: TimerMode;
  isRunning: boolean;
  isPaused: boolean;
  currentTaskId: string | null;
  currentTaskTitle: string | null;
  sessionStartTime: Date | null;
  pomodoroCount: number; // 完了したポモドーロ数（長休憩判定用）

  // アクション
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  completeTimer: () => void;
  setCurrentTask: (taskId: string | null, taskTitle: string | null) => void;
  switchMode: () => void;
  initializeFromSettings: (settings: Settings) => void;
}

// 設定状態（Zustandストア用）
export interface SettingsState {
  settings: Settings;

  // アクション
  loadSettings: () => void;
  updateSettings: (partial: Partial<Settings>) => void;
  resetSettings: () => void;
}

// タスク状態（Zustandストア用）
export interface TaskState {
  tasks: LinearTask[];
  selectedTaskId: string | null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: Date | null;

  // アクション
  setTasks: (tasks: LinearTask[]) => void;
  selectTask: (taskId: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}
