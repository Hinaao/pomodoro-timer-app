'use client';

import { Task } from '@/types';
import { useTaskStore } from '@/store/taskStore';
import { useTimerStore } from '@/store/timerStore';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { selectedTaskId, selectTask, deleteTask } = useTaskStore();
  const { setCurrentTask } = useTimerStore();

  const isSelected = selectedTaskId === task.id;

  const handleClick = () => {
    selectTask(task.id);
    setCurrentTask(task.id, task.title);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.source === 'local' && confirm('このタスクを削除しますか？')) {
      deleteTask(task.id);
    }
  };

  // 優先度に応じた色
  const getPriorityColor = (priority: number) => {
    if (priority >= 3) return 'bg-red-100 border-red-400';
    if (priority === 2) return 'bg-yellow-100 border-yellow-400';
    return 'bg-blue-100 border-blue-400';
  };

  // 優先度ラベル
  const getPriorityLabel = (priority: number) => {
    if (priority >= 3) return '高';
    if (priority === 2) return '中';
    return '低';
  };

  // 期限フォーマット
  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return null;
    try {
      return format(new Date(dueDate), 'M月d日', { locale: ja });
    } catch {
      return null;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all relative ${
        isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-400'
      } ${getPriorityColor(task.priority)}`}
    >
      {/* ソース表示 */}
      <div className="absolute top-2 right-2 flex gap-2 items-center">
        <span className={`text-xs px-2 py-1 rounded ${task.source === 'local' ? 'bg-green-200 text-green-800' : 'bg-purple-200 text-purple-800'}`}>
          {task.source === 'local' ? 'ローカル' : 'Linear'}
        </span>
        {task.source === 'local' && (
          <button
            onClick={handleDelete}
            className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            削除
          </button>
        )}
      </div>

      <div className="flex justify-between items-start mb-2 pr-20">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <span className="text-xs font-bold px-2 py-1 rounded bg-white">
          {getPriorityLabel(task.priority)}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
      )}

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span className="px-2 py-1 bg-white rounded">{task.state}</span>
        {task.dueDate && <span>期限: {formatDueDate(task.dueDate)}</span>}
      </div>
    </div>
  );
}
