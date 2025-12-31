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
  const { card, flipped, remaining, isComplete, flip, grade, resetReview } = useFocusQueue(mode);

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
            進捗: {remaining > 0 ? remaining + '枚残り' : 'すべて完了'}
          </p>
        </div>

        {/* 進捗 */}
        <div className="flex justify-center">
          <ProgressPills remaining={remaining} />
        </div>

        {/* フラッシュカード */}
        {isComplete ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-green-900 mb-4">完了しました！🎉</h2>
            <p className="text-green-700 mb-6">Focus Reviewを終了しました。</p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              トップに戻る
            </button>
          </div>
        ) : card ? (
          <>
            <div onClick={flip}>
              <FlashCard card={card} side={flipped ? 'back' : 'front'} onFlip={flip} />
            </div>
            <GradeButtons onGrade={grade} />
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">カードを読み込み中...</p>
          </div>
        )}
      </div>
    </main>
  );
}
