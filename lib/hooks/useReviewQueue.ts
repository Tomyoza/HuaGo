// Reviewキュー
import { useState, useEffect } from 'react';
import type { Card, UserCardState } from '@/lib/types';
import { db } from '@/lib/db';

export function useReviewQueue(filter: string) {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [remaining, setRemaining] = useState(0);

  const currentCard = cards[currentIndex];

  // Load due cards from database
  useEffect(() => {
    db.cards.toArray().then(allCards => {
      setCards(allCards);
      setRemaining(allCards.length);
    });
  }, []);

  const flip = () => setFlipped(!flipped);

  const grade = (g: 'EASY' | 'HARD' | 'AGAIN') => {
    // Update card state in database
    if (currentCard) {
      const newIndex = currentIndex + 1;
      if (newIndex < cards.length) {
        setCurrentIndex(newIndex);
      }
      setRemaining(prev => Math.max(0, prev - 1));
      setFlipped(false);
    }
  };

  return {
    card: currentCard,
    flipped,
    remaining,
    flip,
    grade,
  };
}