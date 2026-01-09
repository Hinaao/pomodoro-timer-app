# ポモドーロタスク管理アプリ 要件定義書

## 1. プロジェクト概要

### 1.1 プロジェクト名
Pomodoro Task Manager with AI

### 1.2 目的
Linearと連携したポモドーロタイマー機能とタスク管理を提供し、AIによる日次タスク提案機能を搭載した個人利用向けPWAアプリケーション

### 1.3 対象ユーザー
- 主に開発者本人（Kato）の個人利用
- 将来的な公開・マルチユーザー化も視野に入れた設計

### 1.4 開発目的
- 実用的なタスク管理ツールの構築
- Next.js/TypeScript/Supabaseの学習と実践
- フリーランス転向時のポートフォリオ作品

---

## 2. 機能要件

### 2.1 コア機能

#### 2.1.1 ポモドーロタイマー機能
**必須機能:**
- 25分の作業タイマー
- 5分の短い休憩タイマー
- 15分の長い休憩タイマー
- タイマーの開始/一時停止/リセット
- タイマー完了時の通知（デスクトップ通知）
- 現在のセッション状態の表示

**オプション機能:**
- タイマー時間のカスタマイズ設定
- タイマー音のカスタマイズ
- バックグラウンド動作中の通知

#### 2.1.2 タスク管理機能
**必須機能:**
- タスク一覧の表示
- タスクの詳細表示
- タスクとポモドーロタイマーの紐付け
- 完了したポモドーロ数の記録
- タスクごとの見積もりポモドーロ数の設定

**オプション機能:**
- タスクのフィルタリング（ステータス、優先度）
- タスクの検索機能

#### 2.1.3 Linear連携機能
**必須機能:**
- Linear MCPサーバーを使用したタスク取得
- Linearのタスク一覧表示
- Linearタスクのステータス、優先度、期限の表示

**オプション機能:**
- Linearへのステータス更新（将来的）
- Linear Webhookによる自動同期（将来的）

#### 2.1.4 カレンダー機能
**必須機能:**
- 日次カレンダービュー
- タスクの日付への割り当て
- 割り当てたタスクの一覧表示
- タスクごとの見積もりポモドーロ数の表示
- 日付ごとの合計見積もり時間の表示

**オプション機能:**
- 週次/月次ビュー
- タスクのドラッグ&ドロップによる日付変更
- 過去の実績表示

#### 2.1.5 AI提案機能
**必須機能:**
- Claude API（Sonnet 4.5）による日次タスク提案
- Linear MCPを使用したタスク情報の取得
- 提案されたタスクの一覧表示
- 提案理由の表示
- 提案タスクのカレンダーへの追加

**提案に含まれる情報:**
- 推奨タスクリスト
- 各タスクの優先度（高/中/低）
- 各タスクの見積もりポモドーロ数
- タスクを推奨する理由
- その日の作業計画の説明
- 合計見積もり時間

**AI提案の判断材料:**
- Linearの全タスク（優先度、期限、ステータス）
- 過去のポモドーロセッション履歴
- タスク完了パターン
- カレンダー上の既存予定

**オプション機能:**
- AI提案のフィードバック機能
- 学習データとしてのフィードバック保存

#### 2.1.6 セッション履歴機能
**必須機能:**
- ポモドーロセッションの記録
- セッション履歴の一覧表示
- 日次/週次/月次の統計表示
- タスク別の集計

**表示する統計情報:**
- 総ポモドーロ数
- 総作業時間
- タスク別ポモドーロ数
- 完了率

**オプション機能:**
- グラフによる可視化
- CSVエクスポート

#### 2.1.7 設定機能
**必須機能:**
- ポモドーロ時間の設定
- 短い休憩時間の設定
- 長い休憩時間の設定
- Linear APIトークンの設定
- 通知ON/OFFの設定

**オプション機能:**
- テーマカラーの変更
- タイマー音の選択

---

## 3. 技術要件

### 3.1 技術スタック

#### 3.1.1 フロントエンド
- **フレームワーク:** Next.js 15 (App Router)
- **言語:** TypeScript
- **スタイリング:** Tailwind CSS
- **UIコンポーネント:** shadcn/ui
- **カレンダーライブラリ:** react-big-calendar または @fullcalendar/react

#### 3.1.2 データ永続化
- **ストレージ:** localStorage
- **バックアップ用（将来的）:** Supabase (PostgreSQL)

#### 3.1.3 外部連携
- **Linear連携:** Linear MCP Server (`https://mcp.linear.app/mcp`)
- **AI機能:** Claude API (Sonnet 4.5)

#### 3.1.4 PWA
- **PWAライブラリ:** next-pwa
- **通知:** Web Push API / Notification API
- **オフライン対応:** Service Worker

