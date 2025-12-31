# SRS（間隔反復）仕様

## 更新式

### 基本パラメータ
- `INITIAL_EASE = 2.5`（新規カードの初期ease）
- `MIN_EASE = 1.3`（easeの最小値）
- `EASE_INCREASE = 0.1`（EASY時のease増加）
- `EASE_DECREASE = 0.15`（HARD/AGAIN時のease減少）

### 評価別の更新ロジック

#### EASY（覚えた）
- `ease = max(MIN_EASE, current_ease + EASE_INCREASE)`
- `interval_days = ceil(current_interval * new_ease * 1.2)`
- `due_at = now + interval_days * 24h`
- `focus_until = null`（Focus解除）

#### HARD（あいまい）
- `ease = max(MIN_EASE, current_ease - EASE_DECREASE)`
- `interval_days = max(1, ceil(current_interval * new_ease * 0.8))`
- `due_at = now + interval_days * 24h`
- `hard_count += 1`
- `focus_until = today + 5日`（Focus Reviewに追加）

#### AGAIN（無理）
- `ease = max(MIN_EASE, current_ease - EASE_DECREASE * 2)`
- `interval_days = 1`（翌日再出題）
- `due_at = now + 1日`
- `lapse_count += 1`
- `again_count += 1`
- `focus_until = today + 2日`（Focus Reviewに追加）
- **同セッション内で再登場**（キュー末尾に再追加、最大3回まで）

### 新規カード
- `ease = INITIAL_EASE`
- `interval_days = EASYなら4日、それ以外は1日`
- `due_at = now + interval_days * 24h`

## 同日再出題

### AGAINカードの再出題
- AGAIN評価時、同セッション内で再登場させる
- キュー末尾に再追加
- 無限ループ防止：同一カードの再追加回数は最大3回まで

### 再出題制限
- セッション内で同一カードが3回以上再追加されないようにする
- カウンターで管理：`session_retry_count`

## Focus Review

### focus_until更新
- **AGAIN**: `focus_until = today + 2日`
- **HARD**: `focus_until = today + 5日`
- **EASY**: `focus_until = null`（Focus解除）

## キュー生成

### 復習キュー
- `due_at <= now` のカードを抽出
- `due_at` の昇順でソート
- AGAINカードは末尾に再追加（制限あり）

