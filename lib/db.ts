import Dexie, { Table } from 'dexie';
import type { 
  Card, 
  UserCardState, 
  ConversationTemplate, 
  Assessment, 
  DailyStats,
  AppSettings 
} from './types';

export class HuaGoDB extends Dexie {
  cards!: Table<Card, string>;
  userCardStates!: Table<UserCardState, string>;
  conversationTemplates!: Table<ConversationTemplate, string>;
  assessments!: Table<Assessment, string>;
  dailyStats!: Table<DailyStats, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super('HuaGoDB');
    
    this.version(1).stores({
      cards: 'id, created_at',
      userCardStates: 'card_id, due_at, focus_until',
      conversationTemplates: 'id, scene, created_at',
      assessments: 'id, completed_at',
      dailyStats: 'date',
      settings: 'key',
    });
  }
}

export const db = new HuaGoDB();
