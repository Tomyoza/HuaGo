// Export/Import 機能

import { db } from './db';
import type { Card, UserCardState, ConversationTemplate, Assessment, DailyStats, AppSettings } from './types';

export interface ExportData {
  cards: Card[];
  userCardStates: UserCardState[];
  templates: ConversationTemplate[];
  assessments: Assessment[];
  stats: DailyStats[];
  settings: AppSettings[];
  exportedAt: number;
}

// Export: 全データをJSONで取得
export async function exportData(): Promise<ExportData> {
  const [cards, userCardStates, templates, assessments, stats, settings] = await Promise.all([
    db.cards.toArray(),
    db.userCardStates.toArray(),
    db.conversationTemplates.toArray(),
    db.assessments.toArray(),
    db.dailyStats.toArray(),
    db.settings.toArray(),
  ]);

  return {
    cards,
    userCardStates,
    templates,
    assessments,
    stats,
    settings,
    exportedAt: Date.now(),
  };
}

// Export: JSONファイルとしてダウンロード
export async function exportToFile(): Promise<void> {
  const data = await exportData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `huago-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import: JSONファイルから復元
export async function importFromFile(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const data: ExportData = JSON.parse(text);

        // データを上書きで投入
        if (data.cards && Array.isArray(data.cards)) {
          await db.cards.clear();
          await db.cards.bulkPut(data.cards);
        }

        if (data.userCardStates && Array.isArray(data.userCardStates)) {
          await db.userCardStates.clear();
          await db.userCardStates.bulkPut(data.userCardStates);
        }

        if (data.templates && Array.isArray(data.templates)) {
          await db.conversationTemplates.clear();
          await db.conversationTemplates.bulkPut(data.templates);
        }

        if (data.assessments && Array.isArray(data.assessments)) {
          await db.assessments.clear();
          await db.assessments.bulkPut(data.assessments);
        }

        if (data.stats && Array.isArray(data.stats)) {
          await db.dailyStats.clear();
          await db.dailyStats.bulkPut(data.stats);
        }

        if (data.settings && Array.isArray(data.settings)) {
          await db.settings.clear();
          await db.settings.bulkPut(data.settings);
        }

        console.log('Import completed successfully');
        resolve();
      } catch (error) {
        console.error('Error importing data:', error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

