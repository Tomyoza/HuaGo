import { useState, useCallback, useEffect } from 'react';
import type { Card } from '@/lib/types';
import { 
  getUnlearnedCards, 
  getAvailableScenes, 
  getNewCardLimit, 
  getTodayNewCount 
} from '@/lib/learn';

export function useLearnFlow() {
  // Use a flexible type for scenes to match what the UI expects
  const [scenes, setScenes] = useState<{ id: string; title: string; description?: string }[]>([]);
  
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [step, setStep] = useState<'select' | 'showJapanese' | 'showAnswer' | 'grade' | 'complete'>('select');
  const [timeLeft, setTimeLeft] = useState(3);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize scenes on mount
  useEffect(() => {
    async function loadScenes() {
      try {
        const availableScenes = await getAvailableScenes();
        // Map simple tag strings to objects for the UI
        const formattedScenes = availableScenes.map(scene => ({
          id: scene,
          title: scene.charAt(0).toUpperCase() + scene.slice(1), // Capitalize
          description: `${scene} related vocabulary`
        }));
        setScenes(formattedScenes);
      } catch (error) {
        console.error('Failed to load scenes:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadScenes();
  }, []);

  const currentScene = currentSceneId ? scenes.find(s => s.id === currentSceneId) : null;
  const currentCard = cards[currentCardIndex];

  const selectScene = useCallback(async (sceneId: string) => {
    setIsLoading(true);
    setCurrentSceneId(sceneId);

    try {
      // 1. Check daily limits
      const limit = await getNewCardLimit();
      const todayCount = await getTodayNewCount();
      const remainingQuota = Math.max(0, limit - todayCount);

      if (remainingQuota === 0) {
        setIsLimitReached(true);
        setStep('complete');
        setIsLoading(false);
        return;
      }

      // 2. Fetch unlearned cards specifically for this scene
      const candidates = await getUnlearnedCards({ scene: sceneId });
      
      // 3. Slice to fit the daily quota
      const cardsToLearn = candidates.slice(0, remainingQuota);

      if (cardsToLearn.length === 0) {
        // No new cards available for this scene
        setCards([]);
        setStep('complete'); 
      } else {
        setCards(cardsToLearn);
        setCurrentCardIndex(0);
        setStep('showJapanese');
      }
    } catch (error) {
      console.error("Error selecting scene:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const showAnswer = useCallback(() => {
    setStep('showAnswer');
  }, []);

  const grade = useCallback((gradeValue: string) => {
    // In a real app, save the result to DB here using `lib/srs.ts`
    // await recordReview(currentCard.id, gradeValue);

    setStep('grade');
    setTimeout(() => {
      setCurrentCardIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex < cards.length) {
          setStep('showJapanese');
          return nextIndex;
        } else {
          setStep('complete');
          return prevIndex;
        }
      });
    }, 200);
  }, [cards.length]);

  // Timer for showJapanese step
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'showJapanese' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
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
    isLoading,
    selectScene,
    showAnswer,
    grade,
  };
}