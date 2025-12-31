// Conversation ページ
'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import PrimaryActionCard from '@/components/PrimaryActionCard';
import SpeakButton from '@/components/SpeakButton';
import { useConversationFlow } from '@/lib/hooks/useConversationFlow';

export default function ConversationPage() {
  const { scenes, currentScene, currentNode, step, isComplete, selectScene, selectResponse, complete } = useConversationFlow();

  const [selectedSceneId, setSelectedSceneId] = useState<number | null>(null);

  if (step === 'select' || !selectedSceneId) {
    return (
      <main className="min-h-screen bg-gray-50">
        <PageHeader title="会話ドリル" showBack backHref="/" />

        <div className="p-4 space-y-6">
          <h2 className="text-lg font-semibold">シーンを選択</h2>
          <div className="space-y-4">
            {scenes.map((scene) => (
              <PrimaryActionCard
                key={scene.id}
                title={scene.title}
                description={scene.description}
                onClick={() => {
                  setSelectedSceneId(scene.id);
                  selectScene(scene.id);
                }}
                icon="💬"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isComplete) {
    return (
      <main className="min-h-screen bg-gray-50">
        <PageHeader title="会話ドリル完了" showBack backHref="/" />

        <div className="p-4 space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold mb-4">会話ドリル完了！</h2>
            <p className="text-gray-600 mb-4">今日の型がSRSに入りました。</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <PageHeader title={`会話: ${currentScene.title}`} showBack backHref="/" />

      <div className="p-4 space-y-6">
        {/* ノード表示 */}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-4xl font-bold mb-4">{currentNode.traditional}</p>
          <p className="text-lg text-gray-600 mb-4">{currentNode.japanese}</p>
          <SpeakButton text={currentNode.traditional} />
        </div>

        {/* 返答候補ボタン */}
        <div className="space-y-4">
          {currentNode.responses.map((response, index) => (
            <button
              key={index}
              onClick={() => selectResponse(index)}
              className="w-full p-4 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600"
            >
              {response.text}
            </button>
          ))}
        </div>

        {/* followup_suggestions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">追加の一言</h3>
          <div className="flex flex-wrap gap-2">
            {currentNode.followup.map((followup, index) => (
              <button
                key={index}
                onClick={() => navigator.clipboard.writeText(followup)}
                className="px-3 py-1 bg-white rounded text-sm hover:bg-gray-100"
              >
                {followup}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
