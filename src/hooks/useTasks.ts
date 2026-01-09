import { useCallback } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useSettingsStore } from '@/store/settingsStore';

/**
 * タスク取得ロジックを管理するフック
 */
export function useTasks() {
  const { tasks, isLoading, error, setTasks, setLoading, setError, clearError } = useTaskStore();
  const { settings } = useSettingsStore();

  /**
   * Linearタスクを読み込む
   */
  const loadTasks = useCallback(async () => {
    if (!settings.linearApiToken) {
      setError('Linear APIトークンが設定されていません。設定画面で入力してください。');
      return;
    }

    try {
      setLoading(true);
      clearError();

      const response = await fetch('/api/linear/tasks', {
        headers: {
          'x-linear-token': settings.linearApiToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data.tasks);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクの取得に失敗しました';
      setError(errorMessage);
    }
  }, [settings.linearApiToken, setTasks, setLoading, setError, clearError]);

  return { tasks, isLoading, error, loadTasks };
}
