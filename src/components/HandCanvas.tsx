import React, { useRef, useEffect, RefObject } from 'react';
import { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { getMirroredHandSide } from '../utils/handedness';

interface HandCanvasProps {
  handResultRef: RefObject<HandLandmarkerResult | null>;
}

// MediaPipe 官方定义的手部骨骼连接关系
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], // 拇指
  [0, 5], [5, 6], [6, 7], [7, 8], // 食指
  [5, 9], [9, 10], [10, 11], [11, 12], // 中指
  [9, 13], [13, 14], [14, 15], [15, 16], // 无名指
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20] // 小指及手掌底
];

export const HandCanvas: React.FC<HandCanvasProps> = ({ handResultRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 适配 Canvas 大小
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const renderLoop = () => {
      ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
      const results = handResultRef.current;

      // 使用逻辑视口宽高计算
      const logicalWidth = window.innerWidth;
      const logicalHeight = window.innerHeight;

      if (results && results.landmarks) {
        results.landmarks.forEach((landmarks, index) => {
          const handedness = results.handedness?.[index]?.[0] ?? results.handednesses?.[index]?.[0];
          const side = getMirroredHandSide(handedness); // 判断左右手
          if (!side) return;

          // 绘制骨骼连接线
          ctx.strokeStyle = 'rgba(0, 255, 255, 0.75)';
          ctx.lineWidth = 2;
          
          HAND_CONNECTIONS.forEach(([i, j]) => {
            const p1 = landmarks[i];
            const p2 = landmarks[j];
            
            // 注意坐标镜像转换：因为视频 scaleX(-1)，Canvas 坐标也需要水平翻转 (1 - x)
            const x1 = (1 - p1.x) * logicalWidth;
            const y1 = p1.y * logicalHeight;
            const x2 = (1 - p2.x) * logicalWidth;
            const y2 = p2.y * logicalHeight;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          });

          // 绘制关键点
          landmarks.forEach((point, i) => {
            const x = (1 - point.x) * logicalWidth;
            const y = point.y * logicalHeight;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            
            // 食指指尖(第8点)特殊高亮
            if (i === 8) {
              ctx.fillStyle = '#00FF99'; // 青绿色高亮
              ctx.shadowColor = '#00FF99';
              ctx.shadowBlur = 10;
              ctx.arc(x, y, 6, 0, 2 * Math.PI); // 更大一点
            } else {
              ctx.fillStyle = 'rgba(0, 255, 255, 0.95)';
              ctx.shadowBlur = 0;
            }
            
            ctx.fill();
          });

          // 绘制文字提示 (在手腕处 0点)
          const wrist = landmarks[0];
          const wristX = (1 - wrist.x) * logicalWidth;
          const wristY = wrist.y * logicalHeight;
          
          ctx.font = '16px "Courier New", monospace';
          ctx.fillStyle = side === 'Left' ? '#FFB86C' : '#8BE9FD'; // 左手橙色，右手青色
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 4;
          ctx.fillText(side === 'Left' ? '左手' : '右手', wristX + 15, wristY + 15);
          ctx.shadowBlur = 0; // 重置阴影
        });
      }

      requestRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [handResultRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // 不阻挡底层点击事件
        zIndex: 10
      }}
    />
  );
};
