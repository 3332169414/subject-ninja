import { useRef, useCallback } from 'react';
import { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { GesturePointer, TrailPoint } from '../types/game';
import { getMirroredHandSide } from '../utils/handedness';

interface UseGesturePointerParams {
  handResultRef: React.RefObject<HandLandmarkerResult | null>;
  canvasWidth: number;
  canvasHeight: number;
}

export const useGesturePointer = ({ handResultRef, canvasWidth, canvasHeight }: UseGesturePointerParams) => {
  const gesturePointersRef = useRef<{ left: GesturePointer | null, right: GesturePointer | null }>({
    left: null,
    right: null
  });

  const pointerTrailRef = useRef<{ left: TrailPoint[], right: TrailPoint[] }>({
    left: [],
    right: []
  });

  const updatePointers = useCallback(() => {
    const results = handResultRef.current;
    const now = performance.now();

    // 默认都设为非激活
    if (gesturePointersRef.current.left) gesturePointersRef.current.left.isActive = false;
    if (gesturePointersRef.current.right) gesturePointersRef.current.right.isActive = false;

    if (results && results.landmarks && results.landmarks.length > 0) {
      results.landmarks.forEach((landmarks, index) => {
        const handedness = results.handedness?.[index]?.[0] ?? results.handednesses?.[index]?.[0];
        // 与 useHandTracking 保持一致的反转逻辑
        const side = getMirroredHandSide(handedness);
        if (!side) return;

        const indexTip = landmarks[8]; // 第 8 个关键点是食指指尖
        
        // 归一化坐标转换为屏幕坐标，并进行水平镜像翻转
        const x = (1 - indexTip.x) * canvasWidth;
        const y = indexTip.y * canvasHeight;

        if (side === 'Left') {
          if (!gesturePointersRef.current.left) {
            gesturePointersRef.current.left = {
              id: 'left-pointer', handSide: 'Left', x, y, prevX: x, prevY: y, isActive: true, lastUpdateTime: now
            };
          } else {
            gesturePointersRef.current.left.prevX = gesturePointersRef.current.left.x;
            gesturePointersRef.current.left.prevY = gesturePointersRef.current.left.y;
            gesturePointersRef.current.left.x = x;
            gesturePointersRef.current.left.y = y;
            gesturePointersRef.current.left.isActive = true;
            gesturePointersRef.current.left.lastUpdateTime = now;
          }

          pointerTrailRef.current.left.push({ x, y });
          if (pointerTrailRef.current.left.length > 12) {
            pointerTrailRef.current.left.shift();
          }

        } else if (side === 'Right') {
          if (!gesturePointersRef.current.right) {
            gesturePointersRef.current.right = {
              id: 'right-pointer', handSide: 'Right', x, y, prevX: x, prevY: y, isActive: true, lastUpdateTime: now
            };
          } else {
            gesturePointersRef.current.right.prevX = gesturePointersRef.current.right.x;
            gesturePointersRef.current.right.prevY = gesturePointersRef.current.right.y;
            gesturePointersRef.current.right.x = x;
            gesturePointersRef.current.right.y = y;
            gesturePointersRef.current.right.isActive = true;
            gesturePointersRef.current.right.lastUpdateTime = now;
          }

          pointerTrailRef.current.right.push({ x, y });
          if (pointerTrailRef.current.right.length > 12) {
            pointerTrailRef.current.right.shift();
          }
        }
      });
    }

    // 如果未激活，清空拖尾
    if (gesturePointersRef.current.left && !gesturePointersRef.current.left.isActive) {
      pointerTrailRef.current.left = [];
    }
    if (gesturePointersRef.current.right && !gesturePointersRef.current.right.isActive) {
      pointerTrailRef.current.right = [];
    }

  }, [handResultRef, canvasWidth, canvasHeight]);

  return {
    gesturePointersRef,
    pointerTrailRef,
    updatePointers
  };
};
