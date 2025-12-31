# Step4 実装完了レポート

## 実装内容

### lib/learn.ts

新規学習用のロジックを実装。

#### 主要関数

1. **`getUnlearnedCards(filter?)`**
   - 未学習カードを取得
   - UserCardStateが存在しないCardを抽出
   - フィルタ（scene/politeness/grammar_pattern）で絞り込み

2. **`getAvailableScenes()`**
   - 利用可能なシーン（sceneタグ）を取得

3. **`getTodayNewCount()`**
   - 今日の新規学習数を取得

4. **`getNewCardLimit()`**
   - 新規上限を取得（設定から、デフォルト5）

5. **`setNewCardLimit(limit)`**
   - 新規上限を設定（1〜10の範囲）

6. **`canLearnNewCards()`**
   - 今日の新規学習が可能かチェック

### app/learn/page.tsx

新規学習ページを実装。

#### フロー

1. **シーン選択**
   - 利用可能なシーン（sceneタグ）を選択
   - 未学習カードをフィルタリング

2. **想起ステップ（recall）**
   - 日本語だけ表示（ja_meaning）
   - 3秒カウントダウンタイマー
   - 「答えを見る」ボタンでスキップ可能

3. **表示ステップ（reveal）**
   - hanzi_trad + pinyin を表示
   - SpeakButtonでhanzi_tradを読み上げ可能
   - 例文も表示

4. **評価ステップ（grade）**
   - EASY/HARD/AGAINで評価
   - UserCardState作成（初回値含む）→SRSへ投入
   - 次のカードへ、または完了

#### 機能

- **新規上限管理**：今日の進捗を表示、上限到達時に停止
- **想起ステップ必須**：必ず3秒想起を挟む
- **音声機能**：hanzi_tradをSpeakButtonで読み上げ
- **進捗表示**：現在位置 / 総数、今日の進捗

### app/page.tsx（Today）

新規ブロック機能を追加。

#### 機能

- **復習が溜まっている日は新規0**
  - dueが20枚以上なら/learn導線を無効
  - 「復習優先」メッセージを表示

- **新規上限到達時**
  - 「上限到達」メッセージを表示
  - /learn導線を無効

- **新規学習可能時**
  - 通常のリンクとして機能

### app/settings/page.tsx

新規上限設定を追加。

#### 機能

- **新規学習上限設定**
  - 1日あたりの上限を設定（1〜10枚）
  - デフォルト5枚
  - リアルタイムで保存

## 受け入れ条件の確認

✅ **新規上限が効く**
- `getNewCardLimit()`で設定を取得
- `getTodayNewCount()`で今日の学習数を取得
- 上限到達時に学習を停止
- settingsページで上限を変更可能

✅ **想起ステップが必ず挟まる**
- ステップ1: 日本語だけ表示（ja_meaning）→3秒想起
- ステップ2: hanzi_trad + pinyin を表示
- ステップ3: 評価（EASY/HARD/AGAIN）

✅ **学習後、SRS対象として保存される**
- `updateSRS(null, grade)`で新規カードの状態を生成
- `updateCardState()`でDBに保存
- UserCardStateが作成され、SRS対象となる

✅ **SpeakButtonが使える**
- revealステップでhanzi_tradを読み上げ可能

✅ **復習が溜まっている日は新規0**
- Todayページでdueが20枚以上なら新規ブロック
- 「復習優先」メッセージを表示

## 実装のポイント

1. **未学習カードの定義**
   - UserCardStateが存在しないCard
   - `getUnlearnedCards()`で抽出

2. **想起ステップの実装**
   - 3秒カウントダウンタイマー
   - 必ず想起を挟むフロー

3. **新規上限管理**
   - 1日デフォルト5、設定で最大10
   - 今日の進捗をリアルタイムで表示

4. **復習優先ロジック**
   - dueが20枚以上なら新規ブロック
   - 復習を優先させる仕組み

5. **シーン選択**
   - sceneタグでフィルタリング
   - コース（シーン）単位で学習可能

## 実行手順

```bash
# 開発サーバー起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて：
1. Todayページで新規学習ボタンをクリック
2. シーンを選択
3. 想起ステップ（3秒）→表示ステップ→評価
4. 新規上限到達時に停止
5. settingsページで新規上限を変更可能

