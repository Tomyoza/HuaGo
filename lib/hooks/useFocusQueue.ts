// 仮hook: Focusキュー
import { useState } from 'react';

const dummyCard = {
  id: 'dummy-focus-1',
  hanzi_trad: '謝謝',
  pinyin: 'xiè xie',
  ja_meaning: 'ありがとう',
  example_trad: '謝謝你的幫忙。',
  example_pinyin: 'xiè xie nǐ de bāng máng.',
  example_ja: '手伝ってくれてありがとう。',
  tags: [{ scene: 'gratitude' }],
  reply_options: ['不客氣', '不用謝'],
  tw_note: '台湾では「謝謝」が一般的',
  created_at: Date.now(),
};

export function useFocusQueue(mode: string, limit: number) {
  const [flipped, setFlipped] = useState(false);
  const [remaining, setRemaining] = useState(limit);

  const flip = () => setFlipped(!flipped);

  const grade = (g: 'EASY' | 'HARD' | 'AGAIN') => {
    console.log('Graded:', g);
    setRemaining(prev => Math.max(0, prev - 1));
    setFlipped(false);
  };

  return {
    card: dummyCard,
    flipped,
    remaining,
    flip,
    grade,
  };
}