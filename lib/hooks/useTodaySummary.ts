// 仮hook: Todayのサマリー
export function useTodaySummary() {
  return {
    dueCount: 15,
    newRemaining: 3,
    newLimit: 5,
    focusHard: 8,
    focusAgain: 12,
    streakDays: 7,
    checklist: {
      review: false,
      learn: true,
      speak: false,
    },
  };
}