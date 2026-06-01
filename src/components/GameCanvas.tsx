import React, { useEffect, useRef } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { createFallingItem } from '../engine/spawnSystem';
import { FallingItem, HitRecord, DifficultyConfig } from '../types/game';
import { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { useGesturePointer } from '../hooks/useGesturePointer';
import { checkGestureHits } from '../engine/collisionSystem';

interface GameCanvasProps {
  handResultRef: React.RefObject<HandLandmarkerResult | null>;
  enableGesture: boolean;
  enableMouseDebug: boolean;
  difficultyConfig: DifficultyConfig;
  isPaused: boolean;
  isGameOver?: boolean;
  onHit: (record: HitRecord) => void;
  updateStats: (speed: number, itemCount: number, particleCount: number) => void;
  likedSubjects?: string[];
  hatedSubjects?: string[];
  level: number;
}

// 粒子效果接口
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ 
  handResultRef, 
  enableGesture, 
  enableMouseDebug, 
  difficultyConfig,
  isPaused,
  isGameOver = false,
  onHit, 
  updateStats,
  likedSubjects = [],
  hatedSubjects = [],
  level
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 游戏核心状态 (高频更新，不使用 useState 避免重渲染)
  const itemsRef = useRef<FallingItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  
  // 时间与生成控制
  const lastSpawnTimeRef = useRef<number>(0);
  const gameTimeMsRef = useRef<number>(0);

  // 鼠标切割轨迹状态
  const isMouseDownRef = useRef<boolean>(false);
  const mousePosRef = useRef<{x: number, y: number} | null>(null);
  const mouseTrailRef = useRef<{x: number, y: number}[]>([]);

  // 危险物生成控制
  const levelRef = useRef(level);
  const targetFlamesRef = useRef(0);
  const targetBombsRef = useRef(0);
  const flamesSpawnedRef = useRef(0);
  const bombsSpawnedRef = useRef(0);

  useEffect(() => {
    if (level !== levelRef.current || level === 1) {
      levelRef.current = level;
      flamesSpawnedRef.current = 0;
      bombsSpawnedRef.current = 0;
      targetFlamesRef.current = level >= 4 ? Math.floor(Math.random() * 4) + 2 : 0; // 2-5
      targetBombsRef.current = level >= 5 ? Math.floor(Math.random() * 4) + 2 : 0; // 2-5
    }
  }, [level]);

  // 清空逻辑：当游戏结束时，清空掉落物
  useEffect(() => {
    if (isGameOver) {
      itemsRef.current = [];
      particlesRef.current = [];
    }
  }, [isGameOver]);

  // 手势指针处理 Hook
  const { gesturePointersRef, pointerTrailRef, updatePointers } = useGesturePointer({
    handResultRef,
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight
  });

  // 预加载的图片缓存
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const failedImageSetRef = useRef<Set<string>>(new Set());

  const createExplosion = (x: number, y: number, color: string = '#00FFFF') => {
    const particleCount = 15;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 200 + 50;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 1.0,
        color: i % 2 === 0 ? color : '#FFFFFF'
      });
    }
    // 限制同屏粒子数量
    if (particlesRef.current.length > 300) {
      particlesRef.current.splice(0, particlesRef.current.length - 300);
    }
  };

  const handleHit = (item: FallingItem, handSide: 'Left' | 'Right' | 'mouse') => {
    item.selected = true;
    
    // 获取对应的爆炸颜色
    let explodeColor = '#FFFF00';
    if (likedSubjects.includes(item.subjectId)) {
      explodeColor = '#00FF99';
    } else if (hatedSubjects.includes(item.subjectId)) {
      explodeColor = '#FF3366';
    }
    if (item.itemType === 'flame') explodeColor = '#FF8C00';
    if (item.itemType === 'bomb') explodeColor = '#8B0000';

    createExplosion(item.x, item.y, explodeColor);
    
    // 我们不再在 GameCanvas 中生成完整的 hitRecord，而是把计算分数交出去
    // 这里生成一个不包含 scoreDelta 和 hitType 的 PartialRecord
    // 然后由父组件 App.tsx 根据当前游戏规则补充完整。
    const partialRecord = {
      id: `hit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      itemType: item.itemType,
      subjectId: item.subjectId,
      subjectName: item.subjectName,
      objectName: item.objectName,
      createdAt: Date.now(),
      x: item.x,
      y: item.y,
      handSide
    };
    
    // @ts-ignore - 在上层处理完整逻辑
    onHit(partialRecord);
  };

  const { startLoop, stopLoop } = useGameLoop((deltaTime) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isPaused) {
      // 暂停时不清空画布，也不更新逻辑，只返回
      return;
    }

    // 更新时间
    gameTimeMsRef.current += deltaTime;
    const dtSeconds = deltaTime / 1000;
    
    // 定期上报状态给 HUD (包括性能统计)
    const elapsedSeconds = gameTimeMsRef.current / 1000;
    if (Math.floor(elapsedSeconds) % 2 === 0) {
      updateStats(difficultyConfig.baseFallSpeed, itemsRef.current.length, particlesRef.current.length);
    }

    // 生成新物件
    if (gameTimeMsRef.current - lastSpawnTimeRef.current > difficultyConfig.spawnInterval && itemsRef.current.length < difficultyConfig.maxItems) {
      // 决定生成什么类型的物件
      let itemType: 'subject' | 'flame' | 'bomb' = 'subject';
      
      // 有一定概率生成火焰或炸弹（如果在配额内）
      const canSpawnFlame = flamesSpawnedRef.current < targetFlamesRef.current;
      const canSpawnBomb = bombsSpawnedRef.current < targetBombsRef.current;
      
      if (canSpawnFlame || canSpawnBomb) {
        const rand = Math.random();
        // 给 15% 的概率在这个生成周期生成危险物
        if (rand < 0.15) {
          if (canSpawnFlame && canSpawnBomb) {
            itemType = Math.random() > 0.5 ? 'flame' : 'bomb';
          } else if (canSpawnFlame) {
            itemType = 'flame';
          } else {
            itemType = 'bomb';
          }
        }
      }

      if (itemType === 'flame') flamesSpawnedRef.current++;
      if (itemType === 'bomb') bombsSpawnedRef.current++;

      itemsRef.current.push(createFallingItem({
        baseVy: difficultyConfig.baseFallSpeed,
        screenWidth: canvas.width,
        itemType
      }));
      lastSpawnTimeRef.current = gameTimeMsRef.current;
    }

    // 更新物件位置
    itemsRef.current = itemsRef.current.filter(item => {
      if (item.selected) return false;
      
      item.x += item.vx * dtSeconds * 60; 
      item.y += item.vy * dtSeconds;
      item.rotation += item.rotationSpeed;

      if (item.y > canvas.height + item.radius) {
        return false;
      }
      return true;
    });

    // 更新粒子
    particlesRef.current = particlesRef.current.filter(p => {
      p.x += p.vx * dtSeconds;
      p.y += p.vy * dtSeconds;
      p.life -= dtSeconds * 1.5; 
      return p.life > 0;
    });

    // --- 碰撞检测逻辑 ---

    // 1. 鼠标调试模式碰撞检测
    if (enableMouseDebug && isMouseDownRef.current && mousePosRef.current) {
      const { x: mx, y: my } = mousePosRef.current;
      itemsRef.current.forEach(item => {
        if (item.selected) return;
        const dx = item.x - mx;
        const dy = item.y - my;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < item.radius) {
          handleHit(item, 'mouse');
        }
      });
    }

    // 2. 手势模式碰撞检测
    if (enableGesture) {
      updatePointers();
      
      const gesturePointers = gesturePointersRef.current;
      const { hitRecords, updatedItems } = checkGestureHits({
        fallingItems: itemsRef.current,
        gesturePointers: gesturePointers,
        pointerTrail: pointerTrailRef.current,
        currentTime: gameTimeMsRef.current
      });
      
      itemsRef.current = updatedItems;
      hitRecords.forEach(record => {
        // 根据 record 信息计算颜色，但我们只有部分信息
        let explodeColor = '#FFFF00';
        if (record.itemType === 'flame') {
          explodeColor = '#FF8C00';
        } else if (record.itemType === 'bomb') {
          explodeColor = '#8B0000';
        } else if (likedSubjects.includes(record.subjectId)) {
          explodeColor = '#00FF99';
        } else if (hatedSubjects.includes(record.subjectId)) {
          explodeColor = '#FF3366';
        }
        createExplosion(record.x, record.y, explodeColor);
        onHit(record);
      });
    }

    // --- 绘制阶段 ---
    // 因为已经缩放了 context，我们需要用原始尺寸清除
    ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));

    // 1. 绘制物件
    itemsRef.current.forEach(item => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rotation);

      let strokeColor = '#FFFF00'; // 正常学科为黄色
      if (level >= 3) {
        strokeColor = '#FFFFFF'; // 第3关开始，统一为白色
      } else if (likedSubjects.includes(item.subjectId)) {
        strokeColor = '#00FF99'; // 喜爱学科为绿色
      } else if (hatedSubjects.includes(item.subjectId)) {
        strokeColor = '#FF3366'; // 厌恶学科为红色
      }

      // 危险物的特定颜色（覆盖白色规则以便于识别）
      if (item.itemType === 'flame') {
        strokeColor = '#FF8C00'; // 火焰：橙色
      } else if (item.itemType === 'bomb') {
        strokeColor = '#8B0000'; // 炸弹：深红色
      }

      // 绘制发光圆形底盘
      ctx.beginPath();
      ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 20, 30, 0.8)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = strokeColor;
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0; 

      // 绘制 Emoji / 图片
      // 优先级：PNG -> SVG -> Emoji
      if (item.image) {
        const pngUrl = item.image.replace('.svg', '.png');
        const svgUrl = item.image;
        
        let img = imageCacheRef.current.get(pngUrl);

        if (!img && !failedImageSetRef.current.has(pngUrl)) {
          img = new Image();
          img.src = pngUrl;
          imageCacheRef.current.set(pngUrl, img);
          
          img.onload = () => { /* let it draw next frame */ };
          img.onerror = () => {
            failedImageSetRef.current.add(pngUrl); // 标记 PNG 失败
            // 尝试加载 SVG
            if (!imageCacheRef.current.has(svgUrl) && !failedImageSetRef.current.has(svgUrl)) {
              const svgImg = new Image();
              svgImg.src = svgUrl;
              imageCacheRef.current.set(svgUrl, svgImg);
              svgImg.onerror = () => {
                failedImageSetRef.current.add(svgUrl);
              };
            }
          };
        }

        // 如果 PNG 失败，尝试用 SVG
        if (failedImageSetRef.current.has(pngUrl)) {
          img = imageCacheRef.current.get(svgUrl);
        }

        // 如果当前 img (PNG 或 SVG) 加载成功
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, -item.radius, -item.radius, item.radius * 2, item.radius * 2);
        } else {
          ctx.font = '40px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.emoji, 0, 0);
        }
      } else {
        // 没有配置图片的物件（如火焰、炸弹），直接绘制 Emoji
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.emoji, 0, 0);
      }

      // 绘制中文物件名
      ctx.font = 'bold 14px "Courier New", "Microsoft YaHei", sans-serif';
      ctx.fillStyle = strokeColor;
      ctx.textAlign = 'center';
      ctx.rotate(-item.rotation);
      ctx.fillText(item.objectName, 0, item.radius + 20);

      ctx.restore();
    });

    // 2. 绘制粒子
    particlesRef.current.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });

    // 3. 绘制鼠标轨迹 (调试)
    if (enableMouseDebug && mouseTrailRef.current.length > 1) {
      ctx.beginPath();
      ctx.moveTo(mouseTrailRef.current[0].x, mouseTrailRef.current[0].y);
      for (let i = 1; i < mouseTrailRef.current.length; i++) {
        ctx.lineTo(mouseTrailRef.current[i].x, mouseTrailRef.current[i].y);
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 4. 绘制手势轨迹
    if (enableGesture) {
      const drawTrail = (trail: {x: number, y: number}[], color: string) => {
        if (trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(trail[0].x, trail[0].y);
          for (let i = 1; i < trail.length; i++) {
            ctx.lineTo(trail[i].x, trail[i].y);
          }
          ctx.strokeStyle = color;
          ctx.lineWidth = 6;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowColor = color;
          ctx.shadowBlur = 15;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      };

      if (gesturePointersRef.current.left?.isActive) {
        drawTrail(pointerTrailRef.current.left, 'rgba(0, 255, 255, 0.8)'); // 左手青色
      }
      if (gesturePointersRef.current.right?.isActive) {
        drawTrail(pointerTrailRef.current.right, 'rgba(0, 255, 153, 0.8)'); // 右手绿色
      }
    }
  });

  // 处理 Canvas Resize 与 DPR
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2); // 限制最大DPR为2
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        
        // 我们通过 css 控制其实际大小
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        
        // 缩放 context 以匹配 DPR
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(dpr, dpr);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    startLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      stopLoop();
    };
  }, [startLoop, stopLoop]);

  // 鼠标事件处理
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!enableMouseDebug) return;
    isMouseDownRef.current = true;
    mousePosRef.current = { x: e.clientX, y: e.clientY };
    mouseTrailRef.current = [{ x: e.clientX, y: e.clientY }];
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!enableMouseDebug) return;
    if (isMouseDownRef.current) {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      mouseTrailRef.current.push({ x: e.clientX, y: e.clientY });
      if (mouseTrailRef.current.length > 10) {
        mouseTrailRef.current.shift();
      }
    }
  };

  const handlePointerUp = () => {
    isMouseDownRef.current = false;
    mousePosRef.current = null;
    mouseTrailRef.current = [];
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 15,
        touchAction: 'none'
      }}
    />
  );
};
