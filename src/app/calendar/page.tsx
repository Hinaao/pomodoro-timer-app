'use client';

import { useEffect } from 'react';
import { CalendarView } from '@/components/Calendar/CalendarView';
import { DayView } from '@/components/Calendar/DayView';
import { AddTaskToScheduleForm } from '@/components/Calendar/AddTaskToScheduleForm';
import { useSchedule } from '@/hooks/useSchedule';
import { useTaskStore } from '@/store/taskStore';

export default function CalendarPage() {
  const { syncCompletedPomodoros } = useSchedule();
  const { loadLocalTasks } = useTaskStore();

  // 初回マウント時にタスクを読み込み
  useEffect(() => {
    loadLocalTasks();
  }, [loadLocalTasks]);

  // 30秒ごとに完了ポモドーロ数を同期
  useEffect(() => {
    // 初回実行
    syncCompletedPomodoros();

    // 30秒ごとに同期
    const interval = setInterval(() => {
      syncCompletedPomodoros();
    }, 30000); // 30秒

    return () => clearInterval(interval);
  }, [syncCompletedPomodoros]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">カレンダー</h1>

      {/* 週カレンダー表示 */}
      <CalendarView />

      {/* 左右レイアウト（レスポンシブ） */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* タスク追加フォーム */}
        <div>
          <AddTaskToScheduleForm />
        </div>

        {/* 日別タスク一覧 */}
        <div>
          <DayView />
        </div>
      </div>
    </div>
  );
}
