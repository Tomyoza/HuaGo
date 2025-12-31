'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import PrimaryActionCard from '@/components/PrimaryActionCard';
import FlashCard from '@/components/FlashCard';
import GradeButtons from '@/components/GradeButtons';
import SessionComplete from '@/components/SessionComplete';
import { useLearnFlow } from '@/lib/hooks/useLearnFlow';

export default function LearnPage() {
  const { scenes, currentScene, currentCard, step, timeLeft, isLimitReached, selectScene, showAnswer, grade } = useLearnFlow();
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);

  // 1. Scene Selection
  if (step === 'select' || !selectedSceneId) {
    return (
      <main className="min-h-screen bg-gray-50 pb-24">
        <PageHeader title="New Learning" showBack backHref="/" />
        <div className="p-4 space-y-6 max-w-md mx-auto">
          <h2 className="text-lg font-bold text-gray-700 px-1">Select a Topic</h2>
          <div className="space-y-3">
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

  // 2. Completion
  if (step === 'complete' || isLimitReached) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col">
        <PageHeader title="Learning Session" showBack backHref="/" />
        <div className="flex-1 flex flex-col">
          <SessionComplete 
            title={isLimitReached ? "Daily Limit Reached" : "Topic Completed!"}
            subtitle={isLimitReached 
              ? "You've learned your daily quota of new words. Come back tomorrow!" 
              : "You've finished the new cards for this topic!"}
          />
        </div>
      </main>
    );
  }

  // 3. Learning Interface
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col pb-24">
      <PageHeader title={currentScene?.title || 'Learning'} showBack backHref="/" />

      <div className="flex-1 flex flex-col px-4 pt-4 pb-2 w-full max-w-md mx-auto">
        
        {/* Card Area */}
        <div className="flex-1 flex flex-col justify-center mb-6">
          {step === 'showJapanese' && currentCard && (
            <div className="relative w-full aspect-[3/4] max-h-[60vh] bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center justify-center p-8 text-center overflow-hidden mx-auto">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                <div 
                  className="h-full bg-brand-500 transition-all duration-1000 ease-linear" 
                  style={{ width: `${(timeLeft / 3) * 100}%` }} 
                />
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Meaning</span>
                <p className="text-3xl md:text-4xl font-bold text-gray-900 leading-relaxed break-words w-full">
                  {currentCard.ja_meaning}
                </p>
              </div>

              <div className="h-16 flex items-center justify-center w-full">
                 {timeLeft > 0 ? (
                  <p className="text-sm font-medium text-brand-500 animate-pulse flex items-center gap-2">
                    Thinking... <span className="text-lg font-bold">{timeLeft}</span>
                  </p>
                ) : (
                  <button
                    onClick={showAnswer}
                    className="w-full py-4 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-2"
                  >
                    Show Answer
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 'showAnswer' && currentCard && (
            <div className="h-full max-h-[60vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
              <FlashCard
                card={currentCard}
                side="back"
                onFlip={() => {}}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-auto min-h-[5rem]">
           {step === 'showAnswer' && (
              <GradeButtons onGrade={grade} />
           )}
        </div>
      </div>
    </main>
  );
}