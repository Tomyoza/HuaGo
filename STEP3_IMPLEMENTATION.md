# Step3 実装完了レポート

## 実装内容

### lib/focus.ts

Focus Review用のキュー生成・並び替え機能を実装。

#### 主要関数

1. **`getFocusCandidates(filter)`**
   - Focus Review対象のカードを抽出
   - `focus_until >= now` のカードを取得
   - フィルタ（ALL/HARD/AGAIN）で絞り込み

2. **`calculatePriority(cardWithState)`**
   - 優先度スコアを計算
   - 1) AGAIN優先（AGAIN = 1000点、HARD = 500点）
   - 2) lapse_count多い（1回 = 10点）
   - 3) due_atが過ぎている（1日 = 1点）

3. **`shuffleConfusionGroups(cards)`**
   - 同一confusion_group_idが連続しすぎないように並び替え
   - 同じconfusion_group_idが2回以上連続しないように調整
   - ラウンドロビン方式で各グループから順番に取り出す

4. **`generateFocusQueue(filter, limit)`**
   - Focus Reviewキューを生成
   - 優先度順にソート
   - confusion_group_idが連続しすぎないように並び替え
   - 上限で切り詰め

5. **`minutesToCards(minutes)`**
   - 分数から枚数に換算
   - 3分 = 10枚、7分 = 20枚、15分 = 30枚

### app/focus/page.tsx

Focus Reviewページを実装。

#### 機能

- **フィルタ**：HARDのみ / AGAINのみ / 両方
- **対象抽出**：`focus_until >= now` のカード
- **優先度**：AGAIN優先 → lapse_count多い → due_atが過ぎている
- **並び替え**：同一confusion_group_idが連続しにくい
- **1日上限**：枚数上限（デフォルト30枚、URLパラメータで指定可能）
- **上限到達時**：「今日はここまで」で停止、残りは翌日に回す
- **音声**：hanzi_trad / example_trad をSpeakButtonで読み上げ
- **評価**：EASY/HARD/AGAINで評価（reviewページと同じフロー）

#### URLパラメータ

- `?minutes=3` → 10枚
- `?minutes=7` → 20枚
- `?minutes=15` → 30枚
- `?limit=30` → 直接枚数指定

### app/page.tsx（Today）

Focus Reviewボタンを追加。

#### 追加内容

- **Focus 3分**ボタン（10枚）
- **Focus 7分**ボタン（20枚）
- **Focus 15分**ボタン（30枚）
- 各ボタンから`/focus?minutes=X`に遷移

## 受け入れ条件の確認

✅ **Focus対象だけ回せる**
- `getFocusCandidates()`で`focus_until >= now`のカードを抽出
- フィルタでHARD/AGAINのみに絞り込み可能

✅ **上限で止まる**
- `limit`パラメータで上限を設定
- 上限到達時に「今日はここまで」メッセージ表示
- 残りは翌日に回す（キューから除外）

✅ **Todayから起動できる**
- Todayページに「Focus 3/7/15分」ボタンを追加
- 各ボタンから`/focus?minutes=X`に遷移

✅ **confusion_groupが連続しにくい**
- `shuffleConfusionGroups()`で並び替え
- 同じconfusion_group_idが2回以上連続しないように調整
- ラウンドロビン方式で各グループから順番に取り出す

✅ **音声機能**
- 表面：hanzi_tradをSpeakButtonで読み上げ
- 裏面：example_tradをSpeakButtonで読み上げ

## 実装のポイント

1. **優先度計算**
   - AGAINを最優先（1000点）
   - lapse_countが多いほど優先
   - due_atが過ぎているほど優先

2. **confusion_group連続回避**
   - ラウンドロビン方式で各グループから順番に取り出す
   - 同じグループが2回連続したら、別のグループを優先

3. **上限管理**
   - URLパラメータで分数または枚数を指定
   - 上限到達時に明確なメッセージを表示

4. **フィルタ機能**
   - ALL/HARD/AGAINの3つのフィルタ
   - リアルタイムでフィルタ切り替え可能

## 実行手順

```bash
# 開発サーバー起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて：
1. Todayページで「Focus 3/7/15分」ボタンをクリック
2. Focus Reviewページで復習開始
3. フィルタでHARD/AGAINを切り替え可能
4. 上限到達時に「今日はここまで」メッセージ表示

