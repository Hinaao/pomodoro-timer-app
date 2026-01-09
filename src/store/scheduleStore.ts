import { create } from "zustand";
import { ScheduleState, Schedule, ScheduledTask } from "@/types";
import {
  getSchedules,
  saveSchedules,
  upsertSchedule,
  deleteSchedule as deleteScheduleFromStorage,
} from "@/lib/localStorage";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  schedules: [],
  selectedDate: format(new Date(), "yyyy-MM-dd"), // 初期値は今日
  isLoading: false,
  error: null,

  // スケジュール一覧をlocalStorageから読み込み
  loadSchedules: () => {
    const schedules = getSchedules();
    set({ schedules });
  },

  // 特定日付のスケジュールを取得
  getScheduleByDate: (date) => {
    const { schedules } = get();
    return schedules.find((schedule) => schedule.date === date);
  },

  // タスクをスケジュールに追加
  addTaskToSchedule: (date, task) => {
    const { schedules } = get();
    const existingSchedule = schedules.find((s) => s.date === date);

    if (existingSchedule) {
      // 重複チェック
      const isDuplicate = existingSchedule.tasks.some(
        (t) => t.linearIssueId === task.linearIssueId
      );

      if (isDuplicate) {
        set({ error: "このタスクは既にスケジュールに追加されています" });
        return;
      }

      // 既存のスケジュールにタスクを追加
      const updatedSchedule: Schedule = {
        ...existingSchedule,
        tasks: [
          ...existingSchedule.tasks,
          { ...task, completedPomodoros: 0 },
        ],
      };

      const updatedSchedules = schedules.map((s) =>
        s.date === date ? updatedSchedule : s
      );

      set({ schedules: updatedSchedules });
      upsertSchedule(updatedSchedule);
    } else {
      // 新しいスケジュールを作成
      const newSchedule: Schedule = {
        id: uuidv4(),
        date,
        tasks: [{ ...task, completedPomodoros: 0 }],
      };

      const updatedSchedules = [...schedules, newSchedule];
      set({ schedules: updatedSchedules });
      upsertSchedule(newSchedule);
    }
  },

  // タスクをスケジュールから削除
  removeTaskFromSchedule: (date, linearIssueId) => {
    const { schedules } = get();
    const existingSchedule = schedules.find((s) => s.date === date);

    if (!existingSchedule) return;

    const updatedTasks = existingSchedule.tasks.filter(
      (t) => t.linearIssueId !== linearIssueId
    );

    if (updatedTasks.length === 0) {
      // タスクがなくなったらスケジュール自体を削除
      const updatedSchedules = schedules.filter((s) => s.date !== date);
      set({ schedules: updatedSchedules });
      deleteScheduleFromStorage(date);
    } else {
      // タスクのみ削除
      const updatedSchedule: Schedule = {
        ...existingSchedule,
        tasks: updatedTasks,
      };

      const updatedSchedules = schedules.map((s) =>
        s.date === date ? updatedSchedule : s
      );

      set({ schedules: updatedSchedules });
      upsertSchedule(updatedSchedule);
    }
  },

  // スケジュールされたタスクを更新
  updateScheduledTask: (date, linearIssueId, updates) => {
    const { schedules } = get();
    const existingSchedule = schedules.find((s) => s.date === date);

    if (!existingSchedule) return;

    const updatedTasks = existingSchedule.tasks.map((t) =>
      t.linearIssueId === linearIssueId ? { ...t, ...updates } : t
    );

    const updatedSchedule: Schedule = {
      ...existingSchedule,
      tasks: updatedTasks,
    };

    const updatedSchedules = schedules.map((s) =>
      s.date === date ? updatedSchedule : s
    );

    set({ schedules: updatedSchedules });
    upsertSchedule(updatedSchedule);
  },

  // 完了ポモドーロ数を更新
  updateCompletedPomodoros: (date, linearIssueId, count) => {
    const { schedules } = get();
    const existingSchedule = schedules.find((s) => s.date === date);

    if (!existingSchedule) return;

    const updatedTasks = existingSchedule.tasks.map((t) =>
      t.linearIssueId === linearIssueId
        ? { ...t, completedPomodoros: count }
        : t
    );

    const updatedSchedule: Schedule = {
      ...existingSchedule,
      tasks: updatedTasks,
    };

    const updatedSchedules = schedules.map((s) =>
      s.date === date ? updatedSchedule : s
    );

    set({ schedules: updatedSchedules });
    upsertSchedule(updatedSchedule);
  },

  // 選択日付を設定
  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },

  // スケジュールを削除
  deleteSchedule: (date) => {
    const { schedules } = get();
    const updatedSchedules = schedules.filter((s) => s.date !== date);
    set({ schedules: updatedSchedules });
    deleteScheduleFromStorage(date);
  },

  // エラーを設定
  setError: (error) => {
    set({ error });
  },

  // エラーをクリア
  clearError: () => {
    set({ error: null });
  },
}));
