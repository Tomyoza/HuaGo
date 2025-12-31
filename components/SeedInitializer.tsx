'use client';

import { useEffect } from 'react';
import { seedDatabase } from '@/lib/seed';

export default function SeedInitializer() {
  useEffect(() => {
    // 初回起動時にseed投入
    seedDatabase().catch((error) => {
      console.error('Failed to seed database:', error);
    });
  }, []);

  return null; // このコンポーネントは何も表示しない
}

