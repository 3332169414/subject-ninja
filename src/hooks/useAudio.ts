import { useRef, useState, useCallback, useEffect } from 'react';

export const useAudio = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  const bgmRef = useRef<HTMLAudioElement | null>(null);

  // 初始化背景音乐
  useEffect(() => {
    bgmRef.current = new Audio('/sounds/bgm.mp3');
    bgmRef.current.loop = true;
    bgmRef.current.volume = volume * 0.35; // 背景音乐默认相对较小
    
    // 防止加载失败导致崩溃
    bgmRef.current.addEventListener('error', (e) => {
      console.warn('BGM load failed. Game will continue without music.', e);
    });

    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);

  // 更新音量和静音状态
  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.muted = isMuted;
      bgmRef.current.volume = volume * 0.35;
    }
  }, [isMuted, volume]);

  const playBgm = useCallback(() => {
    if (bgmRef.current && !isMuted) {
      bgmRef.current.play().catch(e => console.warn('BGM play prevented by browser:', e));
    }
  }, [isMuted]);

  const stopBgm = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }
  }, []);

  const playSoundEffect = useCallback((path: string, volumeScale: number = 0.55) => {
    if (isMuted) return;
    
    // 每次新建 Audio 实例，保证连续切中时可以重叠播放
    const audio = new Audio(path);
    audio.volume = volume * volumeScale;
    
    audio.addEventListener('error', () => {
      console.warn(`Sound effect [${path}] load failed. Game will continue.`);
    });
    
    audio.play().catch(e => console.warn(`Sound effect play prevented:`, e));
  }, [isMuted, volume]);

  const playHitNormal = useCallback(() => playSoundEffect('/sounds/hit-normal.mp3'), [playSoundEffect]);
  const playHitLiked = useCallback(() => playSoundEffect('/sounds/hit-liked.mp3', 0.6), [playSoundEffect]);
  const playHitHated = useCallback(() => playSoundEffect('/sounds/hit-hated.mp3', 0.6), [playSoundEffect]);
  const playHitDanger = useCallback(() => playSoundEffect('/sounds/hit-danger.mp3', 0.8), [playSoundEffect]);
  
  const playGameOver = useCallback(() => {
    stopBgm();
    playSoundEffect('/sounds/game-over.mp3', 0.7);
  }, [playSoundEffect, stopBgm]);

  return {
    isMuted,
    volume,
    setMuted: setIsMuted,
    setVolume,
    playBgm,
    stopBgm,
    playHitNormal,
    playHitLiked,
    playHitHated,
    playHitDanger,
    playGameOver
  };
};
