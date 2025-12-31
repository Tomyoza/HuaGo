import { useState, useEffect, useCallback } from 'react';
import type { CardWithState } from '@/lib/types';
import { 
  getStreakDays, 
  getTotalReviews, 
  getTotalMastered, 
  getWeaknessTags, 
  getWeakCards,
  generateWeaknessPack as genWeaknessPackService,
  type WeaknessTag
} from '@/lib/insights';

export function useInsights() {
  const [streak, setStreak] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalMastered, setTotalMastered] = useState(0);
  const [weaknessTags, setWeaknessTags] = useState<WeaknessTag[]>([]);
  const [weakCards, setWeakCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          s, 
          tr, 
          tm, 
          wt, 
          wc
        ] = await Promise.all([
          getStreakDays(),
          getTotalReviews(),
          getTotalMastered(),
          getWeaknessTags(),
          getWeakCards()
        ]);

        setStreak(s);
        setTotalReviews(tr);
        setTotalMastered(tm);
        setWeaknessTags(wt);
        
        // Format weak cards for display
        setWeakCards(wc.map(item => ({
          japanese: item.card.ja_meaning,
          traditional: item.card.hanzi_trad,
          pinyin: item.card.pinyin
        })));
        
      } catch (e) {
        console.error("Failed to load insights", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const generateWeaknessPack = useCallback(async () => {
    // This function will return the cards, likely to be used by a "Start Review" action
    // For now, we just log them or you could redirect to a review page with these cards
    const pack = await genWeaknessPackService();
    console.log("Generated weakness pack:", pack);
    alert(`Generated a review pack with ${pack.length} cards based on your weaknesses.`);
    return pack;
  }, []);

  return {
    streak,
    totalReviews,
    totalMastered,
    weaknessTags,
    weakCards,
    generateWeaknessPack,
    isLoading
  };
}