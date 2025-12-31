// Focusキュー
import { useState, useEffect } from 'react';
import type { Card } from '@/lib/types';
import { db } from '@/lib/db';

export function useFocusQueue(mode: string, limit: number) {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [remaining, setRemaining] = useState(limit);

  const currentCard = cards[currentIndex];

  // Load cards from database and shuffle
  useEffect(() => {
    db.cards.toArray().then(allCards => {
      const shuffled = [...allCards].sort(() => Math.random() - 0.5).slice(0, limit);
      setCards(shuffled);
      setRemaining(shuffled.length);
    });
  }, [limit]);

  const flip = () => setFlipped(!flipped);

  const grade = (g: 'EASY' | 'HARD' | 'AGAIN') => {
    const newIndex = currentIndex + 1;
    if (newIndex < cards.length) {
      setCurrentIndex(newIndex);
    }
    setRemaining(prev => Math.max(0, prev - 1));
    setFlipped(false);
  };

  return {
    card: currentCard,
    flipped,
    remaining,
    flip,
    grade,
  };
}