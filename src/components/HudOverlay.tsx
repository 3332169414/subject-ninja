import React from 'react';
import { TrackedHand, SubjectId } from '../types/game';
import { SUBJECTS } from '../data/subjects';
import { AlertTriangle, LogOut, Pause, Play, Shield } from 'lucide-react';

interface HudOverlayProps {
  score: number;
  hitCount: number;
  enableGesture: boolean;
  leftHand: TrackedHand | null;
  rightHand: TrackedHand | null;
  level: number;
  timeLeft: number;
  bombCount?: number;
  likedSubjects?: SubjectId[];
  hatedSubjects?: SubjectId[];
  isPaused?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onExit?: () => void;
}

export const HudOverlay: React.FC<HudOverlayProps> = ({ 
  score, 
  hitCount, 
  enableGesture, 
  leftHand, 
  rightHand,
  level,
  timeLeft,
  bombCount = 0,
  likedSubjects = [],
  hatedSubjects = [],
  isPaused = false,
  onPause,
  onResume,
  onExit
}) => {
  const getSubjectNames = (ids: SubjectId[]) => {
    return ids.map(id => SUBJECTS.find(s => s.id === id)?.name || id).join('、');
  };

  return (
    <div className="hud-overlay" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none', // 不阻挡鼠标事件
      zIndex: 40,
      padding: 'clamp(0.75rem, 2vw, 2rem)',
      boxSizing: 'border-box'
    }}>
      <div className="glass-panel hud-compact-panel hud-left-panel" style={{
        pointerEvents: 'auto',
        padding: '1rem 1.2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.7rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-cyan)', fontWeight: 'bold' }}>
          <Shield size={18} />
          获得分数
        </div>
        <div className="text-glow-cyan" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 'bold', lineHeight: 1 }}>
          {score}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', color: '#fff', fontSize: '0.95rem' }}>
          <span>关卡：{level}</span>
          <span>命中：{hitCount}</span>
          <span style={{ color: timeLeft <= 10 ? 'var(--hate-color)' : '#fff' }}>时间：{Math.ceil(timeLeft)}秒</span>
          {level >= 5 && <span style={{ color: 'var(--hate-color)' }}>炸弹：{bombCount}/2</span>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.95rem', lineHeight: 1.45 }}>
          <span style={{ color: leftHand && enableGesture ? 'var(--like-color)' : '#FFB86C' }}>
            {leftHand && enableGesture ? '左手已识别' : '左手未识别'}
          </span>
          <span style={{ color: rightHand && enableGesture ? 'var(--like-color)' : '#FFB86C' }}>
            {rightHand && enableGesture ? '右手已识别' : '右手未识别'}
          </span>
        </div>
      </div>

      <div className="glass-panel hud-compact-panel hud-right-panel" style={{
        pointerEvents: 'auto',
        padding: '1rem 1.2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            className="cyber-btn"
            onClick={isPaused ? onResume : onPause}
            style={{ padding: '8px 14px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? '继续' : '暂停'}
          </button>
          <button
            className="cyber-btn"
            onClick={onExit}
            style={{ padding: '8px 14px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', borderColor: 'var(--hate-color)', color: 'var(--hate-color)' }}
          >
            <LogOut size={16} />
            退出
          </button>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-cyan)', fontWeight: 'bold', marginBottom: '0.8rem' }}>
            <AlertTriangle size={18} />
            本关目标
          </div>
          <div style={{ marginBottom: '0.9rem' }}>
            <div style={{ color: 'var(--like-color)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>优先切中</div>
            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.05rem', lineHeight: 1.5 }}>
              {likedSubjects.length > 0 ? getSubjectNames(likedSubjects) : '暂无'}
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--hate-color)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>尽量避开</div>
            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.05rem', lineHeight: 1.5 }}>
              {hatedSubjects.length > 0 ? getSubjectNames(hatedSubjects) : '暂无'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
