// Today ページ（メイン）
'use client';

import Link from 'next/link';
import { minutesToCards } from '@/lib/focus';
import { useTodaySummary } from '@/lib/hooks/useTodaySummary';
import PrimaryActionCard from '@/components/PrimaryActionCard';

export default function TodayPage() {
  const summary = useTodaySummary();

  return (
    <main className="min-h-screen p-4 space-y-6">
      <h1 className="text-2xl font-bold">今日の学習</h1>

      {/* メインアクションカード */}
      <div className="space-y-4">
        <PrimaryActionCard
          title={`復習: ${summary.dueCount}枚`}
          description="期限が来たカードを復習しましょう"
          href="/review"
          icon="📚"
        />
        <PrimaryActionCard
          title={`新規学習: 残り${summary.newRemaining}枚`}
          description={`今日の上限: ${summary.newLimit}枚`}
          href="/learn"
          icon="📖"
          disabled={summary.newRemaining === 0}
        />
        <PrimaryActionCard
          title="会話ドリル"
          description="実践的な会話練習をしましょう"
          href="/conversation"
          icon="💬"
        />
      </div>

      {/* Focus Review */}
      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Focus Review</h2>
        <p className="text-sm text-gray-600 mb-4">
          HARD: {summary.focusHard}枚 / AGAIN: {summary.focusAgain}枚
        </p>
        <div className="grid grid-cols-3 gap-2">
          <Link
            href={`/focus?minutes=3`}
            className="p-3 bg-yellow-50 rounded text-center hover:bg-yellow-100 transition-colors"
          >
            Focus 3分<br />
            <span className="text-xs text-gray-600">({minutesToCards(3)}枚)</span>
          </Link>
          <Link
            href={`/focus?minutes=7`}
            className="p-3 bg-yellow-50 rounded text-center hover:bg-yellow-100 transition-colors"
          >
            Focus 7分<br />
            <span className="text-xs text-gray-600">({minutesToCards(7)}枚)</span>
          </Link>
          <Link
            href={`/focus?minutes=15`}
            className="p-3 bg-yellow-50 rounded text-center hover:bg-yellow-100 transition-colors"
          >
            Focus 15分<br />
            <span className="text-xs text-gray-600">({minutesToCards(15)}枚)</span>
          </Link>
        </div>
      </section>

      {/* 今日の進捗 */}
      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">今日の進捗</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full ${summary.checklist.review ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            <span>復習</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full ${summary.checklist.learn ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            <span>新規学習</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full ${summary.checklist.speak ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            <span>会話ドリル</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            連続学習日数: <span className="font-semibold">{summary.streakDays}日</span>
          </p>
        </div>
      </section>

      {/* ナビゲーション */}
      <nav className="grid grid-cols-2 gap-2">
        <Link href="/quiz" className="p-4 bg-orange-50 rounded text-center hover:bg-orange-100 transition-colors">
          1分クイズ
        </Link>
        <Link href="/insights" className="p-4 bg-indigo-50 rounded text-center hover:bg-indigo-100 transition-colors">
          インサイト
        </Link>
        <Link href="/test" className="p-4 bg-pink-50 rounded text-center hover:bg-pink-100 transition-colors">
          レベル測定
        </Link>
        <Link href="/settings" className="p-4 bg-gray-50 rounded text-center hover:bg-gray-100 transition-colors">
          設定
        </Link>
      </nav>
    </main>
  );
}

