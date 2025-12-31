# HuaGo - 台湾華語学習アプリ

Next.js（App Router）で構築された、100%ローカルの台湾華語（繁體中文）学習アプリ。

## 特徴

- **SRS（間隔反復）中心**の学習システム
- **speechSynthesis**による音声再生（音声ファイル不要）
- **IndexedDB（Dexie）**で完全ローカル保存
- バックエンド/ログイン/同期不要

## 技術スタック

- Next.js 14 (App Router)
- React 18
- TypeScript
- Dexie (IndexedDB)
- Web Speech API (speechSynthesis)

## セットアップ・実行手順

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

初回起動時に `seed.json` のデータが自動的にIndexedDBに投入されます。

## プロジェクト構成

```
HuaGo/
├── app/                    # App Router ページ
│   ├── page.tsx           # / (Today)
│   ├── review/            # /review
│   ├── focus/             # /focus
│   ├── learn/             # /learn
│   ├── conversation/      # /conversation
│   ├── quiz/              # /quiz
│   ├── courses/           # /courses
│   ├── insights/          # /insights
│   ├── test/              # /test
│   ├── settings/          # /settings
│   ├── layout.tsx
│   └── globals.css
├── components/            # 共通コンポーネント
│   ├── SpeakButton.tsx   # 音声再生ボタン
│   ├── Navigation.tsx    # ナビゲーション
│   └── SeedInitializer.tsx # 初回seed投入
├── lib/                   # ユーティリティ
│   ├── types.ts          # 型定義
│   ├── db.ts             # Dexie設定
│   ├── srs.ts            # SRSロジック
│   ├── tts.ts            # speechSynthesis共通実装
│   ├── seed.ts           # seed投入処理
│   └── importExport.ts   # Export/Import機能
├── seed.json             # 初期データ
└── package.json
```

## Step1実装内容

### データベース層
- DexieでIndexedDB管理
- cards, userCardStates, conversationTemplates, assessments, dailyStats, settings テーブル

### 初回起動時のseed投入
- `seed.json` から自動投入
- 重複投入防止（settingsテーブルで管理）

### Export/Import機能
- `/settings` ページでJSON形式のエクスポート/インポート
- 全データ（cards, userCardStates, templates, assessments, stats, settings）を対象

### 音声機能
- `lib/tts.ts`: speechSynthesisの共通実装
  - `speak()`, `stop()`, `isSupported()`
  - voiceschanged待ち、cancelによる連打防止
- `components/SpeakButton.tsx`: 🔊再生/停止ボタン
- Todayページで動作確認可能

### ルーティング
- 全10ルート実装（仮UI）
- ナビゲーションコンポーネントで全ページへのリンク

## 主要機能（今後実装予定）

- **SRSフラッシュカード**: 表/裏表示、EASY/HARD/AGAIN評価
- **Focus Review**: HARD/AGAINのみの集中復習
- **会話ドリル**: シーン別テンプレート分岐練習
- **1分クイズ**: 瞬発力トレーニング
- **インサイト**: 学習統計・弱点分析
- **レベル測定**: TOCFL/CEFR診断

