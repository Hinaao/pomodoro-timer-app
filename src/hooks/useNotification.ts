import { useEffect, useState } from 'react';

/**
 * ブラウザ通知機能を管理するフック
 */
export function useNotification() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  /**
   * 通知許可をリクエスト
   */
  const requestPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.error('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const perm = await Notification.requestPermission();
    setPermission(perm);
    return perm === 'granted';
  };

  /**
   * 通知を表示
   */
  const showNotification = (title: string, body: string) => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
      });
    }
  };

  return { permission, requestPermission, showNotification };
}
