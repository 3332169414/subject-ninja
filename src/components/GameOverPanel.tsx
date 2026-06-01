import React from 'react';

interface GameOverPanelProps {
  score: number;
  level: number;
  onRestart: () => void;
}

export const GameOverPanel: React.FC<GameOverPanelProps> = ({ score, level, onRestart }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
      <div className="glass-panel" style={{ 
        width: '80%', 
        maxWidth: '600px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        padding: '3rem',
        border: '1px solid var(--hate-color)',
        boxShadow: '0 0 30px rgba(255, 51, 102, 0.3), inset 0 0 20px rgba(255, 51, 102, 0.1)',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        
        <h2 className="text-glow-hate" style={{ fontSize: '4rem', margin: '0 0 1rem 0', letterSpacing: '0.1em' }}>
          SYSTEM FAILURE
        </h2>
        
        <div style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '2rem', opacity: 0.9 }}>
          厌恶学科阈值超出限制，系统崩溃。
        </div>

        <div style={{ display: 'flex', gap: '3rem', marginBottom: '3rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--primary-cyan)', fontSize: '1rem', marginBottom: '0.5rem' }}>最终得分</div>
            <div className="text-glow-cyan" style={{ fontSize: '3rem', fontWeight: 'bold' }}>{score}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--primary-cyan)', fontSize: '1rem', marginBottom: '0.5rem' }}>抵达关卡</div>
            <div className="text-glow-cyan" style={{ fontSize: '3rem', fontWeight: 'bold' }}>{level}</div>
          </div>
        </div>

        <button 
          className="cyber-btn" 
          onClick={onRestart}
          style={{ borderColor: 'var(--hate-color)', color: 'var(--hate-color)', textShadow: '0 0 5px var(--hate-color)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--hate-color)';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.boxShadow = '0 0 20px var(--hate-color)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--hate-color)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 51, 102, 0.2)';
          }}
        >
          重新启动 REBOOT SYSTEM
        </button>
      </div>
    </div>
  );
};