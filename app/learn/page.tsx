// 新規学習ページ
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUnlearnedCards, getAvailableScenes, getTodayNewCount, getNewCardLimit, canLearnNewCards } from '@/lib/learn';
import { updateSRS, updateCardState } from '@/lib/srs';
import type { Card, Grade } from '@/lib/types';
import SpeakButton from '@/components/SpeakButton';

type LearnStep = 'select' | 'recall' | 'reveal' | 'grade';

export default function LearnPage() {
  const [step, setStep] = useState<LearnStep>('select');
  const [selectedScene, setSelectedScene] = useState<string>('');
  const [availableScenes, setAvailableScenes] = useState<string[]>([]);
  const [unlearnedCards, setUnlearnedCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [recallTimer, setRecallTimer] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [todayCount, setTodayCount] = useState(0);
  const [limit, setLimit] = useState(5);
  const [canLearn, setCanLearn] = useState(true);

  // 初期化
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const scenes = await getAvailableScenes();
      setAvailableScenes(scenes);
      
      const count = await getTodayNewCount();
      setTodayCount(count);
      
      const cardLimit = await getNewCardLimit();
      setLimit(cardLimit);
      
      const canLearnNew = await canLearnNewCards();
      setCanLearn(canLearnNew);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // シーン選択
  const handleSelectScene = async (scene: string) => {
    setSelectedScene(scene);
    setIsLoading(true);
    try {
      const cards = await getUnlearnedCards({ scene });
      setUnlearnedCards(cards);
      setCurrentCardIndex(0);
      setStep('recall');
      startRecallTimer();
    } catch (error) {
      console.error('Failed to load cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 想起タイマー開始
  const startRecallTimer = () => {
    setRecallTimer(3);
    const interval = setInterval(() => {
      setRecallTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setStep('reveal');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 評価ボタンをクリック
  const handleGrade = async (grade: Grade) => {
    if (!unlearnedCards[currentCardIndex]) return;

    const card = unlearnedCards[currentCardIndex];
    const updates = updateSRS(null, grade); // 新規カードなのでnull
    
    // DBに保存
    await updateCardState(card.id, updates);

    // 次のカードへ
    const nextIndex = currentCardIndex + 1;
    const newTodayCount = todayCount + 1;
    setTodayCount(newTodayCount);
    
    // 上限チェック
    if (newTodayCount >= limit) {
      setCanLearn(false);
    }
    
    if (nextIndex < unlearnedCards.length && newTodayCount < limit) {
      setCurrentCardIndex(nextIndex);
      setStep('recall');
      startRecallTimer();
    } else {
      // 学習完了または上限到達
      if (newTodayCount >= limit) {
        alert('今日の新規学習上限に到達しました。');
      } else {
        alert('新規学習完了！');
      }
      setStep('select');
      setUnlearnedCards([]);
      loadData();
    }
  };

  const currentCard = unlearnedCards[currentCardIndex];
  const remaining = limit - todayCount;

  if (isLoading && step === 'select') {
    return (
      <main className="min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">新規学習</h1>
        <p>読み込み中...</p>
      </main>
    );
  }

  if (!canLearn && step === 'select') {
    return (
      <main className="min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">新規学習</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800">
            今日の新規学習上限（{limit}枚）に到達しました。明日また学習できます。
          </p>
        </div>
        <Link href="/" className="text-blue-600 hover:underline">← Todayに戻る</Link>
      </main>
    );
  }

  if (step === 'select') {
    return (
      <main className="min-h-screen p-4">
        <div className="mb-4">
          <Link href="/" className="text-blue-600 hover:underline">← Todayに戻る</Link>
        </div>
        <h1 className="text-2xl font-bold mb-6">新規学習</h1>
        
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            今日の進捗: {todayCount} / {limit}枚（残り{remaining}枚）
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">シーンを選択</h2>
          {availableScenes.length === 0 ? (
            <p className="text-gray-600">利用可能なシーンがありません</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {availableScenes.map(scene => (
                <button
                  key={scene}
                  onClick={() => handleSelectScene(scene)}
                  className="p-3 bg-gray-50 rounded hover:bg-gray-100 text-left"
                >
                  {scene}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

  if (!currentCard) {
    return (
      <main className="min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">新規学習</h1>
        <p className="text-gray-600 mb-4">学習するカードがありません</p>
        <button
          onClick={() => setStep('select')}
          className="text-blue-600 hover:underline"
        >
          ← シーン選択に戻る
        </button>
      </main>
    );
  }

  const progress = `${currentCardIndex + 1} / ${unlearnedCards.length}`;

  return (
    <main className="min-h-screen p-4 max-w-2xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => setStep('select')}
          className="text-blue-600 hover:underline"
        >
          ← シーン選択に戻る
        </button>
      </div>
      
      <div className="mb-4 text-sm text-gray-600">
        進捗: {progress} | 今日: {todayCount} / {limit}枚
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 min-h-[400px]">
        {step === 'recall' ? (
          // ステップ1: 日本語だけ表示（3秒想起）
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl font-bold mb-4">{recallTimer}</div>
              <p className="text-gray-600">秒で思い出してください</p>
            </div>
            <div className="text-3xl text-center font-bold mt-8">
              {currentCard.ja_meaning}
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() => setStep('reveal')}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                答えを見る
              </button>
            </div>
          </div>
        ) : step === 'reveal' ? (
          // ステップ2: hanzi_trad + pinyin を表示
          <div className="space-y-4">
            <div className="text-4xl font-bold text-center mb-4">
              {currentCard.hanzi_trad}
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl text-gray-700">{currentCard.pinyin}</span>
              <SpeakButton text={currentCard.hanzi_trad} />
            </div>
            <div className="text-xl text-center text-gray-600 mb-4">
              {currentCard.ja_meaning}
            </div>
            
            {currentCard.example_trad && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">例文</h3>
                <div className="text-lg">{currentCard.example_trad}</div>
                <div className="text-gray-600">{currentCard.example_pinyin}</div>
                <div className="text-gray-600">{currentCard.example_ja}</div>
              </div>
            )}

            <div className="border-t pt-6 mt-6">
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => handleGrade('AGAIN')}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  AGAIN
                </button>
                <button
                  onClick={() => handleGrade('HARD')}
                  className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  HARD
                </button>
                <button
                  onClick={() => handleGrade('EASY')}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  EASY
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
