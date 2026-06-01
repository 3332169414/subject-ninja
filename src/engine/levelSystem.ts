import { DifficultyConfig, SubjectItem } from '../types/game';

// 难度常数
const INITIAL_INTERVAL = 450;
const MIN_INTERVAL = 220;
const INTERVAL_DECREMENT = 30;

const INITIAL_SPEED = 120;
const MAX_SPEED = 420;
const SPEED_INCREMENT = 25;

const INITIAL_MAX_ITEMS = 28;
const MAX_ITEMS_CAP = 42;
const ITEMS_INCREMENT = 2;

/**
 * 根据关卡等级计算难度配置
 */
export const getDifficultyByLevel = (level: number): DifficultyConfig => {
  const levelZeroBased = level - 1;

  const spawnInterval = Math.max(
    MIN_INTERVAL,
    INITIAL_INTERVAL - levelZeroBased * INTERVAL_DECREMENT
  );

  const baseFallSpeed = Math.min(
    MAX_SPEED,
    INITIAL_SPEED + levelZeroBased * SPEED_INCREMENT
  );

  const maxItems = Math.min(
    MAX_ITEMS_CAP,
    INITIAL_MAX_ITEMS + levelZeroBased * ITEMS_INCREMENT
  );

  return {
    level,
    spawnInterval,
    baseFallSpeed,
    maxItems,
  };
};

/**
 * 随机洗牌算法 (Fisher-Yates)
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * 为下一关生成配置（包含随机的喜爱和厌恶学科）
 */
export const createNextLevelConfig = (allSubjects: SubjectItem[], nextLevel: number) => {
  const difficulty = getDifficultyByLevel(nextLevel);
  
  // 随机抽取学科
  const shuffledSubjects = shuffleArray(allSubjects);
  
  // 前两个作为喜爱，接下来两个作为厌恶
  const likedSubjects = shuffledSubjects.slice(0, 2).map(s => s.id);
  const hatedSubjects = shuffledSubjects.slice(2, 4).map(s => s.id);

  return {
    difficulty,
    likedSubjects,
    hatedSubjects
  };
};