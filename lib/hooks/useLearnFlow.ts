// 仮hook: Learnのフロー
import { useState, useCallback, useEffect } from 'react';
import type { Card } from '@/lib/types';
import { db } from '@/lib/db';

export function useLearnFlow() {
  const [scenes] = useState([
    { id: 1, title: '挨拶', description: '基本的な挨拶表現' },
    { id: 2, title: '買い物', description: 'スーパーでの会話' },
  ]);

  const [currentSceneId, setCurrentSceneId] = useState<number | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [step, setStep] = useState<'select' | 'showJapanese' | 'showAnswer' | 'grade' | 'complete'>('select');
  const [timeLeft, setTimeLeft] = useState(3);
  const [newCardsTodayCount, setNewCardsTodayCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  const currentScene = currentSceneId ? scenes.find(s => s.id === currentSceneId) : scenes[0];
  const currentCard = cards[currentCardIndex];

  const selectScene = useCallback((sceneId: number) => {
    setCurrentSceneId(sceneId);
    // Fetch cards for this scene from the database
    db.cards.toArray().then(allCards => {
      setCards(allCards); // Get all available cards
      setCurrentCardIndex(0);
      setStep('showJapanese');
    });
  }, []);

  const showAnswer = useCallback(() => {
    setStep('showAnswer');
  }, []);

  const grade = useCallback((gradeValue: string) => {
    setStep('grade');
    // In a real implementation, this would update the SRS schedule
    // For now, just move to the next card
    setTimeout(() => {
      setCurrentCardIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex < cards.length) {
          setStep('showJapanese');
          return nextIndex;
        } else {
          setIsLimitReached(true);
          setStep('complete');
          return prevIndex;
        }
      });
    }, 500);
  }, [cards.length]);


  // Timer for showJapanese step
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'showJapanese' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (step === 'showJapanese' && timeLeft === 0) {
      showAnswer();
    }
    return () => clearTimeout(timer);
  }, [step, timeLeft, showAnswer]);

  // Reset timer when changing cards
  useEffect(() => {
    if (step === 'showJapanese') {
      setTimeLeft(3);
    }
  }, [currentCardIndex, step]);

  return {
    scenes,
    currentScene,
    currentCard,
    step,
    timeLeft,
    isLimitReached,
    selectScene,
    showAnswer,
    grade,
  };
}