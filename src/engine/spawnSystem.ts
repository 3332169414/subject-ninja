import { SUBJECTS } from '../data/subjects';
import { FallingItem } from '../types/game';

interface SpawnParams {
  baseVy: number;
  screenWidth: number;
  itemType?: 'subject' | 'flame' | 'bomb';
}

export const createFallingItem = ({ baseVy, screenWidth, itemType = 'subject' }: SpawnParams): FallingItem => {
  // 计算随机初始属性
  // x 在屏幕宽度的 8% 到 92% 之间
  const minX = screenWidth * 0.08;
  const maxX = screenWidth * 0.92;
  const x = minX + Math.random() * (maxX - minX);

  // vx: -0.5 到 0.5 之间的水平漂移速度
  const vx = (Math.random() - 0.5) * 1.0;

  // rotationSpeed: -0.03 到 0.03 的旋转速度
  const rotationSpeed = (Math.random() - 0.5) * 0.06;

  if (itemType === 'flame') {
    return {
      id: `flame-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      itemType: 'flame',
      subjectId: 'hazard',
      subjectName: '危险',
      objectId: 'flame',
      objectName: '火焰',
      emoji: '🔥',
      image: '', // 不使用图片，降级使用 emoji
      x,
      y: -80,
      vx,
      vy: baseVy * 1.2, // 火焰掉落稍微快一点
      radius: 56, // 和物件大小一致
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed,
      selected: false
    };
  }

  if (itemType === 'bomb') {
    return {
      id: `bomb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      itemType: 'bomb',
      subjectId: 'hazard',
      subjectName: '致命',
      objectId: 'bomb',
      objectName: '炸弹',
      emoji: '💣',
      image: '',
      x,
      y: -80,
      vx,
      vy: baseVy * 1.1,
      radius: 56,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed,
      selected: false
    };
  }

  // 1. 随机选择学科
  const subjectIndex = Math.floor(Math.random() * SUBJECTS.length);
  const subject = SUBJECTS[subjectIndex];
  
  // 2. 随机选择该学科下的物件
  const objectIndex = Math.floor(Math.random() * subject.objects.length);
  const obj = subject.objects[objectIndex];

  return {
    id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    itemType: 'subject',
    subjectId: subject.id,
    subjectName: subject.name,
    objectId: obj.id,
    objectName: obj.name,
    emoji: obj.emoji,
    image: obj.image,
    x,
    y: -80, // 从屏幕顶部上方开始掉落
    vx,
    vy: baseVy,
    radius: 56, // 对应 112x112 的直径，比之前的 84x84 大一些
    rotation: Math.random() * Math.PI * 2, // 初始随机角度
    rotationSpeed,
    selected: false
  };
};