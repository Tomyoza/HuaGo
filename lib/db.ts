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

    // version 2: cardsにhanzi_trad, confusion_group_idインデックス追加
    this.version(2).stores({
      cards: 'id, hanzi_trad, confusion_group_id, created_at',
    });

    // version 3: userCardStatesにcreated_atインデックス追加
    this.version(3).stores({
      userCardStates: 'card_id, due_at, focus_until, created_at',
    });
  }
}

export const db = new HuaGoDB();
