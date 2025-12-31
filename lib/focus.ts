// Focus Review用のキュー生成・並び替え

import { db } from './db';
import type { Card, UserCardState } from './types';
import type { CardWithState } from './srs';

export type FocusFilter = 'ALL' | 'HARD' | 'AGAIN';

/**
 * Focus Review対象のカードを抽出
 * - last_gradeがHARD/AGAIN、または focus_until >= now
 */
export async function getFocusCandidates(filter: FocusFilter = 'ALL'): Promise<CardWithState[]> {
  const now = Date.now();
  
  // focus_until >= now のカードを取得
  const focusStates = await db.userCardStates
    .where('focus_until')
    .aboveOrEqual(now)
    .toArray();

  // フィルタリング
  let filteredStates: UserCardState[] = [];
  
  switch (filter) {
    case 'HARD':
      filteredStates = focusStates.filter(s => s.last_grade === 'HARD');
      break;
    case 'AGAIN':
      filteredStates = focusStates.filter(s => s.last_grade === 'AGAIN');
      break;
    case 'ALL':
    default:
      filteredStates = focusStates.filter(s => 
        s.last_grade === 'HARD' || s.last_grade === 'AGAIN'
      );
      break;
  }

  // カード情報を取得
  const cardIds = filteredStates.map(s => s.card_id);
  const cards = await db.cards.bulkGet(cardIds);

  // カードと状態を結合
  const candidates: CardWithState[] = [];
  for (let i = 0; i < filteredStates.length; i++) {
    const state = filteredStates[i];
    const card = cards[i];
    if (card) {
      candidates.push({ card, state });
    }
  }

  return candidates;
}

/**
 * 優先度スコアを計算
 * 1) AGAIN優先（AGAIN = 1000点、HARD = 500点）
 * 2) lapse_count多い（1回 = 10点）
 * 3) due_atが過ぎている（1日 = 1点）
 */
function calculatePriority(cardWithState: CardWithState): number {
  const { state } = cardWithState;
  const now = Date.now();
  
  let score = 0;
  
  // AGAIN優先
  if (state.last_grade === 'AGAIN') {
    score += 1000;
  } else if (state.last_grade === 'HARD') {
    score += 500;
  }
  
  // lapse_count多い
  score += state.lapse_count * 10;
  
  // due_atが過ぎている
  if (state.due_at < now) {
    const daysOverdue = Math.floor((now - state.due_at) / (24 * 60 * 60 * 1000));
    score += daysOverdue;
  }
  
  return score;
}

/**
 * 同一confusion_group_idが連続しすぎないように並び替え
 * 同じconfusion_group_idが2回以上連続しないようにする
 */
function shuffleConfusionGroups(cards: CardWithState[]): CardWithState[] {
  if (cards.length === 0) return cards;
  
  const result: CardWithState[] = [];
  const groups: Record<string, CardWithState[]> = {};
  const noGroup: CardWithState[] = [];
  
  // confusion_group_idでグループ化
  for (const item of cards) {
    const groupId = item.card.confusion_group_id;
    if (groupId) {
      if (!groups[groupId]) {
        groups[groupId] = [];
      }
      groups[groupId].push(item);
    } else {
      noGroup.push(item);
    }
  }
  
  const groupKeys = Object.keys(groups);
  const groupIndices: Record<string, number> = {};
  groupKeys.forEach(key => { groupIndices[key] = 0; });
  
  let lastGroupId: string | null = null;
  let consecutiveCount = 0;
  
  // ラウンドロビン方式で各グループから順番に取り出す
  while (result.length < cards.length) {
    let added = false;
    
    // 同じグループが2回連続したら、別のグループを優先的に探す
    if (consecutiveCount >= 2 && lastGroupId) {
      for (const groupId of groupKeys) {
        if (groupId !== lastGroupId && groupIndices[groupId] < groups[groupId].length) {
          const item = groups[groupId][groupIndices[groupId]++];
          result.push(item);
          lastGroupId = groupId;
          consecutiveCount = 1;
          added = true;
          break;
        }
      }
    }
    
    // 通常の処理：各グループから順番に取り出す
    if (!added) {
      for (const groupId of groupKeys) {
        if (groupIndices[groupId] < groups[groupId].length) {
          const item = groups[groupId][groupIndices[groupId]++];
          result.push(item);
          
          if (lastGroupId === groupId) {
            consecutiveCount++;
          } else {
            consecutiveCount = 1;
            lastGroupId = groupId;
          }
          added = true;
          break;
        }
      }
    }
    
    // グループがないカードを追加
    if (!added && noGroup.length > 0) {
      result.push(noGroup.shift()!);
      lastGroupId = null;
      consecutiveCount = 0;
      added = true;
    }
    
    // すべてのグループが空になったら、残りのnoGroupを追加
    if (!added) {
      while (noGroup.length > 0) {
        result.push(noGroup.shift()!);
      }
      break;
    }
  }
  
  return result;
}

/**
 * Focus Reviewキューを生成
 * @param filter フィルタ（ALL/HARD/AGAIN）
 * @param limit 上限枚数（デフォルト30枚）
 * @returns 並び替え済みのカードと状態のペアの配列
 */
export async function generateFocusQueue(
  filter: FocusFilter = 'ALL',
  limit: number = 30
): Promise<CardWithState[]> {
  // 対象カードを取得
  const candidates = await getFocusCandidates(filter);
  
  if (candidates.length === 0) {
    return [];
  }
  
  // 優先度順にソート
  const sorted = candidates.sort((a, b) => {
    const scoreA = calculatePriority(a);
    const scoreB = calculatePriority(b);
    return scoreB - scoreA; // 降順
  });
  
  // confusion_group_idが連続しすぎないように並び替え
  const shuffled = shuffleConfusionGroups(sorted);
  
  // 上限で切り詰め
  return shuffled.slice(0, limit);
}

/**
 * 分数から枚数に換算
 * @param minutes 分数（3/7/15）
 * @returns 枚数（10/20/30）
 */
export function minutesToCards(minutes: number): number {
  switch (minutes) {
    case 3:
      return 10;
    case 7:
      return 20;
    case 15:
      return 30;
    default:
      return 30; // デフォルト
  }
}

