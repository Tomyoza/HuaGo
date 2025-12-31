// Focusキュー
import { useState, useEffect } from 'react';
import type { Card } from '@/lib/types';
import { db } from '@/lib/db';

export function useFocusQueue(mode: string) {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentCard = cards[currentIndex];

  // Load cards from database and shuffle
  useEffect(() => {
    db.cards.toArray().then(allCards => {
      const shuffled = [...allCards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setRemaining(shuffled.length);
      setIsComplete(false);
      setCurrentIndex(0);
    });
  }, []);

  const flip = () => setFlipped(!flipped);

  const grade = (g: 'EASY' | 'HARD' | 'AGAIN') => {
    const newIndex = currentIndex + 1;
    if (newIndex < cards.length) {
      setCurrentIndex(newIndex);
      setFlipped(false);
    } else {
      // Mark as complete when all cards are graded
      setIsComplete(true);
    }
    setRemaining(prev => Math.max(0, prev - 1));
  };

  const resetReview = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setRemaining(cards.length);
    setIsComplete(false);
  };

  return {
    card: currentCard,
    flipped,
    remaining,
    isComplete,
    flip,
    grade,
    resetReview,
  };
}