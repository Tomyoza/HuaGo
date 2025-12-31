# Step2 実装完了レポート

## SRS仕様

### 更新式

#### 基本パラメータ
- `INITIAL_EASE = 2.5`（新規カードの初期ease）
- `MIN_EASE = 1.3`（easeの最小値）
- `EASE_INCREASE = 0.1`（EASY時のease増加）
- `EASE_DECREASE = 0.15`（HARD/AGAIN時のease減少）
- `MAX_SESSION_RETRY = 3`（同セッション内の最大再出題回数）

#### 評価別の更新ロジック

**EASY（覚えた）**
- `ease = max(MIN_EASE, current_ease + EASE_INCREASE)`
- `interval_days = ceil(current_interval * new_ease * 1.2)`
- `due_at = now + interval_days * 24h`
- `focus_until = null`（Focus解除）

**HARD（あいまい）**
- `ease = max(MIN_EASE, current_ease - EASE_DECREASE)`
- `interval_days = max(1, ceil(current_interval * new_ease * 0.8))`
- `due_at = now + interval_days * 24h`
- `hard_count += 1`
- `focus_until = today + 5日`（Focus Reviewに追加）

**AGAIN（無理）**
- `ease = max(MIN_EASE, current_ease - EASE_DECREASE * 2)`
- `interval_days = 1`（翌日再出題）
- `due_at = now + 1日`
- `lapse_count += 1`
- `again_count += 1`
- `focus_until = today + 2日`（Focus Reviewに追加）
- **同セッション内で再登場**（キュー末尾に再追加、最大3回まで）

### 同日再出題

- AGAIN評価時、同セッション内で再登場させる
- キュー末尾に再追加
- 無限ループ防止：同一カードの再追加回数は最大3回まで（`MAX_SESSION_RETRY`）

### Focus Review

- **AGAIN**: `focus_until = today + 2日`
- **HARD**: `focus_until = today + 5日`
- **EASY**: `focus_until = null`（Focus解除）

## 実装コード

### lib/srs.ts

主要な関数：
- `updateSRS()`: SRS更新ロジック（focus_until更新含む）
- `generateReviewQueue()`: due_at <= now のカードを抽出して出題順を作る
- `updateCardState()`: カード状態を更新してDBに保存
- `getDueCards()`: 復習期限が来たカードを取得
- `getFocusCards()`: Focus Review用のカードを取得

### app/review/page.tsx

実装内容：
- カード表→裏→評価(EASY/HARD/AGAIN)→次へ
- 表面：繁體 + 拼音 + 日本語 + SpeakButton（hanzi_tradを読み上げ）
- 裏面：例文 + よくある返答候補 + 台湾言い換えメモ + SpeakButton（example_tradを読み上げ）
- AGAINカードの同セッション内再出題（最大3回まで）
- 進捗表示

### lib/srs.test.ts

テスト内容：
- 新規カードの作成（EASY/HARD/AGAIN）
- 既存カードの更新（EASY/HARD/AGAIN）
- Edgeケース：
  - AGAIN連打でeaseがMIN_EASE以下にならない
  - EASY連打でintervalが増加する
  - due_atが正しく更新される
  - HARD評価でintervalが1未満にならない
- focus_until更新：
  - EASYでfocus_untilがnullになる
  - HARDでfocus_untilが今日+5日に設定される
  - AGAINでfocus_untilが今日+2日に設定される

## 受け入れ条件の確認

✅ **3ボタンで due_at/interval/ease が更新されDBに保存される**
- `updateSRS()`で更新ロジック実装
- `updateCardState()`でDBに保存

✅ **AGAINカードが同セッションで再登場する**
- `app/review/page.tsx`で実装
- キュー末尾に再追加、最大3回まで

✅ **focus_untilが更新される**
- `updateSRS()`内で実装
- AGAIN → today + 2日
- HARD → today + 5日
- EASY → null

✅ **SpeakButtonで読み上げできる**
- 表面：hanzi_trad
- 裏面：example_trad

✅ **テストが通る**
- Vitestでユニットテスト実装
- 更新式とedgeケースを検証

## 実行手順

```bash
# テスト実行
npm test

# 開発サーバー起動
npm run dev
```

ブラウザで [http://localhost:3000/review](http://localhost:3000/review) を開いて復習機能を確認

