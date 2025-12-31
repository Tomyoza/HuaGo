'use client';

import PageHeader from '@/components/PageHeader';
import SpeakButton from '@/components/SpeakButton';
import { useInsights } from '@/lib/hooks/useInsights';

export default function InsightsPage() {
  const { streak, totalReviews, totalMastered, weaknessTags, weakCards, generateWeaknessPack } = useInsights();

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <PageHeader title="Insights" showBack backHref="/" />

      <div className="p-4 space-y-6 max-w-md mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h3 className="font-medium text-gray-500 mb-2 text-sm uppercase tracking-wider">Day Streak</h3>
            <p className="text-4xl font-black text-brand-600">{streak}</p>
            <p className="text-sm text-gray-400">days</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h3 className="font-medium text-gray-500 mb-2 text-sm uppercase tracking-wider">Total Reviews</h3>
            <p className="text-4xl font-black text-brand-600">{totalReviews}</p>
            <p className="text-sm text-gray-400">sessions</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h3 className="font-medium text-gray-500 mb-2 text-sm uppercase tracking-wider">Mastered</h3>
            <p className="text-4xl font-black text-green-500">{totalMastered}</p>
            <p className="text-sm text-gray-400">cards</p>
          </div>
        </div>

        {/* Top Weaknesses */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>❤️‍🩹</span> Needs Work
          </h2>
          {weaknessTags.length === 0 ? (
             <p className="text-gray-400 text-sm text-center py-4">No weaknesses detected yet. Keep learning!</p>
          ) : (
            <div className="space-y-3">
              {weaknessTags.map((tag, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-red-400 w-4">{index + 1}</span>
                    <span className="font-medium text-gray-800 capitalize">
                      {tag.value}
                    </span>
                  </div>
                  <div className="text-xs font-bold bg-white text-red-500 px-2 py-1 rounded-md border border-red-100">
                    {Math.round(tag.againRate * 100)}% Miss Rate
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Generate Pack Action */}
        <button
          onClick={generateWeaknessPack}
          className="w-full bg-white border-2 border-brand-500 text-brand-600 p-4 rounded-xl text-lg font-bold hover:bg-brand-50 transition-all active:scale-95 shadow-sm"
        >
          🚑 Practice Weak Points (10 Cards)
        </button>

        {/* Difficult Cards */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
           <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🧗</span> Tricky Words
          </h2>
          {weakCards.length === 0 ? (
             <p className="text-gray-400 text-sm text-center py-4">No tricky words found yet.</p>
          ) : (
            <div className="space-y-0 divide-y divide-gray-100">
              {weakCards.map((card, index) => (
                <div key={index} className="flex justify-between items-center py-4">
                  <div>
                    <p className="text-lg font-bold text-gray-800">{card.traditional}</p>
                    <p className="text-xs text-gray-400">{card.pinyin}</p>
                    <p className="text-sm text-gray-600 mt-1">{card.japanese}</p>
                  </div>
                  <SpeakButton text={card.traditional} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}