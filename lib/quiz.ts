import { db } from './db';
import type { CardWithState } from './srs';

/**
 * クイズキュー生成
 * 今日学んだ新規カード + 最近HARD/AGAIN を混ぜる
 */
export async function generateQuizQueue(): Promise<CardWithState[]> {
  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartMs = todayStart.getTime();
  const todayEndMs = todayStartMs + 24 * 60 * 60 * 1000;

  // 今日学んだ新規カードを取得
  const todayNewStates = await db.userCardStates
    .where('created_at')
    .between(todayStartMs, todayEndMs, true, false)
    .toArray();

  // 最近HARD/AGAINを取得（focus_until >= now）
  const recentHardAgainStates = await db.userCardStates
    .where('focus_until')
    .aboveOrEqual(now)
    .and(state => state.last_grade === 'HARD' || state.last_grade === 'AGAIN')
    .toArray();

  // すべての対象state
  const allStates = [...todayNewStates, ...recentHardAgainStates];

  // 重複除去（同じcard_idは1つ）
  const uniqueStates = allStates.filter((state, index, self) =>
    index === self.findIndex(s => s.card_id === state.card_id)
  );

  // カード情報を取得
  const cardIds = uniqueStates.map(s => s.card_id);
  const cards = await db.cards.bulkGet(cardIds);

  // カードと状態を結合
  const queue: CardWithState[] = [];
  for (let i = 0; i < uniqueStates.length; i++) {
    const state = uniqueStates[i];
    const card = cards[i];
    if (card) {
      queue.push({ card, state });
    }
  }

  // シャッフル
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }

  return queue;
}