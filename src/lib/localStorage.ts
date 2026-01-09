import { Settings, Session } from '@/types';

// localStorageのキー
const STORAGE_KEYS = {
  SETTINGS: 'pomodoro-app-settings',
  SESSIONS: 'pomodoro-app-sessions',
} as const;

// デフォルト設定
export const DEFAULT_SETTINGS: Settings = {
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  notificationEnabled: true,
  linearApiToken: '',
};

/**
 * 設定を取得
 */
export function getSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!stored) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(stored);
    // デフォルト値とマージして、新しいフィールドに対応
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * 設定を保存
 */
export function saveSettings(settings: Settings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
    // 容量超過時のハンドリング
    if (error instanceof DOMException && error.code === 22) {
      alert('ストレージ容量が不足しています。古いセッション履歴を削除してください。');
    }
  }
}

/**
 * セッション履歴を取得
 */
export function getSessions(): Session[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!stored) return [];

    const sessions = JSON.parse(stored);
    // 古いセッションをクリーンアップ（3ヶ月以上前）
    return cleanOldSessions(sessions);
  } catch (error) {
    console.error('Failed to load sessions:', error);
    return [];
  }
}

/**
 * セッションを追加保存
 */
export function saveSession(session: Session): void {
  if (typeof window === 'undefined') return;

  try {
    const sessions = getSessions();
    sessions.push(session);

    // 古いセッションをクリーンアップ
    const cleaned = cleanOldSessions(sessions);

    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(cleaned));
  } catch (error) {
    console.error('Failed to save session:', error);
    // 容量超過時のハンドリング
    if (error instanceof DOMException && error.code === 22) {
      // 最も古いセッションを削除して再試行
      const sessions = getSessions();
      if (sessions.length > 0) {
        sessions.shift(); // 最初の要素を削除
        sessions.push(session);
        try {
          localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
        } catch {
          alert('ストレージ容量が不足しています。セッション履歴を手動で削除してください。');
        }
      }
    }
  }
}

/**
 * 古いセッションをクリーンアップ（3ヶ月以上前のものを削除）
 */
function cleanOldSessions(sessions: Session[]): Session[] {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  return sessions.filter((session) => {
    const sessionDate = new Date(session.startedAt);
    return sessionDate > threeMonthsAgo;
  });
}

/**
 * すべてのセッションを削除（デバッグ用）
 */
export function clearAllSessions(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  } catch (error) {
    console.error('Failed to clear sessions:', error);
  }
}