#### 3.1.5 状態管理
- **グローバル状態:** Zustand または React Context
- **ローカル状態:** React hooks (useState, useEffect)

### 3.2 データ構造

#### 3.2.1 localStorage データ構造

```typescript
interface AppData {
  // 設定
  settings: {
    pomodoroDuration: number;        // デフォルト: 25
    shortBreakDuration: number;      // デフォルト: 5
    longBreakDuration: number;       // デフォルト: 15
    linearApiToken: string;
    notificationEnabled: boolean;
    soundEnabled: boolean;
  };
  
  // ポモドーロセッション履歴
  sessions: Array<{
    id: string;                      // UUID
    taskId: string;                  // Linear Issue ID
    taskTitle: string;
    startedAt: string;               // ISO 8601形式
    completedAt: string;             // ISO 8601形式
    duration: number;                // 分単位
    interrupted: boolean;            // 中断されたか
  }>;
  
  // タスクスケジュール（カレンダー用）
  schedules: Array<{
    id: string;                      // UUID
    date: string;                    // YYYY-MM-DD形式
    tasks: Array<{
      linearIssueId: string;
      taskTitle: string;
      estimatedPomodoros: number;
      completedPomodoros: number;
      notes?: string;
    }>;
  }>;
  
  // AI提案履歴（オプション）
  aiSuggestions: Array<{
    id: string;
    date: string;                    // YYYY-MM-DD形式
    suggestions: Array<{
      linearIssueId: string;
      taskTitle: string;
      priority: 'high' | 'medium' | 'low';
      estimatedPomodoros: number;
      reasoning: string;
    }>;
    dailyPlan: string;
    totalEstimatedTime: number;
    accepted: boolean;               // ユーザーが採用したか
    createdAt: string;
  }>;
}
```

### 3.3 API設計

#### 3.3.1 Claude API呼び出し（サーバーサイド）

**エンドポイント:** `/api/ai/suggest-tasks`

**リクエスト:**
```typescript
{
  date: string;              // YYYY-MM-DD
  includeHistory: boolean;   // 履歴を含めるか
}
```

**レスポンス:**
```typescript
{
  recommendations: Array<{
    linearTask: {
      id: string;
      title: string;
      description: string;
      priority: number;
      state: string;
      dueDate?: string;
    };
    priority: 'high' | 'medium' | 'low';
    estimatedPomodoros: number;
    reasoning: string;
  }>;
  dailyPlan: string;
  totalEstimatedTime: number;
}
```

#### 3.3.2 Linear MCP連携

MCPサーバー経由でLinearタスクを取得。Claude APIリクエスト内で指定：

```typescript
mcp_servers: [{
  type: 'url',
  url: 'https://mcp.linear.app/mcp',
  name: 'linear-mcp'
}]
```

### 3.4 PWA要件

#### 3.4.1 manifest.json
```json
{
  "name": "Pomodoro Task Manager",
  "short_name": "Pomodoro",
  "description": "AI-powered Pomodoro timer with Linear integration",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [...]
}
```

#### 3.4.2 Service Worker機能
- アプリケーションのキャッシュ
- オフライン時のフォールバック
- バックグラウンド同期（将来的）

#### 3.4.3 通知機能
- ポモドーロ完了時の通知
- 休憩終了時の通知
- 通知許可のリクエスト

---

## 4. 非機能要件

### 4.1 パフォーマンス
- 初回ページロード: 3秒以内
- タイマー動作: 遅延なし（1秒以内の応答）
- AI提案生成: 10秒以内

### 4.2 ユーザビリティ
- 直感的なUI/UX
- レスポンシブデザイン（デスクトップ優先）
- キーボードショートカット対応（オプション）

### 4.3 セキュリティ
- Linear APIトークンの安全な保存（暗号化）
- XSS/CSRF対策
- APIキーの環境変数管理

### 4.4 互換性
- 対応ブラウザ: Chrome, Edge, Safari（最新版）
- 対応OS: Windows, macOS, Linux
- PWAインストール対応

### 4.5 保守性
- TypeScriptによる型安全性
- コンポーネントの再利用性
- テストコードの作成（将来的）

---

## 5. 開発フェーズ

### Phase 1: 基本機能（2-3週間）
**目標:** 動作する最小限のアプリケーション

**実装内容:**
- Next.js + TypeScript + Tailwindのセットアップ
- 基本的なポモドーロタイマー機能
- localStorage による設定保存
- シンプルなタスク管理（CRUD）
- Linear MCP経由でのタスク取得

**成果物:**
- 動作するポモドーロタイマー
- Linearタスクの表示
- ローカル設定の保存

