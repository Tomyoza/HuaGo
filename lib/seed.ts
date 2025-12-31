// 初回起動時に seed.json を投入

import { db } from './db';
import type { Card, ConversationTemplate } from './types';
import seedData from '../seed.json';

const SEED_FLAG_KEY = 'seed_completed';

export async function seedDatabase(): Promise<void> {
  // 既にseed済みかチェック
  const seedFlag = await db.settings.get(SEED_FLAG_KEY);
  if (seedFlag?.value === 'true') {
    console.log('Seed data already loaded');
    return;
  }

  try {
    // cards を投入
    if (seedData.cards && Array.isArray(seedData.cards)) {
      await db.cards.bulkPut(seedData.cards as Card[]);
      console.log(`Seeded ${seedData.cards.length} cards`);
    }

    // conversationTemplates を投入
    if (seedData.templates && Array.isArray(seedData.templates)) {
      await db.conversationTemplates.bulkPut(seedData.templates as ConversationTemplate[]);
      console.log(`Seeded ${seedData.templates.length} templates`);
    }

    // seed済みフラグを設定
    await db.settings.put({
      key: SEED_FLAG_KEY,
      value: 'true',
    });

    console.log('Seed data loaded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

