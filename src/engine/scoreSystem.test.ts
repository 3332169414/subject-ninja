import { calculateScore, ScoreCalculationResult } from './scoreSystem';
import { SubjectId } from '../types/game';

interface TestCase {
  name: string;
  input: {
    hitSubjectId: SubjectId;
    likedSubjects: SubjectId[];
    hatedSubjects: SubjectId[];
    currentHateCount: number;
    lastHatedSubjectId: SubjectId | null;
  };
  expected: ScoreCalculationResult;
}

export const runScoreSystemSelfTest = () => {
  console.log('%c--- 启动计分系统自测 (Score System Self-Test) ---', 'color: #00FFFF; font-size: 14px; font-weight: bold;');

  const testCases: TestCase[] = [
    {
      name: '1. normal: 切中普通学科',
      input: {
        hitSubjectId: 'chinese',
        likedSubjects: ['math', 'english'],
        hatedSubjects: ['physics', 'chemistry'],
        currentHateCount: 0,
        lastHatedSubjectId: null
      },
      expected: {
        scoreDelta: 1,
        hateDelta: 0,
        hitType: 'normal',
        newLastHatedSubjectId: null
      }
    },
    {
      name: '2. liked: 切中喜爱学科且无厌恶次数',
      input: {
        hitSubjectId: 'math',
        likedSubjects: ['math', 'english'],
        hatedSubjects: ['physics', 'chemistry'],
        currentHateCount: 0,
        lastHatedSubjectId: null
      },
      expected: {
        scoreDelta: 3,
        hateDelta: 0,
        hitType: 'liked',
        newLastHatedSubjectId: null
      }
    },
    {
      name: '3. likedBonus: 切中喜爱学科且有厌恶次数（抵消）',
      input: {
        hitSubjectId: 'math',
        likedSubjects: ['math', 'english'],
        hatedSubjects: ['physics', 'chemistry'],
        currentHateCount: 2,
        lastHatedSubjectId: 'physics'
      },
      expected: {
        scoreDelta: 2,
        hateDelta: -1,
        hitType: 'liked',
        newLastHatedSubjectId: null
      }
    },
    {
      name: '4. hated: 首次切中厌恶学科',
      input: {
        hitSubjectId: 'physics',
        likedSubjects: ['math', 'english'],
        hatedSubjects: ['physics', 'chemistry'],
        currentHateCount: 0,
        lastHatedSubjectId: null
      },
      expected: {
        scoreDelta: -3,
        hateDelta: 1,
        hitType: 'hated',
        newLastHatedSubjectId: 'physics'
      }
    },
    {
      name: '5. hatedCombo: 连续切中同一门厌恶学科',
      input: {
        hitSubjectId: 'physics',
        likedSubjects: ['math', 'english'],
        hatedSubjects: ['physics', 'chemistry'],
        currentHateCount: 1,
        lastHatedSubjectId: 'physics'
      },
      expected: {
        scoreDelta: -8,
        hateDelta: 3,
        hitType: 'danger',
        newLastHatedSubjectId: 'physics'
      }
    },
    {
      name: '6. hatedNoCombo: 切中不同门厌恶学科不触发连击',
      input: {
        hitSubjectId: 'chemistry',
        likedSubjects: ['math', 'english'],
        hatedSubjects: ['physics', 'chemistry'],
        currentHateCount: 1,
        lastHatedSubjectId: 'physics'
      },
      expected: {
        scoreDelta: -3,
        hateDelta: 1,
        hitType: 'hated',
        newLastHatedSubjectId: 'chemistry'
      }
    }
  ];

  let passedCount = 0;

  testCases.forEach(tc => {
    const result = calculateScore(tc.input);
    
    // 简单的深度比较
    const isPassed = 
      result.scoreDelta === tc.expected.scoreDelta &&
      result.hateDelta === tc.expected.hateDelta &&
      result.hitType === tc.expected.hitType &&
      result.newLastHatedSubjectId === tc.expected.newLastHatedSubjectId;

    if (isPassed) {
      passedCount++;
      console.log(`%c[PASS] ${tc.name}`, 'color: #00FF99');
    } else {
      console.error(`[FAIL] ${tc.name}`);
      console.log('输入:', tc.input);
      console.log('期望输出:', tc.expected);
      console.log('实际输出:', result);
    }
  });

  console.log(`%c测试完成: ${passedCount} / ${testCases.length} 通过`, `color: ${passedCount === testCases.length ? '#00FF99' : '#FF3366'}; font-weight: bold;`);
  return passedCount === testCases.length;
};