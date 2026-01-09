'use client';

import { useScheduleStore } from '@/store/scheduleStore';
import { ScheduleCard } from './ScheduleCard';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export function DayView() {
  const { selectedDate, getScheduleByDate } = useScheduleStore();

  if (!selectedDate) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
        日付を選択してください
      </div>
    );
  }

  const schedule = getScheduleByDate(selectedDate);

  // 合計ポモドーロ数を計算
  const totalEstimated = schedule
    ? schedule.tasks.reduce((sum, task) => sum + task.estimatedPomodoros, 0)
    : 0;

  const totalCompleted = schedule
    ? schedule.tasks.reduce((sum, task) => sum + task.completedPomodoros, 0)
    : 0;

  // 時間に変換（1ポモドーロ=25分）
  const formatTime = (pomodoros: number) => {
    const minutes = pomodoros * 25;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}分`;
    if (mins === 0) return `${hours}時間`;
    return `${hours}時間${mins}分`;
  };

  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">
          {format(new Date(selectedDate), 'M月d日（E）', { locale: ja })}
        </h3>

        {schedule && schedule.tasks.length > 0 && (
          <div className="flex gap-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold">見積もり:</span>{' '}
              {totalEstimated} 🍅 ({formatTime(totalEstimated)})
            </div>
            <div>
              <span className="font-semibold">完了:</span> {totalCompleted} 🍅 (
              {formatTime(totalCompleted)})
            </div>
          </div>
        )}
      </div>

      {/* タスク一覧 */}
      {!schedule || schedule.tasks.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
          この日にはタスクがスケジュールされていません
        </div>
      ) : (
        <div className="space-y-3">
          {schedule.tasks.map((task) => (
            <ScheduleCard
              key={task.linearIssueId}
              task={task}
              date={selectedDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
