// Test ページ
'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import SpeakButton from '@/components/SpeakButton';
import { useTestFlow } from '@/lib/hooks/useTestFlow';

export default function TestPage() {
  const { sections, currentSection, currentQuestion, step, answers, results, startTest, answerQuestion, nextSection, finishTest } = useTestFlow();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  if (step === 'start') {
    return (
      <main className="min-h-screen bg-gray-50">
        <PageHeader title="レベル測定" showBack backHref="/" />

        <div className="p-4 space-y-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-bold mb-4">10分クイック診断</h2>
            <p className="text-gray-600 mb-4">
              Listening, Reading, Speaking, Vocabularyの4つのスキルで現在のレベルを測定します。
            </p>
            <button
              onClick={startTest}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              診断を開始
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'testing') {
    return (
      <main className="min-h-screen bg-gray-50">
        <PageHeader title="レベル測定" showBack backHref="/" />

        <div className="p-4 space-y-6">
          {/* ステッパー */}
          <div className="flex justify-center">
            <div className="flex space-x-4">
              {sections.map((section, index) => (
                <div
                  key={section}
                  className={`px-4 py-2 rounded ${
                    section === currentSection ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {section}
                </div>
              ))}
            </div>
          </div>

          {/* 質問 */}
          <div className="bg-white rounded-lg shadow p-6">
            {currentQuestion.type === 'listening' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Listening</h3>
                <p>音声を聞いて、意味を選択してください。</p>
                <div className="flex items-center gap-4">
                  <SpeakButton text={currentQuestion.question} />
                  <span>音声を聞いてください</span>
                </div>
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedAnswer(index);
                        answerQuestion(index);
                      }}
                      className={`block w-full p-3 text-left border rounded ${
                        selectedAnswer === index ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  if (step === 'result') {
    return (
      <main className="min-h-screen bg-gray-50">
        <PageHeader title="診断結果" showBack backHref="/" />

        <div className="p-4 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-center">診断結果</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-3xl font-bold text-blue-600">{results.cefr}</div>
                <div className="text-sm text-gray-600">CEFR</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-3xl font-bold text-green-600">{results.tocfl}</div>
                <div className="text-sm text-gray-600">TOCFL</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">今週の方針</h3>
              <p className="text-gray-600">{results.plan}</p>
            </div>

            <button
              onClick={() => {}}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Todayに戻る
            </button>
          </div>
        </div>
      </main>
    );
  }

  return null;
}

