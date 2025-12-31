// Insights ページ
'use client';

import PageHeader from '@/components/PageHeader';
import SpeakButton from '@/components/SpeakButton';
import { useInsights } from '@/lib/hooks/useInsights';

export default function InsightsPage() {
  const { streak, totalReviews, totalMastered, weaknessTags, weakCards, generateWeaknessPack } = useInsights();

  return (
    <main className="min-h-screen bg-gray-50">
      <PageHeader title="インサイト" showBack backHref="/" />

      <div className="p-4 space-y-6">
        {/* 統計 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="font-medium text-gray-600 mb-2">連続学習日数</h3>
            <p className="text-4xl font-bold">{streak}</p>
            <p className="text-sm text-gray-500">日</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="font-medium text-gray-600 mb-2">総復習数</h3>
            <p className="text-4xl font-bold">{totalReviews}</p>
            <p className="text-sm text-gray-500">回</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="font-medium text-gray-600 mb-2">総習得数</h3>
            <p className="text-4xl font-bold">{totalMastered}</p>
            <p className="text-sm text-gray-500">枚</p>
          </div>
        </div>

        {/* 弱点Top */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">弱点Top</h2>
          <div className="space-y-3">
            {weaknessTags.map((tag, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">{index + 1}. {tag.tag}</span>
                <span className="text-red-600">{tag.count}回</span>
              </div>
            ))}
          </div>
        </section>

        {/* 弱点復習パック */}
        <button
          onClick={generateWeaknessPack}
          className="w-full bg-blue-500 text-white p-4 rounded-lg text-lg font-semibold hover:bg-blue-600"
        >
          弱点復習パック（10枚）
        </button>

        {/* 苦手カードTop */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">苦手カードTop</h2>
          <div className="space-y-3">
            {weakCards.map((card, index) => (
              <div key={index} className="flex justify-between items-center p-3 border-b">
                <div>
                  <p className="font-medium">{card.japanese}</p>
                  <p className="text-gray-600">{card.traditional} ({card.pinyin})</p>
                </div>
                <SpeakButton text={card.traditional} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

