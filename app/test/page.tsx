// レベル測定ページ
'use client';

import Link from 'next/link';

export default function TestPage() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">レベル測定</h1>
      <p className="text-gray-600 mb-4">TOCFL/CEFR診断（実装中）</p>
      <Link href="/" className="text-blue-600 hover:underline">← Todayに戻る</Link>
    </main>
  );
}

