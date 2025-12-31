'use client';

import Link from 'next/link';
import { minutesToCards } from '@/lib/focus';
import { useTodaySummary } from '@/lib/hooks/useTodaySummary';
import PrimaryActionCard from '@/components/PrimaryActionCard';

export default function TodayPage() {
  const summary = useTodaySummary();

  return (
    <main className="min-h-screen pb-24">
      {/* Header Section */}
      <div className="bg-white pt-8 pb-6 px-4 rounded-b-3xl shadow-sm border-b border-gray-100">
        <div className="max-w-md mx-auto">
          <p className="text-gray-500 text-sm font-medium mb-1">Welcome back</p>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">今天的學習</h1>
          <p className="text-brand-600 font-medium mt-2">
            🔥 {summary.streakDays} Day Streak
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-8 mt-2">
        
        {/* Priority Actions */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Daily Tasks</h2>
          <PrimaryActionCard
            title="Review Session"
            description={`${summary.dueCount} cards due for review`}
            href="/review"
            icon="📝"
            color="brand"
          />
          <PrimaryActionCard
            title="New Material"
            description={`${summary.newRemaining} new cards remaining today`}
            href="/learn"
            icon="✨"
            color="green"
            disabled={summary.newRemaining === 0}
          />
          <PrimaryActionCard
            title="Conversation Drill"
            description="Practice speaking scenarios"
            href="/conversation"
            icon="💬"
            color="purple"
          />
        </section>

        {/* Focus Section */}
        <section>
          <div className="flex justify-between items-end mb-3 px-1">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Focus Review</h2>
            <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              Hard: {summary.focusHard} / Again: {summary.focusAgain}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[3, 7, 15].map((min) => (
              <Link
                key={min}
                href={`/focus?minutes=${min}`}
                className="flex flex-col items-center justify-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all active:scale-95"
              >
                <span className="text-xl font-bold text-gray-800">{min}</span>
                <span className="text-xs text-gray-500 font-medium">min</span>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-brand-400 w-1/2 rounded-full"></div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Links Grid */}
        <section>
           <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Tools</h2>
           <div className="grid grid-cols-2 gap-3">
            <Link href="/quiz" className="bg-orange-50 p-4 rounded-xl border border-orange-100 hover:bg-orange-100 transition-colors">
              <span className="text-2xl block mb-1">⚡️</span>
              <span className="font-bold text-orange-900">Quick Quiz</span>
            </Link>
            <Link href="/test" className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors">
              <span className="text-2xl block mb-1">🎯</span>
              <span className="font-bold text-indigo-900">Level Test</span>
            </Link>
             <Link href="/settings" className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors col-span-2 flex items-center justify-between">
              <span className="font-bold text-gray-700">Settings</span>
              <span className="text-gray-400">⚙️</span>
            </Link>
           </div>
        </section>
      </div>
    </main>
  );
}