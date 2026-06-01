import React, { useEffect, useState } from 'react';
import { SubjectId } from '../types/game';
import { SUBJECTS } from '../data/subjects';

interface LevelIntroPanelProps {
  level: number;
  likedSubjectIds: SubjectId[];
  hatedSubjectIds: SubjectId[];
  fallSpeed: number;
  spawnInterval: number;
  maxItems: number;
}

export const LevelIntroPanel: React.FC<LevelIntroPanelProps> = ({
  level,
  likedSubjectIds,
  hatedSubjectIds,
  fallSpeed,
  spawnInterval,
  maxItems
}) => {
  const [countdown, setCountdown] = useState(6);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 1 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getSubjectNames = (ids: SubjectId[]) => {
    return ids.map(id => SUBJECTS.find(s => s.id === id)?.name || id).join('、');
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 30 }}>
      <div className="glass-panel" style={{ 
        width: '80%', 
        maxWidth: '800px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        padding: '3rem',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
          `}
        </style>
        
        <h2 className="text-glow-cyan" style={{ fontSize: '3rem', margin: '0 0 2rem 0', letterSpacing: '0.1em' }}>
          第 <span style={{ fontSize: '4rem', color: '#fff' }}>{level}</span> 关
        </h2>

        <div style={{ display: 'flex', gap: '2rem', width: '100%', marginBottom: '2.5rem' }}>
          {/* 喜爱学科 */}
          <div style={{ 
            flex: 1, 
            background: 'rgba(0,255,153,0.1)', 
            border: '1px solid var(--like-color)', 
            borderRadius: '8px', 
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <h3 className="text-glow-like" style={{ margin: '0 0 1rem 0' }}>本关喜爱学科</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
              {getSubjectNames(likedSubjectIds)}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--like-color)', marginTop: '0.5rem' }}>切中获得高分，可抵消厌恶</div>
          </div>

          {/* 厌恶学科 */}
          <div style={{ 
            flex: 1, 
            background: 'rgba(255,51,102,0.1)', 
            border: '1px solid var(--hate-color)', 
            borderRadius: '8px', 
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <h3 className="text-glow-hate" style={{ margin: '0 0 1rem 0' }}>本关厌恶学科</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
              {getSubjectNames(hatedSubjectIds)}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--hate-color)', marginTop: '0.5rem' }}>切中将大幅扣分并增加厌恶</div>
          </div>
        </div>

        {/* 危险物提示 */}
        {level >= 3 && (
          <div style={{ width: '100%', background: 'rgba(255,140,0,0.1)', border: '1px solid #FF8C00', borderRadius: '8px', padding: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
            <h3 style={{ color: '#FF8C00', margin: '0 0 0.5rem 0', textShadow: '0 0 10px #FF8C00' }}>⚠️ 关卡特殊规则</h3>
            <div style={{ color: '#fff', fontSize: '1rem', lineHeight: '1.6' }}>
              {level >= 3 && <div style={{ color: '#fff' }}>第3关开始：所有学科物件的描边变为白色，请仔细辨认。</div>}
              {level >= 4 && <div style={{ color: '#FF8C00' }}>🔥 第4关开始：将出现掉落火焰，切中扣 5 分并增加 1 次厌恶！</div>}
              {level >= 5 && <div style={{ color: '#FF3366' }}>💣 第5关开始：将出现致命炸弹，一局内切中 2 次炸弹直接结束游戏！</div>}
            </div>
          </div>
        )}

        {/* 难度参数 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'rgba(0,0,0,0.5)', padding: '1rem 2rem', borderRadius: '8px', border: '1px solid rgba(0,255,255,0.2)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--primary-cyan)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>掉落速度</div>
            <div className="text-glow-cyan" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{fallSpeed} px/s</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--primary-cyan)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>掉落间隔</div>
            <div className="text-glow-cyan" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{spawnInterval} ms</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--primary-cyan)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>同屏上限</div>
            <div className="text-glow-cyan" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{maxItems}</div>
          </div>
        </div>

        {/* 倒计时 */}
        <div style={{ marginTop: '3rem', fontSize: '1.5rem', color: '#FFB86C', fontWeight: 'bold', letterSpacing: '0.05em' }}>
          {countdown > 0 ? `${countdown} 秒后开始` : 'GAME START'}
        </div>
      </div>
    </div>
  );
};