### Phase 2: カレンダー統合（1-2週間）
**目標:** タスクのスケジューリング機能

**実装内容:**
- カレンダーUIの実装
- タスクと日付の紐付け
- 日次ビューの実装
- スケジュールのlocalStorage保存

**成果物:**
- カレンダーでのタスク管理
- 日付ごとのタスク割り当て

### Phase 3: AI提案機能（1-2週間）
**目標:** AIによる日次タスク提案

**実装内容:**
- Claude API統合
- Linear MCP連携
- AI提案UIの実装
- 提案履歴の保存

**成果物:**
- AIによるタスク提案機能
- 提案のカレンダーへの追加

### Phase 4: セッション履歴・統計（1週間）
**目標:** 作業履歴の可視化

**実装内容:**
- セッション履歴の記録
- 統計画面の実装
- 日次/週次/月次レポート

**成果物:**
- 作業履歴の表示
- 基本的な統計機能

### Phase 5: PWA化（1週間）
**目標:** デスクトップアプリとしての利用

**実装内容:**
- next-pwa設定
- manifest.json作成
- Service Worker実装
- 通知機能実装

**成果物:**
- インストール可能なPWA
- オフライン動作
- デスクトップ通知

### Phase 6: UI/UX改善（継続的）
**目標:** ユーザー体験の向上

**実装内容:**
- UIの洗練
- アニメーション追加
- エラーハンドリング改善
- パフォーマンス最適化

---

## 6. 将来的な拡張

### 6.1 短期的な拡張（3-6ヶ月）
- Supabaseによるデバイス間同期
- より高度なAI提案（過去データ学習）
- グラフによる統計可視化
- カスタムテーマ機能

### 6.2 中期的な拡張（6-12ヶ月）
- マルチユーザー対応
- Supabase Authによる認証
- チーム機能
- 他のタスク管理ツールとの連携（GitHub Issues, Jira等）

### 6.3 長期的な拡張（12ヶ月以降）
- モバイルアプリ版（React Native）
- 音声コントロール
- 習慣トラッキング機能
- ガントチャート表示

---

## 7. 制約事項・前提条件

### 7.1 制約事項
- 個人利用のため認証機能は当初実装しない
- localStorage容量制限（5-10MB）内での運用
- Linear APIの利用制限内での運用
- Claude APIの無料枠内での運用

### 7.2 前提条件
- Linearアカウントの保有
- Linear APIトークンの取得
- モダンブラウザの使用
- インターネット接続（AI提案時、Linear連携時）

### 7.3 リスク
- localStorage データの消失リスク
  → 対策: 定期的なエクスポート機能の提供
- Claude API利用制限
  → 対策: キャッシュ活用、1日1回の提案に制限
- Linear API変更
  → 対策: MCP経由のため影響は限定的

---

## 8. 成功基準

### 8.1 定量的指標
- Phase 1-5を3ヶ月以内に完了
- 毎日の実利用（最低30日間）
- AI提案の精度: 主観的に70%以上が有用

### 8.2 定性的指標
- 実用的なタスク管理ツールとして日常利用可能
- フリーランス転向時のポートフォリオとして十分な品質
- 技術スタックの実践的な習得

---

## 9. 参考情報

### 9.1 関連ドキュメント
- Next.js Documentation: https://nextjs.org/docs
- Linear API Documentation: https://developers.linear.app/
- Claude API Documentation: https://docs.anthropic.com/
- MCP Documentation: https://modelcontextprotocol.io/

### 9.2 類似サービス
- Pomofocus: https://pomofocus.io/
- Toggl Track: https://toggl.com/track/
- Notion Calendar: https://www.notion.so/product/calendar

---

## 10. 承認

**作成日:** 2026年1月9日  
**作成者:** Kato  
**バージョン:** 1.0  
**ステータス:** 承認待ち

---

## 付録

### A. 用語集
- **ポモドーロ:** 25分の作業単位
- **MCP:** Model Context Protocol - LLMが外部ツールと連携するためのプロトコル
- **PWA:** Progressive Web App - Webアプリをネイティブアプリのように動作させる技術
- **localStorage:** ブラウザのローカルストレージ（永続的なデータ保存）

### B. 画面遷移図（概要）
```
[ホーム/タイマー画面]
    ↓
[カレンダー画面] ←→ [AI提案画面]
    ↓
[セッション履歴画面]
    ↓
[設定画面]
```

### C. 技術検証項目
- [ ] next-pwaの動作確認
- [ ] Linear MCP接続テスト
- [ ] Claude API + MCP統合テスト
- [ ] localStorage容量テスト
- [ ] PWA通知動作確認
- [ ] オフライン動作確認
