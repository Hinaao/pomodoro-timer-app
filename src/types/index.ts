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

// タスクソース（どこから来たタスクか）
export type TaskSource = 'linear' | 'local';

// Linearタスク
export interface LinearTask {
  id: string;
  title: string;
  description: string;
  priority: number; // 0-4（Linearの優先度）
  state: string; // "Todo", "In Progress", etc.
  dueDate: string | null; // ISO 8601形式
}

// ローカルタスク（アプリ内で作成）
export interface LocalTask {
  id: string; // UUID
  title: string;
  description: string;
  priority: number; // 0-4（低=0, 高=4）
  state: string; // "Todo", "In Progress", "Done"
  dueDate: string | null; // ISO 8601形式
  createdAt: string; // ISO 8601形式
}

// 統合タスク型（LinearとLocalの両方を扱える）
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: number;
  state: string;
  dueDate: string | null;
  source: TaskSource; // どこから来たタスクか
  createdAt?: string; // ローカルタスクのみ
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
  tasks: Task[]; // 統合タスク型を使用
  selectedTaskId: string | null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: Date | null;

  // アクション
  setTasks: (tasks: Task[]) => void;
  addLocalTask: (task: Omit<LocalTask, 'id' | 'createdAt'>) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  selectTask: (taskId: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  loadLocalTasks: () => void;
}

// スケジュールされたタスク
export interface ScheduledTask {
  linearIssueId: string; // Taskのid（既存タスクへの参照）
  taskTitle: string; // タスク名（スナップショット）
  estimatedPomodoros: number; // 見積もりポモドーロ数
  completedPomodoros: number; // 完了したポモドーロ数
  notes?: string; // メモ（オプション）
}

// 日付別スケジュール
export interface Schedule {
  id: string; // UUID
  date: string; // YYYY-MM-DD形式
  tasks: ScheduledTask[]; // その日に割り当てられたタスク一覧
}

// スケジュール状態（Zustandストア用）
export interface ScheduleState {
  schedules: Schedule[];
  selectedDate: string | null;
  isLoading: boolean;
  error: string | null;

  // アクション
  loadSchedules: () => void;
  getScheduleByDate: (date: string) => Schedule | undefined;
  addTaskToSchedule: (
    date: string,
    task: Omit<ScheduledTask, 'completedPomodoros'>
  ) => void;
  removeTaskFromSchedule: (date: string, linearIssueId: string) => void;
  updateScheduledTask: (
    date: string,
    linearIssueId: string,
    updates: Partial<ScheduledTask>
  ) => void;
  updateCompletedPomodoros: (
    date: string,
    linearIssueId: string,
    count: number
  ) => void;
  setSelectedDate: (date: string | null) => void;
  deleteSchedule: (date: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}
