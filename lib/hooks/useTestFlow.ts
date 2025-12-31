// 仮hook: TestFlow
export function useTestFlow() {
  // ダミーデータ
  const sections = ['Listening', 'Reading', 'Speaking', 'Core Vocab'];

  const currentSection = 'Listening';

  const currentQuestion = {
    type: 'listening',
    question: '次の文を聞いて、意味を選んでください',
    options: ['こんにちは', 'ありがとう', 'さようなら'],
    correct: 0,
  };

  // ステップ: 'start', 'testing', 'result'
  const step = 'testing';

  const answers = [];

  const results = {
    cefr: 'B1',
    tocfl: '3級',
    plan: '今週は会話ドリルを重点的に行いましょう。',
  };

  return {
    sections,
    currentSection,
    currentQuestion,
    step,
    answers,
    results,
    startTest: () => {},
    answerQuestion: (answer: number) => {},
    nextSection: () => {},
    finishTest: () => {},
  };
}