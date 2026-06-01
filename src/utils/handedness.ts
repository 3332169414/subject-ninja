import type { Category } from '@mediapipe/tasks-vision';
import type { HandSide } from '../types/game';

export const getMirroredHandSide = (category?: Category | null): HandSide | null => {
  // @ts-ignore category is typed internally
  const rawSide = category?.categoryName || category?.displayName || category?.category;

  if (rawSide !== 'Left' && rawSide !== 'Right') {
    return null;
  }

  return rawSide as HandSide;
};
