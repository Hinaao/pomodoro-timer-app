import { create } from 'zustand';
import { TaskState } from '@/types';

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  selectedTaskId: null,
  isLoading: false,
  error: null,
  lastFetchedAt: null,

  // タスク一覧を設定
  setTasks: (tasks) => {
    set({ tasks, lastFetchedAt: new Date() });
  },

  // タスクを選択
  selectTask: (taskId) => {
    set({ selectedTaskId: taskId });
  },

  // ローディング状態を設定
  setLoading: (isLoading) => {
    set({ isLoading });
  },

  // エラーを設定
  setError: (error) => {
    set({ error, isLoading: false });
  },

  // エラーをクリア
  clearError: () => {
    set({ error: null });
  },
}));
