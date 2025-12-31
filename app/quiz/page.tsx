// 1分ミニクイズページ
'use client';

import Link from 'next/link';

export default function QuizPage() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">1分クイズ</h1>
      <p className="text-gray-600 mb-4">瞬発力クイズ機能（実装中）</p>
      <Link href="/" className="text-blue-600 hover:underline">← Todayに戻る</Link>
    </main>
  );
}

