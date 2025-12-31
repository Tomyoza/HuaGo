// Test Flow
import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/db';

interface TestQuestion {
  id: string;
  type: 'listening' | 'reading' | 'speaking' | 'vocab';
  question: string;
  options: string[];
  correct: number;
  text_to_read?: string;
}

export function useTestFlow() {
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState<'start' | 'testing' | 'result'>('start');
  const [answers, setAnswers] = useState<number[]>([]);
  const [results, setResults] = useState({
    cefr: 'B1',
    tocfl: '3級',
    plan: '',
  });

  const sections = ['Listening', 'Reading', 'Speaking', 'Core Vocab'];
  const currentQuestion = questions[currentIndex];
  const currentSection = currentIndex < questions.length ? sections[Math.floor(currentIndex / (questions.length / 4))] : 'Complete';

  // Load questions from database (use cards as fallback)
  useEffect(() => {
    // Try to load from assessments first
    db.assessments.toArray().then((assessments: any) => {
      if (assessments.length > 0) {
        const questions = assessments[0].question_bank.map((q: any) => ({
          id: q.id,
          type: q.type,
          question: q.question || `${q.type === 'listening' ? '次の音声を聞いて' : '次の文を読んで'}、正しい意味を選んでください`,
          options: q.options || [],
          correct: q.correct_answer ? q.options?.indexOf(q.correct_answer) ?? 0 : 0,
          text_to_read: q.text_to_read || q.text || q.word,
        }));
        setQuestions(questions);
      } else {
        throw new Error('No assessments found');
      }
    }).catch(() => {
      // Fallback: create questions from cards
      db.cards.toArray().then((cards: any) => {
        const questions = cards.slice(0, 8).map((card: any, idx: number) => ({
          id: card.id,
          type: idx < 2 ? 'listening' : idx < 4 ? 'reading' : idx < 6 ? 'speaking' : 'vocab',
          question: idx < 2 ? '次の音声を聞いて、正しい意味を選んでください' : idx < 4 ? '次の文を読んで、正しい意味を選んでください' : `「${card.hanzi_trad}」の意味は？`,
          options: idx < 6 ? [card.ja_meaning, 'わかりません', 'そうですね'] : [card.ja_meaning, '違う意味1', '違う意味2'],
          correct: 0,
          text_to_read: card.hanzi_trad,
        }));
        setQuestions(questions);
      }).catch(() => {
        // Final fallback
        const defaultQuestions: TestQuestion[] = [
        {
          id: 'q-listening-1',
          type: 'listening',
          question: '次の音声を聞いて、正しい意味を選んでください',
          options: ['こんにちは', 'ありがとう', 'すみません'],
          correct: 0,
          text_to_read: '你好',
        },
        {
          id: 'q-listening-2',
          type: 'listening',
          question: '次の音声を聞いて、正しい意味を選んでください',
          options: ['こんにちは', 'ありがとう', 'すみません'],
          correct: 1,
          text_to_read: '谢谢',
        },
      ];
      setQuestions(defaultQuestions);
      });
    });
  }, []);

  const startTest = useCallback(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setStep('testing');
  }, []);

  const answerQuestion = useCallback((answer: number) => {
    setAnswers([...answers, answer]);
    nextSection();
  }, [answers]);

  const nextSection = useCallback(() => {
    const newIndex = currentIndex + 1;
    if (newIndex < questions.length) {
      setCurrentIndex(newIndex);
    } else {
      finishTest();
    }
  }, [currentIndex, questions.length]);

  const finishTest = useCallback(() => {
    // Calculate score and generate results
    const correct = answers.reduce((acc, ans, idx) => {
      return acc + (ans === questions[idx]?.correct ? 1 : 0);
    }, 0);
    const percentage = questions.length > 0 ? (correct / questions.length) * 100 : 0;

    setResults({
      cefr: percentage > 80 ? 'B1' : percentage > 60 ? 'A2' : 'A1',
      tocfl: percentage > 80 ? '3級' : percentage > 60 ? '2級' : '1級',
      plan: percentage > 80 
        ? '今週は会話ドリルを重点的に行いましょう。' 
        : '基本的な語彙と文法をもう一度復習しましょう。',
    });
    setStep('result');
  }, [answers, questions]);

  return {
    sections,
    currentSection,
    currentQuestion,
    step,
    answers,
    results,
    startTest,
    answerQuestion,
    nextSection,
    finishTest,
  };
}