import { create } from "zustand";
import { TaskState, Task, LocalTask } from "@/types";
import {
  getLocalTasks,
  addLocalTask as saveLocalTask,
  deleteLocalTask,
  updateLocalTask,
} from "@/lib/localStorage";
import { v4 as uuidv4 } from "uuid";

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTaskId: null,
  isLoading: false,
  error: null,
  lastFetchedAt: null,

  // タスク一覧を設定（Linearタスク）
  setTasks: (tasks) => {
    // 既存のローカルタスクと結合
    const localTasks = getLocalTasks();
    const localTasksAsTask: Task[] = localTasks.map((task) => ({
      ...task,
      source: "local" as const,
    }));

    const allTasks = [...tasks, ...localTasksAsTask];
    set({ tasks: allTasks, lastFetchedAt: new Date() });
  },

  // ローカルタスクを追加
  addLocalTask: (taskData) => {
    const newTask: LocalTask = {
      id: uuidv4(),
      ...taskData,
      createdAt: new Date().toISOString(),
    };

    saveLocalTask(newTask);

    // ストアのタスク一覧に追加
    const taskAsTask: Task = {
      ...newTask,
      source: "local",
    };

    set((state) => ({
      tasks: [...state.tasks, taskAsTask],
    }));
  },

  // タスクを削除
  deleteTask: (taskId) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (task?.source === "local") {
      deleteLocalTask(taskId);
    }

    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
      selectedTaskId:
        state.selectedTaskId === taskId ? null : state.selectedTaskId,
    }));
  },

  // タスクを更新
  updateTask: (taskId, updates) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (task?.source === "local") {
      updateLocalTask(taskId, updates);
    }

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updates } : t
      ),
    }));
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

  // ローカルタスクを読み込み（既存のLinearタスクを保持）
  loadLocalTasks: () => {
    const localTasks = getLocalTasks();
    const localTasksAsTask: Task[] = localTasks.map((task) => ({
      ...task,
      source: "local" as const,
    }));

    set((state) => {
      // 既存のLinearタスクを保持
      const linearTasks = state.tasks.filter((t) => t.source === "linear");
      return { tasks: [...linearTasks, ...localTasksAsTask] };
    });
  },
}));
