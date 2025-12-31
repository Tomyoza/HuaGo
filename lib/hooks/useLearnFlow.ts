// 仮hook: Learnのフロー
export function useLearnFlow() {
  // ダミーデータ
  const scenes = [
    { id: 1, title: '挨拶', description: '基本的な挨拶表現' },
    { id: 2, title: '買い物', description: 'スーパーでの会話' },
  ];

  const currentScene = scenes[0];

  const currentCard = {
    japanese: 'こんにちは',
    traditional: '你好',
    pinyin: 'nǐ hǎo',
  };

  // ステップ: 'select', 'showJapanese', 'showAnswer', 'grade', 'complete'
  const step = 'showAnswer';

  const timeLeft = 3; // 3秒カウント

  const isLimitReached = false;

  return {
    scenes,
    currentScene,
    currentCard,
    step,
    timeLeft,
    isLimitReached,
    selectScene: (sceneId: number) => {},
    showAnswer: () => {},
    grade: (grade: number) => {},
    nextCard: () => {},
  };
}