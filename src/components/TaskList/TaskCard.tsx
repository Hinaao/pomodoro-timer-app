'use client';

import { LinearTask } from '@/types';
import { useTaskStore } from '@/store/taskStore';
import { useTimerStore } from '@/store/timerStore';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface TaskCardProps {
  task: LinearTask;
}

export function TaskCard({ task }: TaskCardProps) {
  const { selectedTaskId, selectTask } = useTaskStore();
  const { setCurrentTask } = useTimerStore();

  const isSelected = selectedTaskId === task.id;

  const handleClick = () => {
    selectTask(task.id);
    setCurrentTask(task.id, task.title);
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
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
        isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-400'
      } ${getPriorityColor(task.priority)}`}
    >
      <div className="flex justify-between items-start mb-2">
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
