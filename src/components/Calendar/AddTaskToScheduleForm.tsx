"use client";

import { useState } from "react";
import { useScheduleStore } from "@/store/scheduleStore";
import { useTaskStore } from "@/store/taskStore";

export function AddTaskToScheduleForm() {
  const { selectedDate, addTaskToSchedule, error, clearError } =
    useScheduleStore();
  const { tasks } = useTaskStore();

  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(2);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      alert("日付を選択してください");
      return;
    }

    if (!selectedTaskId) {
      alert("タスクを選択してください");
      return;
    }

    // 選択されたタスクの情報を取得
    const task = tasks.find((t) => t.id === selectedTaskId);
    if (!task) {
      alert("タスクが見つかりません");
      return;
    }

    // スケジュールに追加
    addTaskToSchedule(selectedDate, {
      linearIssueId: task.id,
      taskTitle: task.title,
      estimatedPomodoros,
      notes: notes.trim() || undefined,
    });

    // エラーがなければフォームをリセット
    if (!error) {
      setSelectedTaskId("");
      setEstimatedPomodoros(2);
      setNotes("");
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-300 rounded-lg">
      <h3 className="text-lg font-bold mb-4">タスクをスケジュールに追加</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button
            onClick={clearError}
            className="ml-2 text-xs underline hover:no-underline"
          >
            閉じる
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* タスク選択 */}
        <div>
          <label className="block text-sm font-medium mb-1">タスク *</label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">タスクを選択...</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                [{task.source === "local" ? "ローカル" : "Linear"}] {task.title}
              </option>
            ))}
          </select>
        </div>

        {/* 見積もりポモドーロ数 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            見積もりポモドーロ数 *
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={estimatedPomodoros}
            onChange={(e) => setEstimatedPomodoros(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="text-xs text-gray-500 mt-1">
            約 {estimatedPomodoros * 25}分
          </div>
        </div>

        {/* メモ */}
        <div>
          <label className="block text-sm font-medium mb-1">
            メモ（オプション）
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="タスクに関するメモ..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={!selectedDate}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
        >
          {selectedDate ? "スケジュールに追加" : "日付を選択してください"}
        </button>
      </form>
    </div>
  );
}
