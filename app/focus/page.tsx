// Focus Review ページ
'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import FilterChips from '@/components/FilterChips';
import FlashCard from '@/components/FlashCard';
import GradeButtons from '@/components/GradeButtons';
import ProgressPills from '@/components/ProgressPills';
import SessionComplete from '@/components/SessionComplete';
import { useFocusQueue } from '@/lib/hooks/useFocusQueue';

export default function FocusPage() {
  const [mode, setMode] = useState('all');
  const { card, flipped, remaining, isComplete, flip, grade, resetReview } = useFocusQueue(mode);

  const filters = [
    { label: 'All', active: mode === 'all', onClick: () => setMode('all') },
    { label: 'Hard', active: mode === 'hard', onClick: () => setMode('hard') },
    { label: 'Again', active: mode === 'again', onClick: () => setMode('again') },
  ];

  // Completion State
  if (isComplete) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col">
        <PageHeader title="Focus Review" showBack backHref="/" />
        <div className="flex-1 flex flex-col">
          <SessionComplete 
            title="Focus Session Done!"
            subtitle="You've reviewed your difficult cards."
            onRestart={resetReview}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col pb-24">
      <PageHeader title="Focus Review" showBack backHref="/" />

      <div className="flex-1 flex flex-col px-4 pt-4 pb-2 w-full max-w-md mx-auto h-full">
        {/* Top Controls */}
        <div className="space-y-4 mb-4">
          <div className="flex justify-between items-center">
            <FilterChips filters={filters} />
            <ProgressPills current={remaining} total={remaining} label="Left" />
          </div>
        </div>

        {/* Card Area - Flex grow to fill space */}
        <div className="flex-1 flex flex-col justify-center min-h-0 mb-6">
          {card ? (
            <div className="h-full max-h-[60vh] flex flex-col">
              <FlashCard 
                card={card} 
                side={flipped ? 'back' : 'front'} 
                onFlip={flip} 
              />
            </div>
          ) : (
             <div className="flex-1 flex items-center justify-center">
               <div className="animate-pulse flex flex-col items-center">
                 <div className="h-64 w-48 bg-gray-200 rounded-2xl mb-4"></div>
                 <div className="h-4 w-32 bg-gray-200 rounded"></div>
               </div>
             </div>
          )}
        </div>

        {/* Controls Area - Fixed at bottom of content flow */}
        <div className="mt-auto">
          {flipped ? (
            <GradeButtons onGrade={grade} />
          ) : (
            <button
              onClick={flip}
              disabled={!card}
              className="w-full h-14 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 active:scale-95 transition-all disabled:opacity-50"
            >
              Show Answer
            </button>
          )}
        </div>
      </div>
    </main>
  );
}