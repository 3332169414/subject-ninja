import { SubjectId, HitType } from '../types/game';

interface ScoreCalculationParams {
  hitSubjectId: SubjectId;
  likedSubjects: SubjectId[];
  hatedSubjects: SubjectId[];
  currentHateCount: number;
  lastHatedSubjectId: SubjectId | null;
}

export interface ScoreCalculationResult {
  scoreDelta: number;
  hateDelta: number;
  hitType: HitType;
  newLastHatedSubjectId: SubjectId | null;
}

/**
 * 计算切割命中后的分数和惩罚变化
 */
export const calculateScore = ({
  hitSubjectId,
  likedSubjects,
  hatedSubjects,
  currentHateCount,
  lastHatedSubjectId
}: ScoreCalculationParams): ScoreCalculationResult => {
  
  // 1. 判断喜爱
  if (likedSubjects.includes(hitSubjectId)) {
    if (currentHateCount > 0) {
      return {
        scoreDelta: 2,
        hateDelta: -1, // 抵消 1 次厌恶
        hitType: 'liked',
        newLastHatedSubjectId: null // 清除连续厌恶状态
      };
    } else {
      return {
        scoreDelta: 3,
        hateDelta: 0,
        hitType: 'liked',
        newLastHatedSubjectId: null
      };
    }
  }

  // 2. 判断厌恶
  if (hatedSubjects.includes(hitSubjectId)) {
    if (lastHatedSubjectId === hitSubjectId) {
      // 连续切中同一门厌恶学科
      return {
        scoreDelta: -8,
        hateDelta: 3, // 厌恶次数 +3
        hitType: 'danger',
        newLastHatedSubjectId: hitSubjectId
      };
    } else {
      // 首次切中或切中另一门厌恶学科
      return {
        scoreDelta: -3,
        hateDelta: 1, // 厌恶次数 +1
        hitType: 'hated',
        newLastHatedSubjectId: hitSubjectId
      };
    }
  }

  // 3. 普通学科
  return {
    scoreDelta: 1,
    hateDelta: 0,
    hitType: 'normal',
    newLastHatedSubjectId: lastHatedSubjectId // 保持原有厌恶状态，允许跨普通学科“连续”
  };
};