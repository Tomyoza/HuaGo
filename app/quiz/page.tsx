// Quiz ページ
'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import SpeakButton from '@/components/SpeakButton';
import { useQuizFlow } from '@/lib/hooks/useQuizFlow';

export default function QuizPage() {
  const { 
    questions, 
    currentQuestion, 
    step, 
    timeLeft, 
    isCorrect, 
    score, 
    isComplete, 
    startRecall, 
    submitAnswer, 
    nextQuestion 
  } = useQuizFlow();

  const [input, setInput] = useState('');

  if (isComplete) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col">
        <PageHeader title="クイズ完了" showBack backHref="/" />

        <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">クイズ完了！</h2>
            <div className="text-lg space-y-2 text-gray-600">
              <p>正答: <span className="font-bold text-green-600">{score.correct}</span></p>
              <p>誤答: <span className="font-bold text-red-500">{score.wrong}</span></p>
              <p>再出題: {score.retry}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // データ読み込み中の待機画面
  if (!currentQuestion) {
    return (
      <main className="min-h-screen bg-gray-50">
        <PageHeader title="1分クイズ" showBack backHref="/" />
        <div className="p-4 flex justify-center items-center h-[60vh]">
          <div className="animate-pulse text-gray-400">Loading cards...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader title="1分クイズ" showBack backHref="/" />

      <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-6 max-w-md mx-auto w-full">
        {step === 'showQuestion' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center w-full">
            <span className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-2 block">Meaning</span>
            {/* 修正箇所1: japanese -> ja_meaning */}
            <p className="text-3xl font-bold text-gray-800 mb-8 leading-relaxed">
              {currentQuestion.ja_meaning}
            </p>
            <button
              onClick={startRecall}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95"
            >
              想起開始
            </button>
          </div>
        )}

        {step === 'recall' && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center w-full">
            <div className="text-8xl font-black text-blue-600 mb-4 tabular-nums">
              {timeLeft}
            </div>
            <p className="text-gray-500 font-medium">秒で思い出してください</p>
          </div>
        )}

        {step === 'input' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full">
            {/* 修正箇所2: japanese -> ja_meaning */}
            <p className="text-lg font-medium text-gray-600 mb-4 text-center">
              {currentQuestion.ja_meaning}
            </p>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl mb-6 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="答えを入力 (繁体字)"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  submitAnswer(input);
                  setInput('');
                }
              }}
            />
            <button
              onClick={() => {
                submitAnswer(input);
                setInput('');
              }}
              className="w-full py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:bg-green-700 transition-all active:scale-95"
            >
              判定
            </button>
          </div>
        )}

        {step === 'result' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center w-full">
            <div className={`text-5xl font-black mb-6 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? '正解！' : '不正解'}
            </div>
            
            <div className="mb-8">
              {/* 修正箇所3: answer -> hanzi_trad */}
              <p className="text-4xl font-bold text-gray-900 mb-2">{currentQuestion.hanzi_trad}</p>
              <div className="flex justify-center items-center gap-2">
                <span className="text-xl text-blue-600 font-medium">{currentQuestion.pinyin}</span>
                {/* 修正箇所4: answer -> hanzi_trad */}
                <SpeakButton text={currentQuestion.hanzi_trad} />
              </div>
            </div>

            <button
              onClick={nextQuestion}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95"
            >
              次へ
            </button>
          </div>
        )}
      </div>
    </main>
  );
}