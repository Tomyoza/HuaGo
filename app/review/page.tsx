'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import FilterChips from '@/components/FilterChips';
import FlashCard from '@/components/FlashCard';
import GradeButtons from '@/components/GradeButtons';
import ProgressPills from '@/components/ProgressPills';
import { useReviewQueue } from '@/lib/hooks/useReviewQueue';

export default function ReviewPage() {
  const [filter, setFilter] = useState('all');
  const { card, flipped, remaining, total, flip, grade } = useReviewQueue(filter);

  const filters = [
    { label: 'All', active: filter === 'all', onClick: () => setFilter('all') },
    { label: 'Hard', active: filter === 'hard', onClick: () => setFilter('hard') },
    { label: 'Again', active: filter === 'again', onClick: () => setFilter('again') },
  ];

  // If no card is available, show completion screen
  if (!card) {
    return (
      <main className="min-h-screen bg-gray-50 pb-20">
        <PageHeader title="Review" showBack backHref="/" />
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">All Caught Up!</h2>
          <p className="text-gray-600 mb-8">
            You have no more cards to review right now.
          </p>
          
          <Link 
            href="/" 
            className="flex w-full items-center justify-center rounded-xl bg-brand-500 py-4 text-center font-bold text-white shadow-lg transition-all hover:bg-brand-600 active:scale-95"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <PageHeader title="Review" showBack backHref="/" />

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Filters */}
        <FilterChips filters={filters} />

        {/* Progress */}
        <div className="flex justify-center">
          <ProgressPills current={remaining} total={total || 10} label="Remaining" />
        </div>

        {/* Card Area */}
        <div className="min-h-[420px]">
            <FlashCard 
              card={card} 
              side={flipped ? 'back' : 'front'} 
              onFlip={flip} 
            />
        </div>

        {/* Action Buttons */}
        <div className="h-20">
            {flipped ? (
            <GradeButtons onGrade={grade} />
            ) : (
             <p className="text-center text-gray-400 text-sm mt-4">
                Tap card to flip
             </p>
            )}
        </div>
      </div>
    </main>
  );
}