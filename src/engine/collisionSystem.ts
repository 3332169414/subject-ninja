import { FallingItem, GesturePointer, HitRecord } from '../types/game';

/**
 * 判断线段是否与圆相交 (碰撞检测)
 * 为了提升高速划动的命中率，我们引入一个额外的容差半径 buffer。
 */
export const isSegmentCircleHit = (
  x1: number, y1: number,
  x2: number, y2: number,
  cx: number, cy: number,
  radius: number
): boolean => {
  // 增加判定半径，提升高速移动时的手感宽容度
  const hitRadius = radius * 1.5; 

  // 线段向量
  const dx = x2 - x1;
  const dy = y2 - y1;
  
  // 如果线段长度为0，直接计算点到圆心的距离
  if (dx === 0 && dy === 0) {
    const distSq = (cx - x1) * (cx - x1) + (cy - y1) * (cy - y1);
    return distSq <= hitRadius * hitRadius;
  }

  // 计算线段到圆心的投影点 t (0 <= t <= 1)
  let t = ((cx - x1) * dx + (cy - y1) * dy) / (dx * dx + dy * dy);
  
  // 限制 t 在 [0, 1] 之间，代表最短距离的投影点在线段上
  t = Math.max(0, Math.min(1, t));

  // 最短距离点坐标
  const closestX = x1 + t * dx;
  const closestY = y1 + t * dy;

  // 计算最短距离的平方
  const distSq = (cx - closestX) * (cx - closestX) + (cy - closestY) * (cy - closestY);

  return distSq <= hitRadius * hitRadius;
};

interface CheckGestureHitsParams {
  fallingItems: FallingItem[];
  gesturePointers: { left: GesturePointer | null, right: GesturePointer | null };
  pointerTrail: { left: {x: number, y: number}[], right: {x: number, y: number}[] };
  currentTime: number;
}

/**
 * 检测双手手势切割是否命中掉落物
 */
export const checkGestureHits = ({ fallingItems, gesturePointers, pointerTrail, currentTime }: CheckGestureHitsParams) => {
  const hitRecords: HitRecord[] = [];
  
  // 将没有被切中的留下
  const updatedItems = fallingItems.filter(item => {
    if (item.selected) return false;

    let hitSide: 'Left' | 'Right' | null = null;

    // 检查左手
    if (gesturePointers.left && gesturePointers.left.isActive) {
      const trail = pointerTrail.left;
      // 检查最近的几条线段（最多检查最后 5 个点，即 4 条线段），以支持高速且有弧度的划动
      const pointsToCheck = Math.min(trail.length, 5);
      for (let i = trail.length - 1; i > trail.length - pointsToCheck; i--) {
        const p1 = trail[i];
        const p2 = trail[i - 1];
        if (isSegmentCircleHit(p1.x, p1.y, p2.x, p2.y, item.x, item.y, item.radius)) {
          hitSide = 'Left';
          break;
        }
      }
      // 如果还没有命中，再检查当前点到上一帧点的线段作为兜底
      if (!hitSide && isSegmentCircleHit(gesturePointers.left.prevX, gesturePointers.left.prevY, gesturePointers.left.x, gesturePointers.left.y, item.x, item.y, item.radius)) {
        hitSide = 'Left';
      }
    }

    // 检查右手 (如果左手没切中)
    if (!hitSide && gesturePointers.right && gesturePointers.right.isActive) {
      const trail = pointerTrail.right;
      const pointsToCheck = Math.min(trail.length, 5);
      for (let i = trail.length - 1; i > trail.length - pointsToCheck; i--) {
        const p1 = trail[i];
        const p2 = trail[i - 1];
        if (isSegmentCircleHit(p1.x, p1.y, p2.x, p2.y, item.x, item.y, item.radius)) {
          hitSide = 'Right';
          break;
        }
      }
      if (!hitSide && isSegmentCircleHit(gesturePointers.right.prevX, gesturePointers.right.prevY, gesturePointers.right.x, gesturePointers.right.y, item.x, item.y, item.radius)) {
        hitSide = 'Right';
      }
    }

    // 命中处理
    if (hitSide) {
      item.selected = true;
      hitRecords.push({
        id: `hit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        subjectId: item.subjectId,
        subjectName: item.subjectName,
        objectName: item.objectName,
        createdAt: currentTime,
        x: item.x,
        y: item.y,
        handSide: hitSide
      } as HitRecord); // @ts-ignore 将由 App.tsx 补全
      return false; // 从 updatedItems 中移除
    }

    return true;
  });

  return { hitRecords, updatedItems };
};