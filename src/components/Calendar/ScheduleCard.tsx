'use client';

import { ScheduledTask } from '@/types';
import { useScheduleStore } from '@/store/scheduleStore';
import { useTaskStore } from '@/store/taskStore';

interface ScheduleCardProps {
  task: ScheduledTask;
  date: string;
}

export function ScheduleCard({ task, date }: ScheduleCardProps) {
  const { removeTaskFromSchedule, updateScheduledTask } = useScheduleStore();
  const { tasks } = useTaskStore();

  // 元タスクの情報を取得
  const originalTask = tasks.find((t) => t.id === task.linearIssueId);

  // 進捗率を計算
  const progress = Math.min(
    (task.completedPomodoros / task.estimatedPomodoros) * 100,
    100
  );

  // 削除ハンドラー
  const handleDelete = () => {
    if (confirm('このタスクをスケジュールから削除しますか？')) {
      removeTaskFromSchedule(date, task.linearIssueId);
    }
  };

  // 見積もり編集ハンドラー
  const handleEditEstimate = () => {
    const input = prompt(
      '見積もりポモドーロ数を入力してください（1-20）:',
      task.estimatedPomodoros.toString()
    );

    if (input === null) return; // キャンセル

    const newEstimate = parseInt(input, 10);

    if (isNaN(newEstimate) || newEstimate < 1 || newEstimate > 20) {
      alert('1から20の間の数値を入力してください');
      return;
    }

    updateScheduledTask(date, task.linearIssueId, {
      estimatedPomodoros: newEstimate,
    });
  };

  return (
    <div className="p-4 bg-white border border-gray-300 rounded-lg">
      {/* ヘッダー */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg flex-1">{task.taskTitle}</h3>

        <div className="flex gap-2 ml-2">
          <button
            onClick={handleEditEstimate}
            className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            編集
          </button>
          <button
            onClick={handleDelete}
            className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            削除
          </button>
        </div>
      </div>

      {/* 元タスク情報 */}
      {originalTask && (
        <div className="flex gap-2 mb-2">
          <span
            className={`text-xs px-2 py-1 rounded ${
              originalTask.source === 'local'
                ? 'bg-green-200 text-green-800'
                : 'bg-purple-200 text-purple-800'
            }`}
          >
            {originalTask.source === 'local' ? 'ローカル' : 'Linear'}
          </span>
          <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-800">
            {originalTask.state}
          </span>
        </div>
      )}

      {/* 進捗バー */}
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">進捗</span>
          <span className="font-semibold">
            {task.completedPomodoros} / {task.estimatedPomodoros} 🍅
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 見積もり時間 */}
      <div className="text-sm text-gray-600 mb-2">
        見積もり: {task.estimatedPomodoros * 25}分
      </div>

      {/* メモ */}
      {task.notes && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
          {task.notes}
        </div>
      )}
    </div>
  );
}
