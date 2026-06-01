import React, { useEffect, useState } from 'react';
import { HitRecord } from '../types/game';

interface HitFeedbackProps {
  lastHit: HitRecord | null;
}

export const HitFeedback: React.FC<HitFeedbackProps> = ({ lastHit }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (lastHit) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 600); // 600ms 后淡出
      return () => clearTimeout(timer);
    }
  }, [lastHit]);

  if (!lastHit || !visible) return null;

  // Determine feedback color based on hitType
  let fbColor = '#FFFF00'; // normal
  let fbShadow = '0 0 15px #FFFF00';
  if (lastHit.hitType === 'liked') {
    fbColor = 'var(--like-color)';
    fbShadow = '0 0 15px var(--like-color)';
  } else if (lastHit.hitType === 'hated' || lastHit.hitType === 'danger') {
    fbColor = 'var(--hate-color)';
    fbShadow = '0 0 15px var(--hate-color)';
  }

  return (
    <>
      {lastHit.hitType === 'danger' && <div className="danger-flash-overlay"></div>}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 50,
        animation: 'feedback-fade 0.6s ease-out forwards',
      }}>
        <style>
          {`
            @keyframes feedback-fade {
              0% { opacity: 0; transform: translate(-50%, -30%) scale(0.8); }
              20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
              80% { opacity: 1; transform: translate(-50%, -60%) scale(1); }
              100% { opacity: 0; transform: translate(-50%, -80%) scale(0.9); }
            }
          `}
        </style>
        
        <div style={{ color: fbColor, fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', textShadow: fbShadow }}>
          {lastHit.itemType === 'flame' || lastHit.itemType === 'bomb' ? (
            `警告：切中${lastHit.objectName}！`
          ) : (
            `切中：${lastHit.subjectName} - ${lastHit.objectName}`
          )}
        </div>
        
        <div style={{ fontSize: '1.5rem', color: fbColor, textShadow: fbShadow }}>
          {lastHit.itemType === 'bomb' ? '致命危险！' : `得分：${lastHit.scoreDelta > 0 ? '+' : ''}${lastHit.scoreDelta}`}
        </div>
      </div>
    </>
  );
};