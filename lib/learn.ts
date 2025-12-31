// 新規学習用のロジック

import { db } from './db';
import type { Card } from './types';

/**
 * 未学習カードを取得
 * UserCardStateが存在しないCard
 */
export async function getUnlearnedCards(filter?: {
  scene?: string;
  politeness?: string;
  grammar_pattern?: string;
}): Promise<Card[]> {
  // すべてのカードを取得
  const allCards = await db.cards.toArray();
  
  // すべてのUserCardStateを取得
  const allStates = await db.userCardStates.toArray();
  const learnedCardIds = new Set(allStates.map(s => s.card_id));
  
  // 未学習カードを抽出
  let unlearnedCards = allCards.filter(card => !learnedCardIds.has(card.id));
  
  // フィルタリング
  if (filter) {
    unlearnedCards = unlearnedCards.filter(card => {
      if (filter.scene && !card.tags.some(t => t.scene === filter.scene)) {
        return false;
      }
      if (filter.politeness && !card.tags.some(t => t.politeness === filter.politeness)) {
        return false;
      }
      if (filter.grammar_pattern && !card.tags.some(t => t.grammar_pattern === filter.grammar_pattern)) {
        return false;
      }
      return true;
    });
  }
  
  return unlearnedCards;
}

/**
 * 利用可能なシーン（sceneタグ）を取得
 */
export async function getAvailableScenes(): Promise<string[]> {
  const cards = await db.cards.toArray();
  const scenes = new Set<string>();
  
  for (const card of cards) {
    for (const tag of card.tags) {
      if (tag.scene) {
        scenes.add(tag.scene);
      }
    }
  }
  
  return Array.from(scenes).sort();
}

/**
 * 今日の新規学習数を取得
 */
export async function getTodayNewCount(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();
  const todayEnd = todayStart + 24 * 60 * 60 * 1000;
  
  const states = await db.userCardStates
    .where('created_at')
    .between(todayStart, todayEnd, true, false)
    .toArray();
  
  return states.length;
}

/**
 * 新規上限を取得（設定から、デフォルト5）
 */
export async function getNewCardLimit(): Promise<number> {
  const setting = await db.settings.get('new_card_limit');
  if (setting) {
    const limit = parseInt(setting.value, 10);
    if (!isNaN(limit) && limit >= 1 && limit <= 10) {
      return limit;
    }
  }
  return 5; // デフォルト
}

/**
 * 新規上限を設定
 */
export async function setNewCardLimit(limit: number): Promise<void> {
  if (limit < 1 || limit > 10) {
    throw new Error('新規上限は1〜10の範囲で設定してください');
  }
  await db.settings.put({
    key: 'new_card_limit',
    value: limit.toString(),
  });
}

/**
 * 今日の新規学習が可能かチェック
 */
export async function canLearnNewCards(): Promise<boolean> {
  const todayCount = await getTodayNewCount();
  const limit = await getNewCardLimit();
  return todayCount < limit;
}

