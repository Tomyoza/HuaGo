// SRSフラッシュカード復習ページ
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { generateReviewQueue, updateSRS, updateCardState, MAX_SESSION_RETRY } from '@/lib/srs';
import type { CardWithState } from '@/lib/srs';
import type { Grade, UserCardState } from '@/lib/types';
import SpeakButton from '@/components/SpeakButton';

type CardSide = 'front' | 'back';

export default function ReviewPage() {
  const [queue, setQueue] = useState<CardWithState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [side, setSide] = useState<CardSide>('front');
  const [sessionRetryCount, setSessionRetryCount] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // キューを初期化
  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setIsLoading(true);
    try {
      const initialQueue = await generateReviewQueue();
      setQueue(initialQueue);
      setCurrentIndex(0);
      setSide('front');
      setSessionRetryCount({});
    } catch (error) {
      console.error('Failed to load queue:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentCard = queue[currentIndex];

  // カードを裏返す
  const flipCard = () => {
    if (side === 'front') {
      setSide('back');
    }
  };

  // 評価ボタンをクリック
  const handleGrade = async (grade: Grade) => {
    if (!currentCard) return;

    const { card, state } = currentCard;
    const updates = updateSRS(state, grade);
    
    // DBに保存
    await updateCardState(card.id, updates);

    // AGAINの場合、同セッション内で再登場させる
    let willRetry = false;
    if (grade === 'AGAIN') {
      const retryCount = sessionRetryCount[card.id] || 0;
      if (retryCount < MAX_SESSION_RETRY) {
        // キュー末尾に再追加
        const updatedState = { ...state, ...updates } as UserCardState;
        setQueue(prev => [...prev, { card, state: updatedState }]);
        setSessionRetryCount(prev => ({ ...prev, [card.id]: retryCount + 1 }));
        willRetry = true;
      }
    }

    // 次のカードへ移動
    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      // まだキューにカードがある
      setCurrentIndex(nextIndex);
      setSide('front');
    } else if (willRetry) {
      // AGAINで再追加された場合は、そのカードを表示
      // queue.lengthが更新されているので、nextIndexで表示
      setCurrentIndex(nextIndex);
      setSide('front');
    } else {
      // 復習完了
      alert('復習完了！');
      loadQueue(); // 新しいキューを読み込む
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">復習</h1>
        <p>読み込み中...</p>
      </main>
    );
  }

  if (!currentCard) {
    return (
      <main className="min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">復習</h1>
        <p className="text-gray-600 mb-4">復習するカードがありません</p>
        <Link href="/" className="text-blue-600 hover:underline">← Todayに戻る</Link>
      </main>
    );
  }

  const { card, state } = currentCard;
  const progress = `${currentIndex + 1} / ${queue.length}`;

  return (
    <main className="min-h-screen p-4 max-w-2xl mx-auto">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline">← Todayに戻る</Link>
      </div>
      
      <div className="mb-4 text-sm text-gray-600">
        進捗: {progress}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 min-h-[400px]">
        {side === 'front' ? (
          // 表面：繁體 + 拼音 + 日本語
          <div className="space-y-4">
            <div className="text-4xl font-bold text-center mb-4">
              {card.hanzi_trad}
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl text-gray-700">{card.pinyin}</span>
              <SpeakButton text={card.hanzi_trad} />
            </div>
            <div className="text-xl text-center text-gray-600">
              {card.ja_meaning}
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={flipCard}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                裏面を見る
              </button>
            </div>
          </div>
        ) : (
          // 裏面：例文 + よくある返答候補 + 台湾言い換えメモ
          <div className="space-y-4">
            <div className="text-2xl font-bold mb-2">
              {card.hanzi_trad}
            </div>
            <div className="text-lg text-gray-700 mb-2">
              {card.pinyin}
            </div>
            <div className="text-xl mb-4">
              {card.ja_meaning}
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">例文</h3>
              <div className="space-y-2">
                <div className="text-xl">{card.example_trad}</div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{card.example_pinyin}</span>
                  <SpeakButton text={card.example_trad} />
                </div>
                <div className="text-gray-600">{card.example_ja}</div>
              </div>
            </div>

            {card.reply_options && card.reply_options.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">よくある返答候補</h3>
                <ul className="list-disc list-inside space-y-1">
                  {card.reply_options.map((reply, idx) => (
                    <li key={idx} className="text-gray-700">{reply}</li>
                  ))}
                </ul>
              </div>
            )}

            {card.tw_note && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">台湾言い換えメモ</h3>
                <p className="text-gray-700">{card.tw_note}</p>
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
        )}
      </div>
    </main>
  );
}
