import { useState, useEffect } from 'react';
import type { Card } from '@/lib/types';
import { db } from '@/lib/db';

export function useReviewQueue(filter: string) {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [total, setTotal] = useState(0);

  const currentCard = currentIndex < cards.length ? cards[currentIndex] : undefined;

  useEffect(() => {
    // In a real app, you would filter by 'due' date here.
    // For now, we fetch all cards to simulate a review queue.
    db.cards.toArray().then(allCards => {
      setCards(allCards);
      setRemaining(allCards.length);
      setTotal(allCards.length);
    });
  }, []);

  const flip = () => setFlipped(!flipped);

  const grade = (g: 'EASY' | 'HARD' | 'AGAIN') => {
    // Here you would normally save the review result to the DB
    // e.g. await recordReview(currentCard.id, g);

    if (currentIndex < cards.length) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setRemaining(prev => Math.max(0, prev - 1));
      setFlipped(false);
    }
  };

  return {
    card: currentCard,
    flipped,
    remaining,
    total,
    flip,
    grade,
  };
}