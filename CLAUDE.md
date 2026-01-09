# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pomodoro Task Manager with AI - Next.js 15ベースのAI連携型ポモドーロタイマーアプリケーション。Linearタスク管理ツールと連携し、Claude APIによるAIタスク提案機能を備えたPWAアプリ。

詳細は `/docs/pomodoro-app-requirements.md` を参照してください。

## Development Setup

### Initial Project Setup

```bash
# Node.js 18以上が必須
npx create-next-app@latest . --typescript --tailwind --eslint --app
# または手動セットアップの場合:
npm install next@latest react@19 react-dom@19 typescript
npm install -D tailwindcss postcss autoprefixer @types/node @types/react
npm install zustand (状態管理)
npm install next-pwa (PWA対応)
```

### Development Commands

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番環境で動作確認
npm start

# ESLint実行
npm run lint
```

## Technology Stack

- **Framework:** Next.js 16 (App Router) - 最新版
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand（推奨）または React Context
- **Storage:** localStorage（将来的にSupabaseに拡張）
- **External Services:** Claude API (Sonnet 4.5), Linear MCP Server
- **PWA:** next-pwa + Web Notification API

## Architecture Overview

### データフロー

```
[UI Components]
      ↓
[Zustand Store / Context] ← localStorage
      ↓
[Custom Hooks] → [API Routes]
      ↓
[Claude API / Linear MCP]
```

### ディレクトリ構造（推奨）

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx           # ホーム/タイマー画面
│   ├── calendar/          # カレンダー画面
│   ├── ai-suggestions/    # AI提案画面
│   ├── history/           # セッション履歴画面
│   ├── settings/          # 設定画面
│   └── api/               # API Routes
│       ├── ai/
│       │   └── suggest-tasks.ts
│       └── linear/
│           └── tasks.ts
├── components/            # Reusable components
│   ├── Timer/
│   ├── Calendar/
│   ├── TaskList/
│   └── Settings/
├── hooks/                 # Custom hooks
│   ├── useTimer.ts
│   ├── useTasks.ts
│   ├── useSchedule.ts
│   └── useAISuggestions.ts
├── store/                 # Zustand stores
│   ├── timerStore.ts
│   ├── taskStore.ts
│   ├── scheduleStore.ts
│   └── settingsStore.ts
├── types/                 # TypeScript definitions
│   ├── index.ts
│   ├── linear.ts
│   └── session.ts
├── lib/                   # Utility functions
│   ├── localStorage.ts
│   ├── linear-client.ts
│   └── ai-client.ts
└── public/                # Static assets
    ├── icons/
    └── manifest.json
```

## Key Implementation Details

### 1. Timer Implementation

タイマーはZustandストアで状態管理し、`setInterval`またはより正確な時刻ベースロジックを使用する。ローカルステートはブラウザタブに限定。

### 2. localStorage Data Structure

完全なスキーマは要件定義書の3.2.1を参照。主要なデータ:
- `app-settings`: ユーザー設定
- `pomodoro-sessions`: セッション履歴
- `task-schedules`: カレンダー割り当て
- `ai-suggestions`: AI提案履歴

### 3. Linear/Claude API Integration

サーバーサイドRoute Handlers (`app/api/`) でAPI呼び出しを実行。クライアントからはこのRoute Handlerを呼び出す形式。

### 4. PWA Configuration

`next.config.ts` で `next-pwa` を設定。`public/manifest.json` でアプリメタデータを定義。Service Workerはnext-pwaが自動生成。

### 5. Notification System

Web Notification APIを使用。ブラウザの通知許可取得フローを実装。

## Environment Variables

```env
# .env.local に以下を設定
NEXT_PUBLIC_LINEAR_API_URL=https://api.linear.app/graphql
ANTHROPIC_API_KEY=sk-ant-...
LINEAR_API_TOKEN=lin_api_...
```

**注意:** Linear API Tokenはセンシティブデータ。フロントエンドに露出させない。サーバーサイドでのみ使用。

## Coding Standards

### Code Formatting

**重要:** このプロジェクトはESLint/Prettierによる自動フォーマットが有効です。以下のルールに従ってコードを書いてください：

- **文字列リテラル:** ダブルクォート (`"`) を使用（シングルクォート `'` は使用しない）
- **改行:** 長い行は適切に改行する（特にJSX属性）
- **インポート順序:** React → サードパーティ → ローカルモジュール の順
- **命名規則:**
  - コンポーネント: PascalCase (例: `CalendarView`)
  - 関数・変数: camelCase (例: `handleSubmit`)
  - 定数: UPPER_SNAKE_CASE (例: `STORAGE_KEYS`)
  - ファイル名: コンポーネントはPascalCase、その他はcamelCase

**コード作成時の注意点:**
- 新規ファイル作成時は最初からダブルクォートを使用する
- JSXの属性は改行が必要な場合は適切に改行する
- linterのフォーマット修正によるコミット履歴の汚染を防ぐ

### TypeScript Standards

- `any` 型の使用は最小限にする
- 型定義は `src/types/` に集約
- Propsやステート型は明示的に定義
- 関数の戻り値型は可能な限り明示

## Development Notes

### Phase-based Development

プロジェクトは6段階のPhaseに分割：
1. 基本機能（タイマー + localStorage） ✅ 完了
2. カレンダー統合 ✅ 完了
3. AI提案機能
4. セッション履歴・統計
5. PWA化
6. UI/UX改善

### Important Considerations

- **localStorage制限:** 5-10MB容量内で設計
- **AI API費用:** Claude APIは費用がかかるため、キャッシュとレート制限を実装
- **Linear MCP:** 接続状況をハンドリング（インターネット要件）
- **TypeScript:** 型安全性を最大化 - `any` の使用は最小化
- **コードフォーマット:** ダブルクォート使用、linterルールに従う

### Common Tasks

```bash
# 特定のコンポーネントテンプレート作成
# app/[feature]/page.tsx と components/[Feature]/*.tsx を同時に作成

# 新しいZustandストア追加
# src/store/[feature]Store.ts を作成し、updateアクション含む

# API Route追加
# app/api/[path]/route.ts を作成（GET/POST分岐含む）

# localStorage操作
# src/lib/localStorage.ts にヘルパー関数追加
```

## Testing Notes

テストはPhase段階では実装予定。

## References

- 要件定義書: `/docs/pomodoro-app-requirements.md`
- Linear API: https://developers.linear.app/
- Claude API: https://docs.anthropic.com/
- Next.js App Router: https://nextjs.org/docs/app
- MCP: https://modelcontextprotocol.io/
