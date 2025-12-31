// Review ページ
'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import FilterChips from '@/components/FilterChips';
import FlashCard from '@/components/FlashCard';
import GradeButtons from '@/components/GradeButtons';
import ProgressPills from '@/components/ProgressPills';
import { useReviewQueue } from '@/lib/hooks/useReviewQueue';

export default function ReviewPage() {
  const [filter, setFilter] = useState('all');
  const { card, flipped, remaining, flip, grade } = useReviewQueue(filter);

  const filters = [
    { label: 'すべて', active: filter === 'all', onClick: () => setFilter('all') },
    { label: 'HARDのみ', active: filter === 'hard', onClick: () => setFilter('hard') },
    { label: 'AGAINのみ', active: filter === 'again', onClick: () => setFilter('again') },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <PageHeader title="復習" showBack backHref="/" />

      <div className="p-4 space-y-6">
        {/* フィルタ */}
        <FilterChips filters={filters} />

        {/* 進捗 */}
        <div className="flex justify-center">
          <ProgressPills current={remaining} total={10} label="残り" />
        </div>

        {/* カード */}
        <FlashCard card={card} side={flipped ? 'back' : 'front'} onFlip={flip} />

        {/* 評価ボタン（裏面時のみ） */}
        {flipped && (
          <GradeButtons onGrade={grade} />
        )}
      </div>
    </main>
  );
}
