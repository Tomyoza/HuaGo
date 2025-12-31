// Learn ページ
'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import PrimaryActionCard from '@/components/PrimaryActionCard';
import FlashCard from '@/components/FlashCard';
import GradeButtons from '@/components/GradeButtons';
import SpeakButton from '@/components/SpeakButton';
import { useLearnFlow } from '@/lib/hooks/useLearnFlow';

export default function LearnPage() {
  const { scenes, currentScene, currentCard, step, timeLeft, isLimitReached, selectScene, showAnswer, grade, nextCard } = useLearnFlow();

  const [selectedSceneId, setSelectedSceneId] = useState<number | null>(null);

  if (step === 'select' || !selectedSceneId) {
    return (
      <main className="min-h-screen bg-gray-50">
        <PageHeader title="新規学習" showBack backHref="/" />

        <div className="p-4 space-y-6">
          <h2 className="text-lg font-semibold">コースを選択</h2>
          <div className="space-y-4">
            {scenes.map((scene) => (
              <PrimaryActionCard
                key={scene.id}
                title={scene.title}
                description={scene.description}
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

  if (isLimitReached) {
    return (
      <main className="min-h-screen bg-gray-50">
        <PageHeader title="新規学習" showBack backHref="/" />

        <div className="p-4 space-y-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-bold mb-4">学習完了！</h2>
            <p className="text-gray-600 mb-4">今日の上限に達しました。</p>
            <p className="text-sm text-gray-500">明日続きを学習しましょう。</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <PageHeader title={`学習: ${currentScene.title}`} showBack backHref="/" />

      <div className="p-4 space-y-6">
        {step === 'showJapanese' && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-2xl mb-4">{currentCard.japanese}</p>
            <p className="text-sm text-gray-500">答えを表示まで: {timeLeft}秒</p>
            <button
              onClick={showAnswer}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              答えを表示
            </button>
          </div>
        )}

        {step === 'showAnswer' && (
          <>
            <FlashCard
              card={{
                front: currentCard.japanese,
                back: `${currentCard.traditional} (${currentCard.pinyin})`,
              }}
              side="back"
              onFlip={() => {}}
            />
            <div className="flex justify-center">
              <SpeakButton text={currentCard.traditional} />
            </div>
            <GradeButtons onGrade={grade} />
          </>
        )}
      </div>
    </main>
  );
}
