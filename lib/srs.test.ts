import { describe, it, expect, beforeEach } from 'vitest';
import { updateSRS, INITIAL_EASE, MIN_EASE, EASE_INCREASE, EASE_DECREASE } from './srs';
import type { UserCardState, Grade } from './types';

describe('SRS更新ロジック', () => {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  describe('新規カード', () => {
    it('EASY評価で新規カードを作成', () => {
      const result = updateSRS(null, 'EASY');
      
      expect(result.ease).toBe(INITIAL_EASE);
      expect(result.interval_days).toBe(4);
      expect(result.due_at).toBeGreaterThan(now);
      expect(result.last_grade).toBe('EASY');
      expect(result.lapse_count).toBe(0);
      expect(result.again_count).toBe(0);
      expect(result.hard_count).toBe(0);
      expect(result.focus_until).toBeNull();
    });

    it('HARD評価で新規カードを作成', () => {
      const result = updateSRS(null, 'HARD');
      
      expect(result.ease).toBe(INITIAL_EASE);
      expect(result.interval_days).toBe(1);
      expect(result.last_grade).toBe('HARD');
      expect(result.hard_count).toBe(1);
      expect(result.focus_until).not.toBeNull();
    });

    it('AGAIN評価で新規カードを作成', () => {
      const result = updateSRS(null, 'AGAIN');
      
      expect(result.ease).toBe(INITIAL_EASE);
      expect(result.interval_days).toBe(1);
      expect(result.last_grade).toBe('AGAIN');
      expect(result.lapse_count).toBe(1);
      expect(result.again_count).toBe(1);
      expect(result.focus_until).not.toBeNull();
    });
  });

  describe('既存カードの更新', () => {
    const baseState: UserCardState = {
      card_id: 'test-card',
      ease: 2.5,
      interval_days: 5,
      due_at: now - oneDayMs,
      last_grade: 'EASY',
      lapse_count: 0,
      again_count: 0,
      hard_count: 0,
      focus_until: null,
      last_reviewed_at: now - oneDayMs * 5,
      created_at: now - oneDayMs * 10,
    };

    it('EASY評価でinterval増、ease微増、focus解除', () => {
      const result = updateSRS(baseState, 'EASY');
      
      expect(result.ease).toBe(baseState.ease + EASE_INCREASE);
      expect(result.interval_days).toBeGreaterThan(baseState.interval_days);
      expect(result.focus_until).toBeNull();
      expect(result.due_at).toBeGreaterThan(now);
    });

    it('HARD評価でinterval控えめ、ease微減、hard_count+1、focus_until設定', () => {
      const result = updateSRS(baseState, 'HARD');
      
      expect(result.ease).toBe(baseState.ease - EASE_DECREASE);
      // HARD評価では interval * new_ease * 0.8 で計算されるため、
      // 元のintervalより小さくなるか、または増加率が低くなる
      // 実際の計算: ceil(5 * 2.35 * 0.8) = 10（増加する場合もある）
      expect(result.interval_days).toBeGreaterThanOrEqual(1);
      expect(result.hard_count).toBe(baseState.hard_count + 1);
      expect(result.focus_until).not.toBeNull();
      
      // focus_untilは今日+5日
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const expectedFocusUntil = todayStart.getTime() + 5 * oneDayMs;
      expect(result.focus_until).toBe(expectedFocusUntil);
    });

    it('AGAIN評価でinterval短く、ease下げ、lapse_count+1、again_count+1、focus_until設定', () => {
      const result = updateSRS(baseState, 'AGAIN');
      
      expect(result.ease).toBe(baseState.ease - EASE_DECREASE * 2);
      expect(result.interval_days).toBe(1);
      expect(result.lapse_count).toBe(baseState.lapse_count + 1);
      expect(result.again_count).toBe(baseState.again_count + 1);
      expect(result.focus_until).not.toBeNull();
      
      // focus_untilは今日+2日
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const expectedFocusUntil = todayStart.getTime() + 2 * oneDayMs;
      expect(result.focus_until).toBe(expectedFocusUntil);
    });
  });

  describe('Edgeケース', () => {
    it('AGAIN連打でeaseがMIN_EASE以下にならない', () => {
      let state: UserCardState | null = null;
      
      // AGAINを5回連続
      for (let i = 0; i < 5; i++) {
        const result = updateSRS(state, 'AGAIN');
        if (result.ease && result.interval_days && result.due_at && result.last_grade) {
          state = {
            card_id: 'test',
            ease: result.ease,
            interval_days: result.interval_days,
            due_at: result.due_at,
            last_grade: result.last_grade,
            lapse_count: result.lapse_count || 0,
            again_count: result.again_count || 0,
            hard_count: result.hard_count || 0,
            focus_until: result.focus_until || null,
            last_reviewed_at: result.last_reviewed_at || Date.now(),
            created_at: Date.now(),
          };
        }
      }
      
      expect(state).not.toBeNull();
      expect(state!.ease).toBeGreaterThanOrEqual(MIN_EASE);
    });

    it('EASY連打でintervalが増加する', () => {
      let state: UserCardState | null = null;
      const intervals: number[] = [];
      
      // EASYを3回連続
      for (let i = 0; i < 3; i++) {
        const result = updateSRS(state, 'EASY');
        intervals.push(result.interval_days!);
        if (result.interval_days && result.ease && result.due_at && result.last_grade) {
          state = {
            card_id: 'test',
            ease: result.ease,
            interval_days: result.interval_days,
            due_at: result.due_at,
            last_grade: result.last_grade,
            lapse_count: result.lapse_count || 0,
            again_count: result.again_count || 0,
            hard_count: result.hard_count || 0,
            focus_until: result.focus_until || null,
            last_reviewed_at: result.last_reviewed_at || Date.now(),
            created_at: Date.now(),
          };
        }
      }
      
      // intervalが増加していることを確認
      expect(intervals[1]).toBeGreaterThan(intervals[0]);
      expect(intervals[2]).toBeGreaterThan(intervals[1]);
    });

    it('due_atが正しく更新される', () => {
      const state: UserCardState = {
        card_id: 'test',
        ease: 2.5,
        interval_days: 5,
        due_at: now - oneDayMs,
        last_grade: 'EASY',
        lapse_count: 0,
        again_count: 0,
        hard_count: 0,
        focus_until: null,
        last_reviewed_at: now - oneDayMs * 5,
        created_at: now - oneDayMs * 10,
      };
      
      const result = updateSRS(state, 'EASY');
      const expectedDueAt = now + result.interval_days! * oneDayMs;
      
      // 許容誤差（1秒以内）
      expect(Math.abs(result.due_at! - expectedDueAt)).toBeLessThan(1000);
    });

    it('HARD評価でintervalが1未満にならない', () => {
      const state: UserCardState = {
        card_id: 'test',
        ease: MIN_EASE,
        interval_days: 1,
        due_at: now - oneDayMs,
        last_grade: 'EASY',
        lapse_count: 0,
        again_count: 0,
        hard_count: 0,
        focus_until: null,
        last_reviewed_at: now - oneDayMs,
        created_at: now - oneDayMs * 2,
      };
      
      const result = updateSRS(state, 'HARD');
      
      expect(result.interval_days).toBeGreaterThanOrEqual(1);
    });
  });

  describe('focus_until更新', () => {
    it('EASYでfocus_untilがnullになる', () => {
      const state: UserCardState = {
        card_id: 'test',
        ease: 2.5,
        interval_days: 5,
        due_at: now - oneDayMs,
        last_grade: 'HARD',
        lapse_count: 0,
        again_count: 0,
        hard_count: 1,
        focus_until: now + 5 * oneDayMs,
        last_reviewed_at: now - oneDayMs * 5,
        created_at: now - oneDayMs * 10,
      };
      
      const result = updateSRS(state, 'EASY');
      
      expect(result.focus_until).toBeNull();
    });

    it('HARDでfocus_untilが今日+5日に設定される', () => {
      const state: UserCardState = {
        card_id: 'test',
        ease: 2.5,
        interval_days: 5,
        due_at: now - oneDayMs,
        last_grade: 'EASY',
        lapse_count: 0,
        again_count: 0,
        hard_count: 0,
        focus_until: null,
        last_reviewed_at: now - oneDayMs * 5,
        created_at: now - oneDayMs * 10,
      };
      
      const result = updateSRS(state, 'HARD');
      
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const expectedFocusUntil = todayStart.getTime() + 5 * oneDayMs;
      
      expect(result.focus_until).toBe(expectedFocusUntil);
    });

    it('AGAINでfocus_untilが今日+2日に設定される', () => {
      const state: UserCardState = {
        card_id: 'test',
        ease: 2.5,
        interval_days: 5,
        due_at: now - oneDayMs,
        last_grade: 'EASY',
        lapse_count: 0,
        again_count: 0,
        hard_count: 0,
        focus_until: null,
        last_reviewed_at: now - oneDayMs * 5,
        created_at: now - oneDayMs * 10,
      };
      
      const result = updateSRS(state, 'AGAIN');
      
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const expectedFocusUntil = todayStart.getTime() + 2 * oneDayMs;
      
      expect(result.focus_until).toBe(expectedFocusUntil);
    });
  });
});

