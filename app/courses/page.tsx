// Courses ページ
'use client';

import PageHeader from '@/components/PageHeader';
import PrimaryActionCard from '@/components/PrimaryActionCard';

export default function CoursesPage() {
  // ダミーデータ
  const courses = [
    { id: 1, title: '挨拶', description: '基本的な挨拶表現', difficulty: '初級', tags: ['日常', '会話'], progress: 80 },
    { id: 2, title: '買い物', description: 'スーパーでの会話', difficulty: '中級', tags: ['日常', '実用'], progress: 50 },
    { id: 3, title: 'レストラン', description: 'レストランでの注文', difficulty: '上級', tags: ['食事', '実用'], progress: 0 },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <PageHeader title="コース" showBack backHref="/" />

      <div className="p-4 space-y-6">
        <div className="grid gap-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  course.difficulty === '初級' ? 'bg-green-100 text-green-800' :
                  course.difficulty === '中級' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.difficulty}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{course.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {course.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              {course.progress > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>進捗</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              <PrimaryActionCard
                title={course.progress > 0 ? "続きから学習" : "学習開始"}
                description=""
                onClick={() => {}}
                icon="📚"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

