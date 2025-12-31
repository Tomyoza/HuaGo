// Focus Review ページ
'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import FilterChips from '@/components/FilterChips';
import FlashCard from '@/components/FlashCard';
import GradeButtons from '@/components/GradeButtons';
import ProgressPills from '@/components/ProgressPills';
import { useFocusQueue } from '@/lib/hooks/useFocusQueue';

export default function FocusPage() {
  const [mode, setMode] = useState('all');
  const [limit] = useState(10); // 固定で10枚
  const { card, flipped, remaining, flip, grade } = useFocusQueue(mode, limit);

  const filters = [
    { label: 'すべて', active: mode === 'all', onClick: () => setMode('all') },
    { label: 'HARDのみ', active: mode === 'hard', onClick: () => setMode('hard') },
    { label: 'AGAINのみ', active: mode === 'again', onClick: () => setMode('again') },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <PageHeader title="Focus Review" showBack backHref="/" />

      <div className="p-4 space-y-6">
        {/* モード切替 */}
        <FilterChips filters={filters} />

        {/* 上限表示 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            今日はここまで（{limit}枚）
          </p>
        </div>

        {/* 進捗 */}
        <div className="flex justify-center">
        )}
      </div>
    </main>
  );
}
