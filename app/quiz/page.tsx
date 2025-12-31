// Quiz ページ
'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import SpeakButton from '@/components/SpeakButton';
import { useQuizFlow } from '@/lib/hooks/useQuizFlow';

export default function QuizPage() {
  const { questions, currentQuestion, step, timeLeft, userInput, isCorrect, score, isComplete, startRecall, submitAnswer, nextQuestion, finish } = useQuizFlow();

  const [input, setInput] = useState('');

  if (isComplete) {
    return (
      <main className="min-h-screen bg-gray-50">
        <PageHeader title="クイズ完了" showBack backHref="/" />

        <div className="p-4 space-y-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-bold mb-4">クイズ完了！</h2>
            <div className="text-lg">
              <p>正答: {score.correct}</p>
              <p>誤答: {score.wrong}</p>
              <p>再出題: {score.retry}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <PageHeader title="1分クイズ" showBack backHref="/" />

      <div className="p-4 space-y-6">
        {step === 'showQuestion' && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-2xl mb-4">{currentQuestion.japanese}</p>
            <button
              onClick={startRecall}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              想起開始
            </button>
          </div>
        )}

        {step === 'recall' && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-6xl font-bold mb-4">{timeLeft}</p>
            <p className="text-gray-600">秒で思い出してください</p>
          </div>
        )}

        {step === 'input' && (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-xl mb-4">{currentQuestion.japanese}</p>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-3 border rounded mb-4"
              placeholder="答えを入力"
            />
            <button
              onClick={() => {
                submitAnswer(input);
                setInput('');
              }}
              className="w-full px-4 py-2 bg-green-500 text-white rounded"
            >
              判定
            </button>
          </div>
        )}

        {step === 'result' && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className={`text-4xl font-bold mb-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? '正解！' : '不正解'}
            </p>
            <p className="text-2xl mb-4">{currentQuestion.answer}</p>
            <SpeakButton text={currentQuestion.answer} />
            <button
              onClick={nextQuestion}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              次へ
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

