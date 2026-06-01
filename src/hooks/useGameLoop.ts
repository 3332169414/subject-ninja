import { useRef, useCallback, useEffect } from 'react';

type LoopCallback = (deltaTime: number) => void;

export const useGameLoop = (callback: LoopCallback) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const isRunningRef = useRef<boolean>(false);

  const loop = useCallback((time: number) => {
    if (!isRunningRef.current) return;

    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(loop);
  }, [callback]);

  const startLoop = useCallback(() => {
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      previousTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(loop);
    }
  }, [loop]);

  const stopLoop = useCallback(() => {
    isRunningRef.current = false;
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    previousTimeRef.current = undefined;
  }, []);

  // 组件卸载时自动停止
  useEffect(() => {
    return () => {
      stopLoop();
    };
  }, [stopLoop]);

  return {
    startLoop,
    stopLoop,
    isRunningRef
  };
};