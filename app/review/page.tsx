'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import FilterChips from '@/components/FilterChips';
import FlashCard from '@/components/FlashCard';
import GradeButtons from '@/components/GradeButtons';
import ProgressPills from '@/components/ProgressPills';
import SessionComplete from '@/components/SessionComplete';
import { useReviewQueue } from '@/lib/hooks/useReviewQueue';

export default function ReviewPage() {
  const [filter, setFilter] = useState('all');
  const { card, flipped, remaining, total, flip, grade } = useReviewQueue(filter);

  const filters = [
    { label: 'All', active: filter === 'all', onClick: () => setFilter('all') },
    { label: 'Hard', active: filter === 'hard', onClick: () => setFilter('hard') },
    { label: 'Again', active: filter === 'again', onClick: () => setFilter('again') },
  ];

  // Completion State (Generic handling)
  if (!card) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col">
        <PageHeader title="Review" showBack backHref="/" />
        <div className="flex-1 flex flex-col">
           <SessionComplete 
             title="All Caught Up!" 
             subtitle="You have no more cards due for review right now." 
           />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col pb-24">
      <PageHeader title="Review" showBack backHref="/" />

      <div className="flex-1 flex flex-col px-4 pt-4 pb-2 w-full max-w-md mx-auto h-full">
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-6">
          <FilterChips filters={filters} />
          <ProgressPills current={remaining} total={total || 0} label="Due" />
        </div>

        {/* Card Area */}
        <div className="flex-1 flex flex-col justify-center min-h-0 mb-6">
           <div className="h-full max-h-[60vh] flex flex-col">
            <FlashCard 
              card={card} 
              side={flipped ? 'back' : 'front'} 
              onFlip={flip} 
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto">
            {flipped ? (
              <GradeButtons onGrade={grade} />
            ) : (
              <button
                onClick={flip}
                className="w-full h-14 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 active:scale-95 transition-all"
              >
                Show Answer
              </button>
            )}
        </div>
      </div>
    </main>
  );
}