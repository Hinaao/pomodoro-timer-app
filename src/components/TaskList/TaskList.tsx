'use client';

import { useEffect } from 'react';
import { TaskCard } from './TaskCard';
import { AddTaskForm } from './AddTaskForm';
import { useTasks } from '@/hooks/useTasks';
import { useTaskStore } from '@/store/taskStore';

export function TaskList() {
  const { tasks, isLoading, error, loadTasks } = useTasks();
  const { loadLocalTasks } = useTaskStore();

  // 初回マウント時にローカルタスクを読み込み
  useEffect(() => {
    loadLocalTasks();
  }, [loadLocalTasks]);

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">タスク一覧</h2>
        <button
          onClick={loadTasks}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? '読み込み中...' : 'Linearから読み込む'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* タスク追加フォーム */}
      <div className="mb-4">
        <AddTaskForm />
      </div>

      {tasks.length === 0 && !isLoading && !error && (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
          タスクがありません。「新しいタスクを追加」または「Linearから読み込む」をクリックしてください。
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
