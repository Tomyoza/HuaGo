import { useState, useEffect } from 'react';
import { getDueCards, getFocusCards } from '@/lib/srs';
import { getTodayNewCount, getNewCardLimit } from '@/lib/learn';
import { getStreakDays } from '@/lib/insights';

export function useTodaySummary() {
  const [summary, setSummary] = useState({
    dueCount: 0,
    newRemaining: 0,
    newLimit: 5,
    focusHard: 0,
    focusAgain: 0,
    streakDays: 0,
    checklist: {
      review: false,
      learn: false,
      speak: false,
    },
    isLoading: true
  });

  useEffect(() => {
    async function loadSummary() {
      try {
        // 1. Review Counts
        const dueCards = await getDueCards();
        
        // 2. New Card Counts
        const todayNewCount = await getTodayNewCount();
        const newLimit = await getNewCardLimit();
        
        // 3. Focus Counts
        const focusCards = await getFocusCards();
        const focusHard = focusCards.filter(c => c.last_grade === 'HARD').length;
        const focusAgain = focusCards.filter(c => c.last_grade === 'AGAIN').length;

        // 4. Streak
        const streak = await getStreakDays();

        setSummary({
          dueCount: dueCards.length,
          newRemaining: Math.max(0, newLimit - todayNewCount),
          newLimit,
          focusHard,
          focusAgain,
          streakDays: streak,
          checklist: {
            review: dueCards.length === 0, // Checked if no reviews pending
            learn: todayNewCount >= newLimit, // Checked if limit reached
            speak: false, // Placeholder until conversation logic is implemented
          },
          isLoading: false
        });
      } catch (error) {
        console.error('Failed to load today summary:', error);
      }
    }

    loadSummary();
  }, []);

  return summary;
}