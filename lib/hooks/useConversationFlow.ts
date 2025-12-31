// Conversation のフロー
import { useState, useCallback, useEffect } from 'react';
import { db } from '@/lib/db';

export interface ConversationNode {
  id: string;
  speaker: string;
  text_trad: string;
  text_pinyin: string;
  text_ja: string;
  prompt_text_trad?: string;
  prompt_pinyin?: string;
  prompt_ja?: string;
  followup_suggestions: string[];
}

export interface ConversationScene {
  id: string;
  scene: string;
  title?: string;
  description?: string;
  nodes: ConversationNode[];
  branches?: Array<{ from_node_id: string; to_node_id: string; user_response?: string }>;
  followup_suggestions: string[];
}

export function useConversationFlow() {
  const [scenes, setScenes] = useState<ConversationScene[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [step, setStep] = useState<'select' | 'converse' | 'complete'>('select');
  const [isComplete, setIsComplete] = useState(false);

  // Load templates from database
  useEffect(() => {
    db.conversationTemplates.toArray().then((templates: any) => {
      const formattedScenes = templates.map((t: any) => ({
        id: t.id,
        scene: t.scene,
        title: t.scene,
        description: t.scene,
        nodes: t.nodes || [],
        branches: t.branches || [],
        followup_suggestions: t.followup_suggestions || [],
      }));
      setScenes(formattedScenes);
    }).catch(() => {
      // Fallback to default scenes
      setScenes([
        {
          id: 'template-001',
          scene: 'レストランでの注文',
          title: 'レストランでの注文',
          description: 'レストランで料理を注文するシーン',
          nodes: [
            {
              id: 'node-001',
              speaker: 'partner',
              text_trad: '欢迎光临，几位？',
              text_pinyin: 'huānyíng guānglín, jǐ wèi?',
              text_ja: 'いらっしゃいませ、何名様ですか？',
              prompt_text_trad: '欢迎光临，几位？',
              prompt_pinyin: 'huānyíng guānglín, jǐ wèi?',
              prompt_ja: '店員が人数を聞いています',
              followup_suggestions: ['有订位吗？', '请这边坐'],
            },
            {
              id: 'node-002',
              speaker: 'user',
              text_trad: '两位。',
              text_pinyin: 'liǎng wèi.',
              text_ja: '2名です。',
              prompt_text_trad: '两位。',
              prompt_pinyin: 'liǎng wèi.',
              prompt_ja: '2名と答えます',
              followup_suggestions: [],
            },
            {
              id: 'node-003',
              speaker: 'partner',
              text_trad: '好的，请这边坐。',
              text_pinyin: 'hǎo de, qǐng zhè biān zuò.',
              text_ja: '承知いたしました、こちらへどうぞ。',
              prompt_text_trad: '好的，请这边坐。',
              prompt_pinyin: 'hǎo de, qǐng zhè biān zuò.',
              prompt_ja: '店員が席に案内します',
              followup_suggestions: [],
            },
          ],
          branches: [],
          followup_suggestions: [],
        },
      ]);
    });
  }, []);

  const currentScene = selectedSceneId
    ? scenes.find(s => s.id === selectedSceneId)
    : null;

  const currentNode = currentScene ? currentScene.nodes[currentNodeIndex] : null;

  const selectScene = useCallback((sceneId: string) => {
    setSelectedSceneId(sceneId);
    setCurrentNodeIndex(0);
    setStep('converse');
    setIsComplete(false);
  }, []);

  const selectResponse = useCallback(() => {
    if (!currentScene) return;

    // Find next node based on branches or just move forward
    const branch = currentScene.branches?.find(
      b => b.from_node_id === currentNode?.id
    );

    if (branch?.to_node_id) {
      const nextIndex = currentScene.nodes.findIndex(n => n.id === branch.to_node_id);
      if (nextIndex !== -1) {
        setCurrentNodeIndex(nextIndex);
      } else {
        setIsComplete(true);
        setStep('complete');
      }
    } else if (currentNodeIndex + 1 < currentScene.nodes.length) {
      setCurrentNodeIndex(currentNodeIndex + 1);
    } else {
      setIsComplete(true);
      setStep('complete');
    }
  }, [currentScene, currentNode, currentNodeIndex]);

  const complete = useCallback(() => {
    setStep('select');
    setSelectedSceneId(null);
    setCurrentNodeIndex(0);
    setIsComplete(false);
  }, []);

  return {
    scenes,
    currentScene,
    currentNode,
    step,
    isComplete,
    selectScene,
    selectResponse,
    complete,
  };
}