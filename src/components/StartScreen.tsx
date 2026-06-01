import React, { useEffect, useState } from 'react';
import { Info, Play, X } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  onMouseDebug: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, onMouseDebug }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showDemoTrailer, setShowDemoTrailer] = useState(false);

  useEffect(() => {
    if (!showDemoTrailer) return;

    const timer = window.setTimeout(() => {
      setShowDemoTrailer(false);
    }, 16000);

    return () => window.clearTimeout(timer);
  }, [showDemoTrailer]);

  return (
    <div className="glass-panel start-screen">
      
      {/* 演示模式按钮 */}
      <div className="start-top-action start-top-action-right">
        <button
          className="cyber-btn"
          onClick={() => setShowDemoTrailer(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Play size={16} />
          演示模式
        </button>
      </div>

      {/* 左上角项目说明按钮 */}
      <div className="start-top-action start-top-action-left">
        <button 
          className="cyber-btn"
          onClick={() => setShowInfo(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Info size={18} />
          项目说明
        </button>
      </div>

      {/* 项目说明弹窗 */}
      {showInfo && (
        <div className="modal-backdrop">
          <div className="glass-panel info-modal">
            <button 
              onClick={() => setShowInfo(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--primary-cyan)',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              <X size={24} />
            </button>
            <div className="text-glow-cyan info-modal-title">[ 项目说明 ]</div>
            <div className="info-modal-body">
              <div><span style={{ color: 'var(--primary-cyan)' }}>项目名称：</span>学科忍者：知识乱斗</div>
              <div><span style={{ color: 'var(--primary-cyan)' }}>核心技术：</span>React, TypeScript, Vite, MediaPipe, Canvas</div>
              <div style={{ marginTop: '1rem' }}><span style={{ color: 'var(--like-color)' }}>创新点：</span>用手势捕捉把学科学习偏好做成体感游戏</div>
              <div style={{ marginTop: '1rem' }}><span style={{ color: '#FFB86C' }}>玩法亮点：</span>喜爱/厌恶学科随机变化，带来策略选择</div>
            </div>
            <button
              className="cyber-btn"
              onClick={() => setShowInfo(false)}
              style={{ marginTop: '2rem', padding: '10px 28px', fontSize: '1rem' }}
            >
              返回
            </button>
          </div>
        </div>
      )}

      {/* 演示预告浮层 */}
      {showDemoTrailer && (
        <div className="demo-trailer-overlay">
          <div className="demo-trailer-progress"></div>
          <button
            className="cyber-btn demo-trailer-back"
            onClick={() => setShowDemoTrailer(false)}
          >
            返回
          </button>

          <div className="demo-trailer-grid"></div>
          <div className="demo-trailer-vignette"></div>

          <header className="demo-trailer-header">
            <div className="demo-trailer-kicker">玩法预告</div>
            <div className="demo-trailer-title text-glow-cyan">演示模式</div>
          </header>

          <div className="demo-stage-list">
            <div className="demo-stage demo-stage-1">1. 锁定双手</div>
            <div className="demo-stage demo-stage-2">2. 物件掉落</div>
            <div className="demo-stage demo-stage-3">3. 切中加分</div>
            <div className="demo-stage demo-stage-4">4. 避开厌恶</div>
          </div>

          <div className="demo-trailer-hud demo-trailer-hud-left">
            <span>获得分数</span>
            <strong>+18</strong>
            <small>左手已识别<br />右手已识别</small>
          </div>

          <div className="demo-trailer-hud demo-trailer-hud-right">
            <strong className="demo-like">优先切中：语文、数学</strong>
            <strong className="demo-hate">尽量避开：音乐、历史</strong>
          </div>

          <div className="demo-trailer-scene">
            <div className="demo-trailer-card demo-card-normal">
              <span>📐</span>
              <strong>数学</strong>
            </div>
            <div className="demo-trailer-card liked demo-card-liked">
              <span>📖</span>
              <strong>语文 +3</strong>
            </div>
            <div className="demo-trailer-card hated demo-card-hated">
              <span>🎸</span>
              <strong>音乐 -3</strong>
            </div>
            <div className="demo-trailer-card demo-card-extra">
              <span>🔬</span>
              <strong>生物</strong>
            </div>
          </div>

          <div className="demo-hand demo-hand-left">左手食指</div>
          <div className="demo-hand demo-hand-right">右手食指</div>
          <div className="demo-trailer-slash demo-trailer-slash-a"></div>
          <div className="demo-trailer-slash demo-trailer-slash-b"></div>
          <div className="demo-trailer-slash demo-trailer-slash-c"></div>
          <div className="demo-score-pop demo-score-pop-a">+3</div>
          <div className="demo-score-pop demo-score-pop-b">避开！</div>

          <div className="demo-trailer-caption caption-1">举起双手，系统锁定左右食指</div>
          <div className="demo-trailer-caption caption-2">学科物件会从屏幕上方不断掉落</div>
          <div className="demo-trailer-caption caption-3">切中喜爱学科获得更高分</div>
          <div className="demo-trailer-caption caption-4">避开厌恶学科，准备进入实战</div>

          <div className="demo-final-card">
            <div className="text-glow-cyan">演示结束</div>
            <p>现在可以进入真实手势体验</p>
            <button
              className="cyber-btn"
              onClick={() => {
                setShowDemoTrailer(false);
                onStart();
              }}
            >
              开始体验
            </button>
          </div>
        </div>
      )}

      {/* 动态视觉预告层 */}
      <div className="trailer-container">
        {/* 物件 1 */}
        <div className="trailer-item" style={{ left: '20%', animationDelay: '0s', borderColor: 'var(--primary-cyan)', boxShadow: '0 0 15px var(--primary-cyan)' }}>📐</div>
        
        {/* 物件 2 */}
        <div className="trailer-item" style={{ left: '70%', animationDelay: '1.5s', borderColor: 'var(--like-color)', boxShadow: '0 0 15px var(--like-color)' }}>🔬</div>

        {/* 物件 3 */}
        <div className="trailer-item" style={{ left: '45%', animationDelay: '2.8s', borderColor: 'var(--hate-color)', boxShadow: '0 0 15px var(--hate-color)' }}>📜</div>
      </div>

      <h1 className="text-glow-cyan start-title">
        学科忍者：知识乱斗
      </h1>
      
      <p className="start-subtitle">
        用双手切开掉落的学科物件，避开你本局的<span className="text-glow-hate">厌恶学科</span>。
      </p>
      
      <div className="start-actions">
        <button className="cyber-btn" onClick={onStart}>
          启动全息手势模式
        </button>
        <button 
          className="cyber-btn" 
          onClick={onMouseDebug}
          style={{ background: 'transparent', borderStyle: 'dashed', opacity: 0.8 }}
        >
          触摸/鼠标调试模式
        </button>
      </div>

      <div className="start-hint">
        <div>提示：建议保持上半身入镜，距离屏幕 0.8~1.5 米，并保证双手清晰可见。</div>
        <div style={{ marginTop: '0.5rem', color: '#FFB86C' }}>如无摄像头或需要测试，可使用触摸/鼠标调试模式，按住并拖动进行切割。</div>
      </div>
    </div>
  );
};
