// src/utils/sm2.ts

import { AlgoSettings } from '../types';

export const DEFAULT_ALGO_SETTINGS: AlgoSettings = {
  startingEase: 2.50,
  maxInterval: 120,
  hardModifier: 1.2,
  easyBonus: 1.3
};

export function calculateSM2(
  rating: 'Again' | 'Hard' | 'Good' | 'Easy' | undefined,
  oldRepetitions: number,
  oldInterval: number,
  oldEaseFactor: number,
  settings: AlgoSettings
): { repetitions: number; interval: number; easeFactor: number } {
  let reps = oldRepetitions;
  let interval = oldInterval;
  let easeFactor = oldEaseFactor;

  switch (rating) {
    case 'Again':
      reps = 0;
      interval = 1;
      easeFactor = Math.max(1.3, oldEaseFactor - 0.20);
      break;
    case 'Hard':
      reps = 1;
      interval = Math.max(1, Math.round(oldInterval * settings.hardModifier));
      easeFactor = Math.max(1.3, oldEaseFactor - 0.15);
      break;
    case 'Good':
      reps = oldRepetitions + 1;
      interval =
        oldRepetitions === 0 ? 1 :
        oldRepetitions === 1 ? 6 :
        Math.round(oldInterval * oldEaseFactor);
      easeFactor = oldEaseFactor;
      break;
    case 'Easy':
      reps = oldRepetitions + 1;
      interval =
        oldRepetitions === 0 ? 1 :
        oldRepetitions === 1 ? 6 :
        Math.round(oldInterval * oldEaseFactor * settings.easyBonus);
      easeFactor = oldEaseFactor + 0.15;
      break;
    default:
      // No rating provided (first detection, no overlay interaction) — treat as Good
      reps = oldRepetitions + 1;
      interval =
        oldRepetitions === 0 ? 1 :
        oldRepetitions === 1 ? 6 :
        Math.round(oldInterval * oldEaseFactor);
      easeFactor = oldEaseFactor;
      break;
  }

  // Cap interval at maxInterval
  if (interval > settings.maxInterval) {
    interval = settings.maxInterval;
  }

  return {
    repetitions: reps,
    interval,
    easeFactor
  };
}
