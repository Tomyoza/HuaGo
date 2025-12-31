// 会話テンプレートからSRSカードを自動生成

import { db } from './db';
import { updateSRS, updateCardState } from './srs';
import type { ConversationTemplate, KeyPhrase, Grade } from './types';

/**
 * 会話テンプレートのキーフレーズからSRSカードを生成して登録
 * @param template 会話テンプレート
 * @param defaultGrade デフォルトの評価（EASY/HARD/AGAIN）
 */
export async function generateCardsFromTemplate(
  template: ConversationTemplate,
  defaultGrade: Grade = 'EASY'
): Promise<void> {
  if (!template.key_phrases || template.key_phrases.length === 0) {
    return;
  }

  const now = Date.now();

  for (const phrase of template.key_phrases) {
    // カードIDを生成（重複チェック用）
    const cardId = `conv-${template.id}-${phrase.hanzi_trad}-${now}`;
    
    // 同じhanzi_tradのカードが既に存在するかチェック
    const existingCards = await db.cards
      .where('hanzi_trad')
      .equals(phrase.hanzi_trad)
      .toArray();
    
    if (existingCards.length > 0) {
      // 既に存在する場合はスキップ
      continue;
    }

    // カードを作成
    await db.cards.add({
      id: cardId,
      hanzi_trad: phrase.hanzi_trad,
      pinyin: phrase.pinyin,
      ja_meaning: phrase.ja_meaning,
      example_trad: phrase.example_trad,
      example_pinyin: phrase.example_pinyin,
      example_ja: phrase.example_ja,
      tags: [
        {
          scene: template.scene,
        },
      ],
      reply_options: phrase.reply_options,
      tw_note: phrase.tw_note,
      created_at: now,
    });

    // UserCardStateを作成（SRSに投入）
    const updates = updateSRS(null, defaultGrade);
    await updateCardState(cardId, updates);
  }
}

