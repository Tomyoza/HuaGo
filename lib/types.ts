// データモデル型定義

export type Grade = 'EASY' | 'HARD' | 'AGAIN';

export interface Card {
  id: string;
  hanzi_trad: string; // 繁體中文
  pinyin: string;
  ja_meaning: string; // 日本語意味
  example_trad: string; // 例文（繁體）
  example_pinyin: string; // 例文（拼音）
  example_ja: string; // 例文（日本語）
  tags: Array<{
    scene?: string;
    politeness?: string;
    grammar_pattern?: string;
  }>;
  confusion_group_id?: string; // 混同グループ
  reply_options?: string[]; // よくある返答候補
  tw_note?: string; // 台湾言い換えメモ
  created_at: number;
}

export interface UserCardState {
  card_id: string;
  ease: number; // SRS ease factor
  interval_days: number; // 次回復習までの日数
  due_at: number; // 次回復習日時（timestamp）
  last_grade: Grade | null;
  lapse_count: number; // AGAIN回数
  again_count: number;
  hard_count: number;
  focus_until: number | null; // Focus Review期限（timestamp）
  last_reviewed_at: number | null;
  created_at: number;
}

export interface ConversationTemplate {
  id: string;
  scene: string; // シーン名
  nodes: ConversationNode[];
  branches: ConversationBranch[];
  followup_suggestions: string[];
  key_phrases?: KeyPhrase[]; // キーフレーズ（SRSカード生成用）
  created_at: number;
}

export interface ConversationNode {
  id: string;
  speaker: 'user' | 'partner';
  text_trad: string;
  text_pinyin: string;
  text_ja: string;
  prompt_text_trad?: string; // プロンプト用の繁體（表示用）
  prompt_pinyin?: string; // プロンプト用の拼音
  prompt_ja?: string; // プロンプト用の日本語説明（短く）
  followup_suggestions?: string[]; // 追加の一言
}

export interface ConversationBranch {
  from_node_id: string;
  to_node_id: string;
  condition?: string;
  user_response?: string; // ユーザーの返答選択肢
}

export interface KeyPhrase {
  hanzi_trad: string; // キー文（繁體）
  pinyin: string;
  ja_meaning: string; // 日本語意味
  example_trad: string; // 例文（繁體）
  example_pinyin: string; // 例文（拼音）
  example_ja: string; // 例文（日本語）
  reply_options?: string[]; // 返答候補
  tw_note?: string; // 言い換えメモ
}

export interface Assessment {
  id: string;
  question_bank: AssessmentQuestion[];
  results: {
    cefr: string; // A1, A2, B1, B2, C1, C2
    tocfl: string; // 1, 2, 3, 4, 5, 6
  };
  skill_breakdown: {
    listening: number;
    reading: number;
    speaking: number;
    writing: number;
  };
  plan_recommendation: string[];
  completed_at: number;
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'translation' | 'listening' | 'reading' | 'speaking' | 'vocab';
  question?: string; // 質問文（reading用）
  text?: string; // テキスト（reading/speaking用）
  text_to_read?: string; // 読み上げテキスト（listening/speaking用）
  word?: string; // 単語（vocab用）
  options?: string[]; // 選択肢
  correct_answer: string;
  difficulty: number;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  review_count: number;
  new_count: number;
  conversation_count: number;
  quiz_count: number;
  streak_days: number;
}

export interface AppSettings {
  key: string;
  value: string;
}

