// 仮hook: Quizのフロー
export function useQuizFlow() {
  // ダミーデータ
  const questions = [
    { japanese: 'こんにちは', answer: '你好' },
    { japanese: 'ありがとう', answer: '謝謝' },
  ];

  const currentQuestion = questions[0];

  // ステップ: 'showQuestion', 'recall', 'input', 'result', 'complete'
  const step = 'input';

  const timeLeft = 3; // 3秒想起

  const userInput = '';

  const isCorrect = null; // null, true, false

  const score = { correct: 1, wrong: 0, retry: 0 };

  const isComplete = false;

  return {
    questions,
    currentQuestion,
    step,
    timeLeft,
    userInput,
    isCorrect,
    score,
    isComplete,
    startRecall: () => {},
    submitAnswer: (input: string) => {},
    nextQuestion: () => {},
    finish: () => {},
  };
}