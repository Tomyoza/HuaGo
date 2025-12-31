// 仮hook: Conversationのフロー
export function useConversationFlow() {
  // ダミーデータ
  const scenes = [
    { id: 1, title: 'カフェ', description: 'カフェでの注文' },
    { id: 2, title: 'レストラン', description: 'レストランでの会話' },
  ];

  const currentScene = scenes[0];

  const currentNode = {
    traditional: '我要一杯咖啡',
    japanese: 'コーヒーを一杯ください',
    responses: [
      { text: '好的，請稍等', next: 2 },
      { text: '抱歉，沒有了', next: null },
    ],
    followup: ['要加糖嗎？', '要加奶嗎？'],
  };

  // ステップ: 'select', 'converse', 'complete'
  const step = 'converse';

  const isComplete = false;

  return {
    scenes,
    currentScene,
    currentNode,
    step,
    isComplete,
    selectScene: (sceneId: number) => {},
    selectResponse: (responseIndex: number) => {},
    complete: () => {},
  };
}