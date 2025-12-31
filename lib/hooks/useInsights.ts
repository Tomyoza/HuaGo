// 仮hook: Insights
export function useInsights() {
  // ダミーデータ
  const streak = 15;
  const totalReviews = 120;
  const totalMastered = 80;

  const weaknessTags = [
    { tag: '挨拶', count: 5 },
    { tag: '数字', count: 3 },
    { tag: '時間', count: 4 },
  ];

  const weakCards = [
    { japanese: 'こんにちは', traditional: '你好', pinyin: 'nǐ hǎo' },
    { japanese: 'ありがとう', traditional: '謝謝', pinyin: 'xiè xiè' },
  ];

  return {
    streak,
    totalReviews,
    totalMastered,
    weaknessTags,
    weakCards,
    generateWeaknessPack: () => {},
  };
}