'use client';

import { TaskCard } from './TaskCard';
import { useTasks } from '@/hooks/useTasks';

export function TaskList() {
  const { tasks, isLoading, error, loadTasks } = useTasks();

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">タスク一覧</h2>
        <button
          onClick={loadTasks}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? '読み込み中...' : 'タスクを読み込む'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-4">
          {error}
        </div>
      )}

      {tasks.length === 0 && !isLoading && !error && (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
          タスクがありません。「タスクを読み込む」ボタンをクリックしてLinearからタスクを取得してください。
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
