# Step1 実装完了レポート

## フォルダ/ファイル一覧

```
HuaGo/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # / (Today) - メインダッシュボード
│   ├── review/
│   │   └── page.tsx             # /review - SRSフラッシュカード復習
│   ├── focus/
│   │   └── page.tsx             # /focus - Focus Review
│   ├── learn/
│   │   └── page.tsx             # /learn - 新規学習
│   ├── conversation/
│   │   └── page.tsx             # /conversation - 会話ドリル
│   ├── quiz/
│   │   └── page.tsx             # /quiz - 1分クイズ
│   ├── courses/
│   │   └── page.tsx             # /courses - コース一覧
│   ├── insights/
│   │   └── page.tsx             # /insights - インサイト
│   ├── test/
│   │   └── page.tsx             # /test - レベル測定
│   ├── settings/
│   │   └── page.tsx             # /settings - 設定・Export/Import
│   ├── layout.tsx              # ルートレイアウト
│   └── globals.css              # グローバルスタイル
├── components/
│   ├── SpeakButton.tsx         # 🔊 音声再生ボタン
│   ├── Navigation.tsx          # ナビゲーション
│   └── SeedInitializer.tsx     # 初回seed投入コンポーネント
├── lib/
│   ├── types.ts                # 型定義
│   ├── db.ts                   # Dexie設定（IndexedDB）
│   ├── srs.ts                  # SRSロジック
│   ├── tts.ts                  # speechSynthesis共通実装
│   ├── seed.ts                 # seed投入処理
│   └── importExport.ts         # Export/Import機能
├── seed.json                   # 初期データ
├── package.json
├── tsconfig.json
├── next.config.js
├── .gitignore
└── README.md
```

## 主要ファイルの完全コード

### lib/types.ts
型定義（Card, UserCardState, ConversationTemplate, Assessment, DailyStats, AppSettings）

### lib/db.ts
DexieでIndexedDBを管理。6つのテーブル（cards, userCardStates, conversationTemplates, assessments, dailyStats, settings）

### lib/seed.ts
初回起動時に`seed.json`を投入。settingsテーブルで重複投入を防止。

### lib/importExport.ts
- `exportData()`: 全データをJSON形式で取得
- `exportToFile()`: JSONファイルとしてダウンロード
- `importFromFile()`: JSONファイルから復元（上書き）

### lib/tts.ts
speechSynthesisの共通実装：
- `isSupported()`: サポートチェック
- `speak(text, lang)`: 音声再生（voiceschanged待ち、cancelによる連打防止）
- `stop()`: 音声停止
- `isSpeaking()`: 再生中かどうか

### components/SpeakButton.tsx
🔊再生/停止ボタン。`lib/tts.ts`を使用。

## 実行手順

```bash
# 1. 依存関係のインストール
npm install

# 2. 開発サーバー起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## 受け入れ条件の確認

✅ **リロードしてもデータが残る**
- IndexedDB（Dexie）を使用しているため、ブラウザのデータが消えない限り永続化される

✅ **seed投入が二重実行されない**
- `lib/seed.ts`でsettingsテーブルの`seed_completed`フラグで管理
- 初回起動時のみ`SeedInitializer`コンポーネントが実行

✅ **Exportで全データがJSONで落ちる**
- `lib/importExport.ts`の`exportToFile()`で以下をエクスポート：
  - cards
  - userCardStates
  - templates (conversationTemplates)
  - assessments
  - stats (dailyStats)
  - settings

✅ **Importで復元できる（上書きでOK）**
- `lib/importExport.ts`の`importFromFile()`で全テーブルをクリアしてから投入

✅ **SpeakButtonをどこかの仮ページで動作確認できる**
- `/` (Today)ページに音声テストセクションを追加
- 「你好」「謝謝」「不好意思」の3つのサンプルで動作確認可能

## ルーティング

全10ルート実装済み（仮UI）：
- `/` - Today（メインダッシュボード）
- `/review` - 復習
- `/focus` - Focus Review
- `/learn` - 新規学習
- `/conversation` - 会話ドリル
- `/quiz` - 1分クイズ
- `/courses` - コース
- `/insights` - インサイト
- `/test` - レベル測定
- `/settings` - 設定

全ページにナビゲーションコンポーネントでリンク可能。

