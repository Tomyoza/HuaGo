// Conversation ページ
'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import PrimaryActionCard from '@/components/PrimaryActionCard';
import SpeakButton from '@/components/SpeakButton';
import SessionComplete from '@/components/SessionComplete';
import { useConversationFlow } from '@/lib/hooks/useConversationFlow';
import { MessageCircle, User, Mic } from 'lucide-react';

export default function ConversationPage() {
  const { scenes, currentScene, currentNode, step, isComplete, selectScene, selectResponse, complete } = useConversationFlow();

  // 修正: IDはstringなので型を合わせる
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);

  // 1. シーン選択画面
  if (step === 'select' || !selectedSceneId) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col pb-24">
        <PageHeader title="会話ドリル" showBack backHref="/" />

        <div className="flex-1 p-4 w-full max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900 px-1">シーンを選択</h2>
            <p className="text-sm text-gray-500 px-1">実践的な会話フレーズを学びましょう</p>
          </div>
          
          <div className="space-y-3">
            {scenes.map((scene) => (
              <PrimaryActionCard
                key={scene.id}
                title={scene.title || scene.scene}
                description={scene.description || scene.scene}
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

  // 2. 完了画面
  if (isComplete) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col">
        <PageHeader title="会話ドリル" showBack backHref="/" />
        <div className="flex-1 flex flex-col">
          <SessionComplete
            title="Conversation Done!"
            subtitle="Great job! You've practiced this scenario."
            onRestart={complete} // complete関数でリセットして選択画面へ戻る
          />
        </div>
      </main>
    );
  }

  // 3. 会話実行画面
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col pb-8">
      <PageHeader title={currentScene?.title || "Conversation"} showBack backHref="/" />

      <div className="flex-1 flex flex-col px-4 pt-4 w-full max-w-md mx-auto">
        {currentNode && (
          <>
            {/* メインカードエリア */}
            <div className="flex-1 flex flex-col justify-center mb-6">
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 text-center flex flex-col items-center justify-center min-h-[40vh] relative overflow-hidden">
                
                {/* 話者ラベル */}
                <div className={`absolute top-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  currentNode.speaker === 'user' 
                    ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                    : 'bg-gray-50 text-gray-600 border border-gray-100'
                }`}>
                  {currentNode.speaker === 'user' ? <User size={14}/> : <MessageCircle size={14}/>}
                  {currentNode.speaker === 'user' ? 'Your Turn' : 'Partner'}
                </div>

                {/* メインテキスト */}
                <div className="mt-8 mb-6 w-full">
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-snug break-words">
                    {currentNode.text_trad}
                  </h2>
                  <p className="text-lg text-blue-600 font-medium mt-2">{currentNode.text_pinyin}</p>
                </div>

                {/* 日本語訳 */}
                <div className="border-t border-gray-100 pt-4 w-full">
                   <p className="text-lg text-gray-500 font-medium">{currentNode.text_ja}</p>
                </div>

                {/* 音声ボタン (中央配置で押しやすく) */}
                <div className="mt-6">
                  <SpeakButton text={currentNode.text_trad} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors" />
                </div>
              </div>
            </div>

            {/* フッター操作エリア */}
            <div className="mt-auto space-y-4">
              
              {/* Follow-up Suggestions (Chips) */}
              {currentNode.followup_suggestions && currentNode.followup_suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-2">
                  {currentNode.followup_suggestions.map((followup, index) => (
                    <button
                      key={index}
                      onClick={() => navigator.clipboard.writeText(followup)}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 shadow-sm active:scale-95 transition-transform"
                    >
                      {followup}
                    </button>
                  ))}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => selectResponse()}
                className={`w-full h-14 rounded-xl text-lg font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                   currentNode.speaker === 'user' 
                   ? 'bg-brand-600 shadow-brand-500/30 hover:bg-brand-700' 
                   : 'bg-gray-800 shadow-gray-800/30 hover:bg-gray-900'
                }`}
              >
                {currentNode.speaker === 'user' ? (
                  <>
                    <Mic size={20} />
                    <span>I Said It</span>
                  </>
                ) : (
                  <span>Next</span>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}