'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import PrimaryActionCard from '@/components/PrimaryActionCard';
import FlashCard from '@/components/FlashCard';
import GradeButtons from '@/components/GradeButtons';
import { useLearnFlow } from '@/lib/hooks/useLearnFlow';

export default function LearnPage() {
  const { scenes, currentScene, currentCard, step, timeLeft, isLimitReached, selectScene, showAnswer, grade } = useLearnFlow();

  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);

  // 1. Scene Selection Screen
  if (step === 'select' || !selectedSceneId) {
    return (
      <main className="min-h-screen bg-gray-50 pb-20">
        <PageHeader title="New Learning" showBack backHref="/" />
        <div className="p-4 space-y-6 max-w-md mx-auto">
          <h2 className="text-lg font-bold text-gray-700">Select a Topic</h2>
          <div className="space-y-4">
            {scenes.map((scene) => (
              <PrimaryActionCard
                key={scene.id}
                title={scene.title}
                description={scene.description || ''}
                href="#"
                onClick={() => {
                  setSelectedSceneId(scene.id);
                  selectScene(scene.id);
                }}
                icon="📖"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // 2. Completion Screen
  if (step === 'complete' || isLimitReached) {
    return (
      <main className="min-h-screen bg-gray-50 pb-20">
        <PageHeader title="Learning Session" showBack backHref="/" />
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Great Job!</h2>
          <p className="text-gray-600 mb-8">
            {isLimitReached 
              ? "You've reached your daily limit for new cards." 
              : "You've finished the new cards for this topic!"}
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

  // 3. Learning Interface
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <PageHeader title={currentScene?.title || 'Learning'} showBack backHref="/" />

      <div className="p-4 max-w-md mx-auto space-y-6">
        {step === 'showJapanese' && currentCard && (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
               <div 
                 className="h-full bg-brand-400 transition-all duration-1000 ease-linear" 
                 style={{ width: `${(timeLeft / 3) * 100}%` }} 
               />
            </div>
            
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Meaning</span>
            <p className="text-3xl font-bold text-gray-900 mb-8 leading-relaxed">
              {currentCard.ja_meaning}
            </p>
            
            {timeLeft > 0 ? (
              <p className="text-sm font-medium text-brand-500 animate-pulse">
                Thinking... ({timeLeft})
              </p>
            ) : (
              <button
                onClick={showAnswer}
                className="mt-4 px-8 py-3 bg-brand-500 text-white font-bold rounded-full shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all"
              >
                Show Answer
              </button>
            )}
          </div>
        )}

        {step === 'showAnswer' && currentCard && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <FlashCard
              card={currentCard}
              side="back"
              onFlip={() => {}}
            />
            <div className="mt-6">
              <GradeButtons onGrade={grade} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}