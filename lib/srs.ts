import type { Grade, UserCardState, Card } from './types';
import { db } from './db';

// SRS（間隔反復）アルゴリズム
// 軽量Anki風の実装

export const INITIAL_EASE = 2.5;
export const MIN_EASE = 1.3;
export const EASE_DECREASE = 0.15;
export const EASE_INCREASE = 0.1;
export const MAX_SESSION_RETRY = 3; // 同セッション内の最大再出題回数

// 今日の日付（時刻部分を0にしたもの）を取得
function getTodayStart(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

// 日数をミリ秒に変換
function daysToMs(days: number): number {
  return days * 24 * 60 * 60 * 1000;
}

/**
 * SRS更新ロジック
 * @param currentState 現在のカード状態（nullの場合は新規カード）
 * @param grade 評価（EASY/HARD/AGAIN）
 * @returns 更新後のカード状態（部分オブジェクト）
 */
export function updateSRS(
  currentState: UserCardState | null,
  grade: Grade
): Partial<UserCardState> {
  const now = Date.now();
  const todayStart = getTodayStart();
  
  if (!currentState) {
    // 新規カード
    return {
      ease: INITIAL_EASE,
      interval_days: grade === 'EASY' ? 4 : 1,
      due_at: now + daysToMs(grade === 'EASY' ? 4 : 1),
      last_grade: grade,
      lapse_count: grade === 'AGAIN' ? 1 : 0,
      again_count: grade === 'AGAIN' ? 1 : 0,
      hard_count: grade === 'HARD' ? 1 : 0,
      last_reviewed_at: now,
      focus_until: grade === 'AGAIN' 
        ? todayStart + daysToMs(2)
        : grade === 'HARD'
        ? todayStart + daysToMs(5)
        : null,
    };
  }

  let newEase = currentState.ease;
  let newInterval = currentState.interval_days;
  let newLapseCount = currentState.lapse_count;
  let newAgainCount = currentState.again_count;
  let newHardCount = currentState.hard_count;
  let newFocusUntil: number | null = null;

  switch (grade) {
    case 'EASY':
      // EASY：interval増、ease微増
      newEase = Math.max(MIN_EASE, currentState.ease + EASE_INCREASE);
      newInterval = Math.ceil(currentState.interval_days * newEase * 1.2);
      newFocusUntil = null; // Focus解除
      break;
    case 'HARD':
      // HARD：interval控えめ、ease微減、hard_count+1
      newEase = Math.max(MIN_EASE, currentState.ease - EASE_DECREASE);
      newInterval = Math.max(1, Math.ceil(currentState.interval_days * newEase * 0.8));
      newHardCount += 1;
      newFocusUntil = todayStart + daysToMs(5); // Focus Reviewに追加（5日後まで）
      break;
    case 'AGAIN':
      // AGAIN：interval短く、ease下げ、lapse_count+1、again_count+1
      newEase = Math.max(MIN_EASE, currentState.ease - EASE_DECREASE * 2);
      newInterval = 1; // 翌日再出題
      newLapseCount += 1;
      newAgainCount += 1;
      newFocusUntil = todayStart + daysToMs(2); // Focus Reviewに追加（2日後まで）
      break;
  }

  return {
    ease: newEase,
    interval_days: newInterval,
    due_at: now + daysToMs(newInterval),
    last_grade: grade,
    lapse_count: newLapseCount,
    again_count: newAgainCount,
    hard_count: newHardCount,
    focus_until: newFocusUntil,
    last_reviewed_at: now,
  };
}

/**
 * 復習期限が来たカードを取得
 */
export function getDueCards(limit?: number): Promise<UserCardState[]> {
  const now = Date.now();
  return db.userCardStates
    .where('due_at')
    .belowOrEqual(now)
    .sortBy('due_at')
    .then(states => limit ? states.slice(0, limit) : states);
}

/**
 * Focus Review用のカードを取得
 */
export function getFocusCards(limit?: number): Promise<UserCardState[]> {
  const now = Date.now();
  return db.userCardStates
    .where('focus_until')
    .above(now)
    .and(state => 
      state.last_grade === 'HARD' || 
      state.last_grade === 'AGAIN' ||
      state.lapse_count > 0
    )
    .sortBy('focus_until')
    .then(states => limit ? states.slice(0, limit) : states);
}

/**
 * カードと状態を結合した型
 */
export interface CardWithState {
  card: Card;
  state: UserCardState;
}

/**
 * SRSキュー生成：due_at <= now のカードを抽出して出題順を作る
 * @returns カードと状態のペアの配列
 */
export async function generateReviewQueue(): Promise<CardWithState[]> {
  const dueStates = await getDueCards();
  const cards = await db.cards.bulkGet(dueStates.map(s => s.card_id));
  
  const queue: CardWithState[] = [];
  for (let i = 0; i < dueStates.length; i++) {
    const state = dueStates[i];
    const card = cards[i];
    if (card) {
      queue.push({ card, state });
    }
  }
  
  return queue;
}

/**
 * カード状態を更新してDBに保存
 */
export async function updateCardState(
  cardId: string,
  updates: Partial<UserCardState>
): Promise<void> {
  const existing = await db.userCardStates.get(cardId);
  if (existing) {
    await db.userCardStates.update(cardId, updates);
  } else {
    // 新規作成
    const now = Date.now();
    await db.userCardStates.add({
      card_id: cardId,
      ease: INITIAL_EASE,
      interval_days: 1,
      due_at: now,
      last_grade: null,
      lapse_count: 0,
      again_count: 0,
      hard_count: 0,
      focus_until: null,
      last_reviewed_at: null,
      created_at: now,
      ...updates,
    } as UserCardState);
  }
}

