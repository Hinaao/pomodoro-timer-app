'use client';

import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';

export function AddTaskForm() {
  const { addLocalTask } = useTaskStore();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(2); // デフォルト: 中
  const [state, setState] = useState('Todo');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('タスク名を入力してください');
      return;
    }

    addLocalTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      state,
      dueDate: dueDate || null,
    });

    // フォームをリセット
    setTitle('');
    setDescription('');
    setPriority(2);
    setState('Todo');
    setDueDate('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
      >
        + 新しいタスクを追加
      </button>
    );
  }

  return (
    <div className="p-4 bg-white border-2 border-green-600 rounded-lg">
      <h3 className="text-lg font-bold mb-4">新しいタスクを追加</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* タスク名 */}
        <div>
          <label className="block text-sm font-medium mb-1">タスク名 *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: 資料作成"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* 説明 */}
        <div>
          <label className="block text-sm font-medium mb-1">説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="タスクの詳細..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* 優先度 */}
          <div>
            <label className="block text-sm font-medium mb-1">優先度</label>
            <select
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value={0}>低</option>
              <option value={1}>低-中</option>
              <option value={2}>中</option>
              <option value={3}>中-高</option>
              <option value={4}>高</option>
            </select>
          </div>

          {/* ステータス */}
          <div>
            <label className="block text-sm font-medium mb-1">ステータス</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {/* 期限 */}
          <div>
            <label className="block text-sm font-medium mb-1">期限</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* ボタン */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            追加
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
