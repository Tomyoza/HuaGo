// Today ページ（メイン）
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDueCards } from '@/lib/srs';
import { minutesToCards } from '@/lib/focus';
import { getTodayNewCount, getNewCardLimit, canLearnNewCards } from '@/lib/learn';
import SpeakButton from '@/components/SpeakButton';

const REVIEW_BLOCK_THRESHOLD = 20; // 復習がこれ以上溜まっていたら新規ブロック

export default function TodayPage() {
  const [dueCount, setDueCount] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [canLearn, setCanLearn] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // 今日の復習数と新規数を取得
    Promise.all([
      getDueCards(),
      getTodayNewCount(),
      canLearnNewCards(),
    ]).then(([states, todayCount, canLearnNew]) => {
      setDueCount(states.length);
      setNewCount(todayCount);
      setCanLearn(canLearnNew);
      // 復習が溜まっている日は新規ブロック
      setIsBlocked(states.length >= REVIEW_BLOCK_THRESHOLD);
    });
  }, []);

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">今日の学習</h1>
      
      <div className="space-y-4">
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">毎日15分ループ</h2>
          <div className="space-y-2">
            <div>
              <Link href="/review" className="block p-3 bg-blue-50 rounded">
                復習: {dueCount}枚
              </Link>
            </div>
            <div>
              {isBlocked ? (
                <div className="block p-3 bg-gray-100 rounded opacity-50 cursor-not-allowed">
                  新規: ブロック中（復習優先）
                  <span className="text-xs block text-gray-500 mt-1">
                    復習が{REVIEW_BLOCK_THRESHOLD}枚以上あるため新規学習は無効です
                  </span>
                </div>
              ) : !canLearn ? (
                <div className="block p-3 bg-gray-100 rounded opacity-50 cursor-not-allowed">
                  新規: 上限到達
                  <span className="text-xs block text-gray-500 mt-1">
                    今日の新規学習上限に到達しました
                  </span>
                </div>
              ) : (
                <Link href="/learn" className="block p-3 bg-green-50 rounded hover:bg-green-100">
                  新規: {newCount}枚
                </Link>
              )}
            </div>
            <div>
              <Link href="/conversation" className="block p-3 bg-purple-50 rounded">
                会話ドリル
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">音声テスト</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span>你好 (nǐ hǎo)</span>
              <SpeakButton text="你好" />
            </div>
            <div className="flex items-center gap-2">
              <span>謝謝 (xiè xie)</span>
              <SpeakButton text="謝謝" />
            </div>
            <div className="flex items-center gap-2">
              <span>不好意思 (bù hǎo yì si)</span>
              <SpeakButton text="不好意思" />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Focus Review</h2>
          <div className="grid grid-cols-3 gap-2">
            <Link 
              href={`/focus?minutes=3`}
              className="p-3 bg-yellow-50 rounded text-center hover:bg-yellow-100"
            >
              Focus 3分<br />
              <span className="text-xs text-gray-600">({minutesToCards(3)}枚)</span>
            </Link>
            <Link 
              href={`/focus?minutes=7`}
              className="p-3 bg-yellow-50 rounded text-center hover:bg-yellow-100"
            >
              Focus 7分<br />
              <span className="text-xs text-gray-600">({minutesToCards(7)}枚)</span>
            </Link>
            <Link 
              href={`/focus?minutes=15`}
              className="p-3 bg-yellow-50 rounded text-center hover:bg-yellow-100"
            >
              Focus 15分<br />
              <span className="text-xs text-gray-600">({minutesToCards(15)}枚)</span>
            </Link>
          </div>
        </section>

        <nav className="grid grid-cols-2 gap-2">
          <Link href="/quiz" className="p-4 bg-orange-50 rounded text-center">
            1分クイズ
          </Link>
          <Link href="/insights" className="p-4 bg-indigo-50 rounded text-center">
            インサイト
          </Link>
          <Link href="/test" className="p-4 bg-pink-50 rounded text-center">
            レベル測定
          </Link>
        </nav>
      </div>
    </main>
  );
}

