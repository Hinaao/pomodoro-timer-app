'use client';

import { useScheduleStore } from '@/store/scheduleStore';
import { format, startOfWeek, addDays } from 'date-fns';
import { ja } from 'date-fns/locale';

export function CalendarView() {
  const { schedules, selectedDate, setSelectedDate } = useScheduleStore();

  // 今週の開始日（月曜日）を取得
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // 1 = 月曜日

  // 今週の7日間を生成
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // 今日の日付
  const today = format(new Date(), 'yyyy-MM-dd');

  // 特定日付の合計ポモドーロ数を計算
  const getTotalPomodoros = (date: string) => {
    const schedule = schedules.find((s) => s.date === date);
    if (!schedule) return 0;

    return schedule.tasks.reduce(
      (sum, task) => sum + task.estimatedPomodoros,
      0
    );
  };

  // ポモドーロ数を時間に変換（1ポモドーロ=25分）
  const formatTime = (pomodoros: number) => {
    const minutes = pomodoros * 25;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}分`;
    if (mins === 0) return `${hours}時間`;
    return `${hours}時間${mins}分`;
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">今週のスケジュール</h2>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const totalPomodoros = getTotalPomodoros(dateStr);
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;

          return (
            <div
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : isToday
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              {/* 曜日 */}
              <div className="text-xs text-gray-500 text-center mb-1">
                {format(day, 'E', { locale: ja })}
              </div>

              {/* 日付 */}
              <div className="text-lg font-bold text-center mb-2">
                {format(day, 'd')}
              </div>

              {/* 合計ポモドーロ数 */}
              {totalPomodoros > 0 && (
                <div className="text-center">
                  <div className="text-sm font-semibold text-blue-600">
                    {totalPomodoros} 🍅
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTime(totalPomodoros)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
