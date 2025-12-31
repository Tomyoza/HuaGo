// 仮hook: Reviewキュー
import { useState } from 'react';

const dummyCard = {
  id: 'dummy-1',
  hanzi_trad: '你好',
  pinyin: 'nǐ hǎo',
  ja_meaning: 'こんにちは',
  example_trad: '你好，很高興認識你。',
  example_pinyin: 'nǐ hǎo, hěn gāo xìng rèn shí nǐ.',
  example_ja: 'こんにちは、お会いできて嬉しいです。',
  tags: [{ scene: 'greeting' }],
  reply_options: ['你好', '你好嗎？'],
  tw_note: '台湾では「你好」はややフォーマル',
  created_at: Date.now(),
};

export function useReviewQueue(filter: string) {
  const [flipped, setFlipped] = useState(false);
  const [remaining, setRemaining] = useState(10);

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