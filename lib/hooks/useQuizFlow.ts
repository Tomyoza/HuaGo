// Quizのフロー
import { useState, useEffect, useCallback } from 'react';
import type { Card } from '@/lib/types';
import { db } from '@/lib/db';

export function useQuizFlow() {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState<'showQuestion' | 'recall' | 'input' | 'result' | 'complete'>('input');
  const [timeLeft, setTimeLeft] = useState(3);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0, retry: 0 });
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = cards[currentIndex];

  // Load random cards from database
  useEffect(() => {
    db.cards.toArray().then(allCards => {
      // Shuffle and take 10 random cards
      const shuffled = [...allCards].sort(() => Math.random() - 0.5).slice(0, 10);
      setCards(shuffled);
    });
  }, []);

  const startRecall = useCallback(() => {
    setStep('recall');
    setTimeLeft(3);
  }, []);

  const submitAnswer = useCallback((input: string) => {
    setUserInput(input);
    const correct = input.toLowerCase() === currentQuestion?.hanzi_trad.toLowerCase();
    setIsCorrect(correct);
    setStep('result');
    
    // Update score
    setScore(prev => ({
      ...prev,
      correct: prev.correct + (correct ? 1 : 0),
      wrong: prev.wrong + (correct ? 0 : 1),
    }));
  }, [currentQuestion]);

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setIsCorrect(null);
      setStep('input');
    } else {
      setIsComplete(true);
      setStep('complete');
    }
  }, [currentIndex, cards.length]);

  const finish = useCallback(() => {
    setCurrentIndex(0);
    setUserInput('');
    setIsCorrect(null);
    setScore({ correct: 0, wrong: 0, retry: 0 });
    setIsComplete(false);
    setStep('input');
  }, []);

  // Timer for recall step
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'recall' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [step, timeLeft]);

  return {
    questions: cards,
    currentQuestion,
    step,
    timeLeft,
    userInput,
    isCorrect,
    score,
    isComplete,
    startRecall,
    submitAnswer,
    nextQuestion,
    finish,
  };
}