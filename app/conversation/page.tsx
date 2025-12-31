// 会話テンプレートドリルページ
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAvailableScenes, getTemplatesByScene, getTemplateById, getStartNode, getNextNodes } from '@/lib/conversation';
import { generateCardsFromTemplate } from '@/lib/conversationCardGenerator';
import type { ConversationTemplate, ConversationNode } from '@/lib/types';
import SpeakButton from '@/components/SpeakButton';

type ConversationStep = 'select-scene' | 'select-template' | 'conversation' | 'completed';

export default function ConversationPage() {
  const [step, setStep] = useState<ConversationStep>('select-scene');
  const [availableScenes, setAvailableScenes] = useState<string[]>([]);
  const [selectedScene, setSelectedScene] = useState<string>('');
  const [templates, setTemplates] = useState<ConversationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ConversationTemplate | null>(null);
  const [currentNode, setCurrentNode] = useState<ConversationNode | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadScenes();
  }, []);

  const loadScenes = async () => {
    setIsLoading(true);
    try {
      const scenes = await getAvailableScenes();
      setAvailableScenes(scenes);
    } catch (error) {
      console.error('Failed to load scenes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectScene = async (scene: string) => {
    setSelectedScene(scene);
    setIsLoading(true);
    try {
      const sceneTemplates = await getTemplatesByScene(scene);
      setTemplates(sceneTemplates);
      setStep('select-template');
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = async (templateId: string) => {
    setIsLoading(true);
    try {
      const template = await getTemplateById(templateId);
      if (template) {
        setSelectedTemplate(template);
        const startNode = getStartNode(template);
        if (startNode) {
          setCurrentNode(startNode);
          setConversationHistory([startNode]);
          setStep('conversation');
        }
      }
    } catch (error) {
      console.error('Failed to load template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserResponse = (response?: string) => {
    if (!selectedTemplate || !currentNode) return;

    const nextNodes = getNextNodes(selectedTemplate, currentNode.id, response);
    
    if (nextNodes.length > 0) {
      const nextNode = nextNodes[0]; // 最初の分岐先を選択
      setCurrentNode(nextNode);
      setConversationHistory(prev => [...prev, nextNode]);
    } else {
      // 会話終了
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!selectedTemplate) return;

    // SRSカードを自動生成
    try {
      await generateCardsFromTemplate(selectedTemplate, 'EASY');
      alert('会話ドリル完了！キーフレーズがSRSカードとして登録されました。');
    } catch (error) {
      console.error('Failed to generate cards:', error);
      alert('会話ドリル完了！');
    }

    setStep('completed');
  };

  if (isLoading && step === 'select-scene') {
    return (
      <main className="min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">会話ドリル</h1>
        <p>読み込み中...</p>
      </main>
    );
  }

  if (step === 'select-scene') {
    return (
      <main className="min-h-screen p-4">
        <div className="mb-4">
          <Link href="/" className="text-blue-600 hover:underline">← Todayに戻る</Link>
        </div>
        <h1 className="text-2xl font-bold mb-6">会話ドリル</h1>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">シーンを選択</h2>
          {availableScenes.length === 0 ? (
            <p className="text-gray-600">利用可能なシーンがありません</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {availableScenes.map(scene => (
                <button
                  key={scene}
                  onClick={() => handleSelectScene(scene)}
                  className="p-3 bg-gray-50 rounded hover:bg-gray-100 text-left"
                >
                  {scene}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

  if (step === 'select-template') {
    return (
      <main className="min-h-screen p-4">
        <div className="mb-4">
          <button
            onClick={() => setStep('select-scene')}
            className="text-blue-600 hover:underline"
          >
            ← シーン選択に戻る
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-6">会話ドリル</h1>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">テンプレートを選択</h2>
          {templates.length === 0 ? (
            <p className="text-gray-600">このシーンのテンプレートがありません</p>
          ) : (
            <div className="space-y-2">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template.id)}
                  className="w-full p-3 bg-gray-50 rounded hover:bg-gray-100 text-left"
                >
                  {template.scene}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

  if (step === 'completed') {
    return (
      <main className="min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">会話ドリル完了</h1>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800">
            会話ドリルが完了しました。キーフレーズがSRSカードとして登録されました。
          </p>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => {
              setStep('select-scene');
              setSelectedTemplate(null);
              setCurrentNode(null);
              setConversationHistory([]);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            もう一度
          </button>
          <Link href="/" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 inline-block">
            Todayに戻る
          </Link>
        </div>
      </main>
    );
  }

  if (!currentNode || !selectedTemplate) {
    return (
      <main className="min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">会話ドリル</h1>
        <p className="text-gray-600 mb-4">会話を開始できません</p>
        <button
          onClick={() => setStep('select-scene')}
          className="text-blue-600 hover:underline"
        >
          ← シーン選択に戻る
        </button>
      </main>
    );
  }

  const promptText = currentNode.prompt_text_trad || currentNode.text_trad;
  const promptPinyin = currentNode.prompt_pinyin || currentNode.text_pinyin;
  const promptJa = currentNode.prompt_ja || currentNode.text_ja;
  const followups = currentNode.followup_suggestions || [];
  const nextNodes = getNextNodes(selectedTemplate, currentNode.id);

  return (
    <main className="min-h-screen p-4 max-w-2xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => {
            setStep('select-scene');
            setSelectedTemplate(null);
            setCurrentNode(null);
            setConversationHistory([]);
          }}
          className="text-blue-600 hover:underline"
        >
          ← シーン選択に戻る
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">会話ドリル: {selectedTemplate.scene}</h1>

      {/* 会話履歴 */}
      <div className="mb-4 space-y-2 max-h-40 overflow-y-auto">
        {conversationHistory.slice(0, -1).map((node, idx) => (
          <div
            key={idx}
            className={`p-2 rounded text-sm ${
              node.speaker === 'user' ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'
            }`}
          >
            <div className="font-semibold">{node.speaker === 'user' ? 'あなた' : '相手'}</div>
            <div>{node.text_trad}</div>
            <div className="text-gray-600 text-xs">{node.text_ja}</div>
          </div>
        ))}
      </div>

      {/* 現在のノード */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">
            {currentNode.speaker === 'user' ? 'あなた' : '相手'}
          </div>
          <div className="text-3xl font-bold mb-2">{promptText}</div>
          {promptPinyin && (
            <div className="text-xl text-gray-700 mb-2 flex items-center gap-2">
              <span>{promptPinyin}</span>
              <SpeakButton text={promptText} />
            </div>
          )}
          {promptJa && (
            <div className="text-gray-600 mb-4">{promptJa}</div>
          )}
        </div>

        {/* 追加の一言 */}
        {followups.length > 0 && (
          <div className="border-t pt-4 mb-4">
            <h3 className="font-semibold mb-2 text-sm">追加の一言</h3>
            <div className="flex flex-wrap gap-2">
              {followups.map((followup, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-sm">
                  {followup}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 返答選択 */}
        {currentNode.speaker === 'partner' && nextNodes.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">返答を選択</h3>
            <div className="space-y-2">
              {nextNodes.map((node, idx) => {
                const branch = selectedTemplate.branches.find(
                  b => b.from_node_id === currentNode.id && b.to_node_id === node.id
                );
                const responseText = branch?.user_response || node.text_trad;
                return (
                  <button
                    key={node.id}
                    onClick={() => handleUserResponse(responseText)}
                    className="w-full p-3 bg-blue-50 rounded hover:bg-blue-100 text-left"
                  >
                    <div className="font-semibold">{responseText}</div>
                    {node.text_pinyin && (
                      <div className="text-sm text-gray-600">{node.text_pinyin}</div>
                    )}
                    {node.text_ja && (
                      <div className="text-sm text-gray-500">{node.text_ja}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 会話終了ボタン */}
        {nextNodes.length === 0 && (
          <div className="border-t pt-4">
            <button
              onClick={handleComplete}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              会話を完了する
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
