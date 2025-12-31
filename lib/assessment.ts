import { db } from './db';
import type { AssessmentQuestion } from './types';

/**
 * テスト結果を採点
 */
export function calculateScore(
  questions: AssessmentQuestion[],
  answers: { questionId: string; answer: string }[]
): {
  total: number;
  listening: number;
  reading: number;
  speaking: number;
  vocab: number;
} {
  const answerMap = new Map(answers.map(a => [a.questionId, a.answer]));

  let totalCorrect = 0;
  let listeningCorrect = 0;
  let readingCorrect = 0;
  let speakingCorrect = 0; // speakingは判定なし、常に正解扱い
  let vocabCorrect = 0;

  let listeningTotal = 0;
  let readingTotal = 0;
  let speakingTotal = 0;
  let vocabTotal = 0;

  for (const q of questions) {
    const userAnswer = answerMap.get(q.id);
    const isCorrect = userAnswer === q.correct_answer;

    switch (q.type) {
      case 'listening':
        listeningTotal++;
        if (isCorrect) listeningCorrect++;
        break;
      case 'reading':
        readingTotal++;
        if (isCorrect) readingCorrect++;
        break;
      case 'speaking':
        speakingTotal++;
        speakingCorrect++; // 判定なし
        break;
      case 'vocab':
        vocabTotal++;
        if (isCorrect) vocabCorrect++;
        break;
    }

    if (isCorrect || q.type === 'speaking') {
      totalCorrect++;
    }
  }

  return {
    total: totalCorrect / questions.length,
    listening: listeningTotal > 0 ? listeningCorrect / listeningTotal : 0,
    reading: readingTotal > 0 ? readingCorrect / readingTotal : 0,
    speaking: speakingTotal > 0 ? speakingCorrect / speakingTotal : 0,
    vocab: vocabTotal > 0 ? vocabCorrect / vocabTotal : 0,
  };
}

/**
 * スコアからレベルマッピング（暫定）
 */
export function mapToLevels(totalScore: number): { cefr: string; tocfl: string } {
  if (totalScore >= 0.81) return { cefr: 'C1', tocfl: 'C' };
  if (totalScore >= 0.61) return { cefr: 'B2', tocfl: 'C' };
  if (totalScore >= 0.41) return { cefr: 'B1', tocfl: 'B' };
  if (totalScore >= 0.21) return { cefr: 'A2', tocfl: 'A' };
  return { cefr: 'A1', tocfl: 'Novice' };
}

/**
 * 学習プラン生成
 */
export function generatePlan(skillBreakdown: {
  listening: number;
  reading: number;
  speaking: number;
  vocab: number;
}): string[] {
  const plans: string[] = [];

  if (skillBreakdown.listening < 0.7) {
    plans.push('今週はListening強化：会話テンプレでListening比率UP');
  }
  if (skillBreakdown.reading < 0.7) {
    plans.push('Reading強化：Focus対象を増やす');
  }
  if (skillBreakdown.speaking < 0.7) {
    plans.push('Speaking強化：会話テンプレを優先');
  }
  if (skillBreakdown.vocab < 0.7) {
    plans.push('語彙強化：新規学習数を増やす');
  }

  if (plans.length === 0) {
    plans.push('バランスが取れているので、全スキル均等に学習を進めましょう');
  }

  return plans;
}

/**
 * アセスメント保存
 */
export async function saveAssessment(
  results: { cefr: string; tocfl: string; skill_breakdown: any },
  plan: string[]
): Promise<void> {
  const assessment = {
    id: `assessment-${Date.now()}`,
    question_bank: [], // 今回は空でOK
    results,
    skill_breakdown: results.skill_breakdown,
    plan_recommendation: plan,
    completed_at: Date.now(),
  };

  await db.assessments.add(assessment);
}

/**
 * 最新のプラン取得
 */
export async function getLatestPlan(): Promise<string[] | null> {
  const latest = await db.assessments.orderBy('completed_at').reverse().first();
  return latest ? latest.plan_recommendation : null;
}