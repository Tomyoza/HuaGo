# Step2 実装完了レポート

## SRS仕様（更新式・意図）

### 基本パラメータ
- `INITIAL_EASE = 2.5`：新規カードの初期ease factor
- `MIN_EASE = 1.3`：easeの最小値（これ以下にはならない）
- `EASE_INCREASE = 0.1`：EASY評価時のease増加量
- `EASE_DECREASE = 0.15`：HARD/AGAIN評価時のease減少量
- `MAX_SESSION_RETRY = 3`：同セッション内の最大再出題回数（無限ループ防止）

### 評価別の更新ロジック

#### EASY（覚えた）
- **意図**：完全に覚えているので、次回復習までの間隔を大きく延ばす
- `ease = max(MIN_EASE, current_ease + EASE_INCREASE)`
- `interval_days = ceil(current_interval * new_ease * 1.2)`
- `due_at = now + interval_days * 24h`
- `focus_until = null`（Focus Reviewから解除）

#### HARD（あいまい）
- **意図**：少し難しかったので、間隔を控えめにし、Focus Reviewに追加
- `ease = max(MIN_EASE, current_ease - EASE_DECREASE)`
- `interval_days = max(1, ceil(current_interval * new_ease * 0.8))`
- `due_at = now + interval_days * 24h`
- `hard_count += 1`
- `focus_until = today + 5日`（Focus Reviewに追加）

#### AGAIN（無理）
- **意図**：覚えられなかったので、翌日再出題し、同セッション内でも再登場させる
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
- `updateSRS(currentState, grade)`: SRS更新ロジック（focus_until更新含む）
- `generateReviewQueue()`: due_at <= now のカードを抽出して出題順を作る
- `updateCardState(cardId, updates)`: カード状態を更新してDBに保存
- `getDueCards(limit?)`: 復習期限が来たカードを取得
- `getFocusCards(limit?)`: Focus Review用のカードを取得

### app/review/page.tsx

実装内容：
- **カード表→裏→評価(EASY/HARD/AGAIN)→次へ**のフロー
- **表面**：繁體 + 拼音 + 日本語 + SpeakButton（hanzi_tradを読み上げ）
- **裏面**：例文 + よくある返答候補 + 台湾言い換えメモ + SpeakButton（example_tradを読み上げ）
- **AGAINカードの同セッション内再出題**（最大3回まで）
- **進捗表示**（現在位置 / 総数）
- **DB保存**：評価ボタンクリック時に即座にDBに保存

### lib/srs.test.ts

テスト内容：
- ✅ 新規カードの作成（EASY/HARD/AGAIN）
- ✅ 既存カードの更新（EASY/HARD/AGAIN）
- ✅ Edgeケース：
  - AGAIN連打でeaseがMIN_EASE以下にならない
  - EASY連打でintervalが増加する
  - due_atが正しく更新される
  - HARD評価でintervalが1未満にならない
- ✅ focus_until更新：
  - EASYでfocus_untilがnullになる
  - HARDでfocus_untilが今日+5日に設定される
  - AGAINでfocus_untilが今日+2日に設定される

**テスト結果**: ✅ 13 tests passed

## 受け入れ条件の確認

✅ **3ボタンで due_at/interval/ease が更新されDBに保存される**
- `updateSRS()`で更新ロジック実装
- `updateCardState()`でDBに保存
- 評価ボタンクリック時に即座に保存

✅ **AGAINカードが同セッションで再登場する**
- `app/review/page.tsx`で実装
- キュー末尾に再追加、最大3回まで（`MAX_SESSION_RETRY`）
- `sessionRetryCount`で管理

✅ **focus_untilが更新される**
- `updateSRS()`内で実装
- AGAIN → today + 2日
- HARD → today + 5日
- EASY → null

✅ **SpeakButtonで読み上げできる**
- 表面：hanzi_trad
- 裏面：example_trad
- `components/SpeakButton.tsx`を使用

✅ **テストが通る**
- Vitestでユニットテスト実装
- 更新式とedgeケースを検証
- **13 tests passed**

## 実行手順

```bash
# テスト実行
npm test

# 開発サーバー起動
npm run dev
```

ブラウザで [http://localhost:3000/review](http://localhost:3000/review) を開いて復習機能を確認

## 実装のポイント

1. **SRS更新ロジックの一貫性**
   - 軽量Anki風の実装
   - ease factorベースの間隔計算
   - 各評価で適切な更新式を適用

2. **同日再出題の実装**
   - AGAINカードをキュー末尾に再追加
   - `sessionRetryCount`で無限ループ防止
   - 最大3回まで再出題

3. **Focus Review連携**
   - focus_untilを適切に更新
   - AGAIN/HARDでFocus Reviewに追加
   - EASYでFocus Reviewから解除

4. **音声機能の統合**
   - 表面・裏面それぞれでSpeakButtonを配置
   - hanzi_tradとexample_tradを読み上げ

5. **テストカバレッジ**
   - 新規カード、既存カードの更新
   - Edgeケース（連打、境界値）
   - focus_until更新の検証

