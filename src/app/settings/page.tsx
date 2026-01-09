'use client';

import { useEffect } from 'react';
import { SettingsForm } from '@/components/Settings/SettingsForm';
import { useSettingsStore } from '@/store/settingsStore';
import Link from 'next/link';

export default function SettingsPage() {
  const { loadSettings } = useSettingsStore();

  useEffect(() => {
    // 初回マウント時に設定を読み込み
    loadSettings();
  }, [loadSettings]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← ホームに戻る
          </Link>
        </div>

        <SettingsForm />
      </div>
    </div>
  );
}
