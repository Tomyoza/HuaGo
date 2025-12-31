import { db } from './db';
import type { CardWithState, DailyStats } from './types';

/**
 * 連続学習日数を計算
 */
export async function getStreakDays(): Promise<number> {
  const stats = await db.dailyStats.orderBy('date').reverse().toArray();
  if (stats.length === 0) return 0;

  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let currentDate = new Date(today);

  for (const stat of stats) {
    const statDate = new Date(stat.date);
    if (statDate.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]) {
      // 今日のデータがある場合
      if (stat.review_count + stat.new_count + stat.conversation_count + stat.quiz_count > 0) {
        streak++;
      }
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break; // 日付が連続していない
    }
  }

  return streak;
}

/**
 * 総復習数を計算
 */
export async function getTotalReviews(): Promise<number> {
  const states = await db.userCardStates.where('last_reviewed_at').notEqual(null).toArray();
  return states.length;
}

/**
 * 総習得数を計算（last_grade == 'EASY'）
 */
export async function getTotalMastered(): Promise<number> {
  const states = await db.userCardStates.where('last_grade').equals('EASY').toArray();
  return states.length;
}

/**
 * 弱点タグ（AGAIN率高いscene, grammar_pattern, confusion_group）
 */
export interface WeaknessTag {
  type: 'scene' | 'grammar_pattern' | 'confusion_group';
  value: string;
  againRate: number;
  totalCards: number;
  againCards: number;
}

export async function getWeaknessTags(limit: number = 5): Promise<WeaknessTag[]> {
  const allStates = await db.userCardStates.toArray();
  const cardIds = allStates.map(s => s.card_id);
  const cards = await db.cards.bulkGet(cardIds);

  const tagStats: Record<string, { total: number; again: number }> = {};

  for (let i = 0; i < allStates.length; i++) {
    const state = allStates[i];
    const card = cards[i];
    if (!card) continue;

    const isAgain = state.last_grade === 'AGAIN';

    // scene
    card.tags.forEach(tag => {
      if (tag.scene) {
        const key = `scene:${tag.scene}`;
        if (!tagStats[key]) tagStats[key] = { total: 0, again: 0 };
        tagStats[key].total++;
        if (isAgain) tagStats[key].again++;
      }
      if (tag.grammar_pattern) {
        const key = `grammar_pattern:${tag.grammar_pattern}`;
        if (!tagStats[key]) tagStats[key] = { total: 0, again: 0 };
        tagStats[key].total++;
        if (isAgain) tagStats[key].again++;
      }
    });

    // confusion_group
    if (card.confusion_group_id) {
      const key = `confusion_group:${card.confusion_group_id}`;
      if (!tagStats[key]) tagStats[key] = { total: 0, again: 0 };
      tagStats[key].total++;
      if (isAgain) tagStats[key].again++;
    }
  }

  const weaknesses: WeaknessTag[] = [];
  for (const [key, stat] of Object.entries(tagStats)) {
    if (stat.total >= 3) { // 最低3枚以上
      const rate = stat.again / stat.total;
      const [type, value] = key.split(':');
      weaknesses.push({
        type: type as 'scene' | 'grammar_pattern' | 'confusion_group',
        value,
        againRate: rate,
        totalCards: stat.total,
        againCards: stat.again,
      });
    }
  }

  return weaknesses
    .sort((a, b) => b.againRate - a.againRate)
    .slice(0, limit);
}

/**
 * 苦手カードTop（lapse_count高い）
 */
export async function getWeakCards(limit: number = 10): Promise<CardWithState[]> {
  const states = await db.userCardStates
    .where('lapse_count')
    .above(0)
    .sortBy('lapse_count')
    .reverse()
    .then(states => states.slice(0, limit));

  const cardIds = states.map(s => s.card_id);
  const cards = await db.cards.bulkGet(cardIds);

  const result: CardWithState[] = [];
  for (let i = 0; i < states.length; i++) {
    const state = states[i];
    const card = cards[i];
    if (card) {
      result.push({ card, state });
    }
  }

  return result;
}

/**
 * 弱点復習パック生成（10枚）
 */
export async function generateWeaknessPack(): Promise<CardWithState[]> {
  const weaknesses = await getWeaknessTags(3); // Top3弱点

  const candidates: CardWithState[] = [];

  for (const weakness of weaknesses) {
    let states: any[] = [];

    if (weakness.type === 'confusion_group') {
      // confusion_groupの場合
      const cards = await db.cards.where('confusion_group_id').equals(weakness.value).toArray();
      const cardIds = cards.map(c => c.id);
      states = await db.userCardStates.where('card_id').anyOf(cardIds).toArray();
    } else {
      // scene or grammar_pattern
      const allCards = await db.cards.toArray();
      const filteredCards = allCards.filter(card =>
        card.tags.some(tag =>
          (weakness.type === 'scene' && tag.scene === weakness.value) ||
          (weakness.type === 'grammar_pattern' && tag.grammar_pattern === weakness.value)
        )
      );
      const cardIds = filteredCards.map(c => c.id);
      states = await db.userCardStates.where('card_id').anyOf(cardIds).toArray();
    }

    // AGAIN優先
    const againStates = states.filter(s => s.last_grade === 'AGAIN');
    const otherStates = states.filter(s => s.last_grade !== 'AGAIN');

    const selectedStates = [...againStates, ...otherStates].slice(0, 4); // 各弱点から4枚

    const cardIds = selectedStates.map(s => s.card_id);
    const cards = await db.cards.bulkGet(cardIds);

    for (let i = 0; i < selectedStates.length; i++) {
      const state = selectedStates[i];
      const card = cards[i];
      if (card) {
        candidates.push({ card, state });
      }
    }
  }

  // シャッフルして10枚
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  return candidates.slice(0, 10);
}