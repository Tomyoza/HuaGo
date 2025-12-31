// コース一覧ページ（オプション）
'use client';

import Link from 'next/link';

export default function CoursesPage() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">コース</h1>
      <p className="text-gray-600 mb-4">コース一覧（実装中）</p>
      <Link href="/" className="text-blue-600 hover:underline">← Todayに戻る</Link>
    </main>
  );
}

