import { useState, useEffect } from 'react';
import './styles/globals.css';
import { StartScreen } from './components/StartScreen';
import { RulePanel } from './components/RulePanel';
import { StartCalibration } from './components/StartCalibration';
import { LevelIntroPanel } from './components/LevelIntroPanel';
import { CameraBackground } from './components/CameraBackground';
import { HandCanvas } from './components/HandCanvas';
import { GameCanvas } from './components/GameCanvas';
import { HudOverlay } from './components/HudOverlay';
import { HitFeedback } from './components/HitFeedback';
import { GameOverPanel } from './components/GameOverPanel';
import { useCamera } from './hooks/useCamera';
import { useHandTracking } from './hooks/useHandTracking';
import { useAudio } from './hooks/useAudio';
import { HitRecord, SubjectId } from './types/game';
import { createNextLevelConfig, getDifficultyByLevel } from './engine/levelSystem';
import { calculateScore } from './engine/scoreSystem';
import { runScoreSystemSelfTest } from './engine/scoreSystem.test';
import { SUBJECTS } from './data/subjects';

type PageState = 'idle' | 'rule' | 'calibrating' | 'levelIntro' | 'playing' | 'paused' | 'gameOver';

function App() {
  const [page, setPage] = useState<PageState>('idle');
  
  // 游戏全局状态
  const [score, setScore] = useState(0);
  const [hitCount, setHitCount] = useState(0);
  const [lastHit, setLastHit] = useState<HitRecord | null>(null);
  
  // 关卡相关状态
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(45);
  const [likedSubjects, setLikedSubjects] = useState<SubjectId[]>([]);
  const [hatedSubjects, setHatedSubjects] = useState<SubjectId[]>([]);
  const [hateCount, setHateCount] = useState(0);
  const [bombCount, setBombCount] = useState(0);
  const [lastHatedSubjectId, setLastHatedSubjectId] = useState<SubjectId | null>(null);

  // 新手引导状态
  const [showTutorial, setShowTutorial] = useState(true);

  // 挂载自测函数到 window，仅限开发模式可用
  useEffect(() => {
    if (import.meta.env.DEV) {
      // @ts-ignore
      window.runScoreSystemSelfTest = runScoreSystemSelfTest;
    }
  }, []);
  
  // 每次重置的 difficulty config
  const currentDifficulty = getDifficultyByLevel(level);

  // 共享摄像头和手势追踪的上下文
  const camera = useCamera();
  const tracking = useHandTracking();
  const { videoRef, stream, cameraStatus, startCamera, stopCamera } = camera;
  const {
    handResultRef,
    leftHand,
    rightHand,
    trackingStatus,
    startTracking,
    stopTracking,
  } = tracking;
  
  // 音频控制
  const { 
    playBgm, 
    stopBgm, 
    playHitNormal,
    playHitLiked,
    playHitHated,
    playHitDanger,
    playGameOver
  } = useAudio();

  const [enableMouseDebug, setEnableMouseDebug] = useState(false);
  const cameraPageActive = page === 'calibrating' || page === 'levelIntro' || page === 'playing' || page === 'paused' || page === 'gameOver';

  // 监听键盘按键开启鼠标调试模式
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        setEnableMouseDebug(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 页面状态切换时控制 BGM
  useEffect(() => {
    if (page === 'playing') {
      playBgm();
    } else {
      stopBgm();
    }
  }, [page, playBgm, stopBgm]);

  useEffect(() => {
    if (cameraPageActive) {
      void startCamera();
      return;
    }

    stopTracking();
    stopCamera();
  }, [cameraPageActive, startCamera, stopCamera, stopTracking]);

  useEffect(() => {
    if (!cameraPageActive || cameraStatus !== 'ready' || trackingStatus !== 'ready') return;

    const video = videoRef.current;
    if (!video) return;

    startTracking(video);

    return () => {
      stopTracking();
    };
  }, [cameraPageActive, cameraStatus, page, startTracking, stopTracking, trackingStatus, videoRef]);

  // 关卡流转：LevelIntro -> Playing
  useEffect(() => {
    let timer: number;
    if (page === 'levelIntro') {
      timer = window.setTimeout(() => {
        setPage('playing');
        setTimeLeft(45); // 重置时间
        // 如果是第一关，重置显示教程
        if (level === 1) {
          setShowTutorial(true);
        }
      }, 6000); // 从 3 秒改为 6 秒，给用户足够的阅读时间
    }
    return () => clearTimeout(timer);
  }, [page, level]);

  // Playing 倒计时
  useEffect(() => {
    let timer: number;
    if (page === 'playing') {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // 时间到，进入下一关
            handleNextLevel();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [page, level]);

  const handleNextLevel = () => {
    const nextLevel = level + 1;
    const config = createNextLevelConfig(SUBJECTS, nextLevel);
    setLevel(nextLevel);
    setLikedSubjects(config.likedSubjects);
    setHatedSubjects(config.hatedSubjects);
    setLastHatedSubjectId(null); // 每关清空连续厌恶标志
    setPage('levelIntro');
  };

  const handleRestart = () => {
    // 点击“重新开始”后清空状态，保留权限和音量
    setPage('idle');
    setScore(0);
    setHitCount(0);
    setLastHit(null);
    setLevel(1);
    setTimeLeft(45);
    setLikedSubjects([]);
    setHatedSubjects([]);
    setHateCount(0);
    setBombCount(0);
    setLastHatedSubjectId(null);
    setShowTutorial(true);
  };
  const handleStartGame = () => {
    // 防止重复调用
    if (page === 'levelIntro' || page === 'playing' || page === 'paused') return;

    // 首次进入第一关
    const config = createNextLevelConfig(SUBJECTS, 1);
    setLevel(1);
    setLikedSubjects(config.likedSubjects);
    setHatedSubjects(config.hatedSubjects);
    setScore(0);
    setHitCount(0);
    setLastHit(null);
    setHateCount(0);
    setBombCount(0);
    setLastHatedSubjectId(null);
    setPage('levelIntro');
  };

  const handlePause = () => {
    if (page === 'playing') {
      setPage('paused');
    }
  };

  const handleResume = () => {
    if (page === 'paused') {
      setPage('playing');
    }
  };

  const handleForceMouseDebug = () => {
    setEnableMouseDebug(true);
    setPage('rule');
  };

  // 决定是否启用手势
  const enableGesture = cameraStatus === 'ready' && trackingStatus === 'ready';

  const handleHit = (partialRecord: Partial<HitRecord>) => {
    // 优先处理危险物
    if (partialRecord.itemType === 'flame') {
      const fullRecord: HitRecord = {
        ...partialRecord,
        scoreDelta: -5,
        hitType: 'danger'
      } as HitRecord;
      
      setScore(prev => prev - 5);
      setHitCount(prev => prev + 1);
      setLastHit(fullRecord);
      playHitDanger();
      
      setHateCount(prev => {
        const newHateCount = prev + 1;
        if (newHateCount >= 5) {
          setTimeout(() => {
            setPage('gameOver');
            playGameOver();
          }, 100);
        }
        return newHateCount;
      });
      return;
    }

    if (partialRecord.itemType === 'bomb') {
      const fullRecord: HitRecord = {
        ...partialRecord,
        scoreDelta: 0,
        hitType: 'danger'
      } as HitRecord;
      
      setHitCount(prev => prev + 1);
      setLastHit(fullRecord);
      playHitDanger();

      setBombCount(prev => {
        const newBombCount = prev + 1;
        if (newBombCount >= 2) {
          setTimeout(() => {
            setPage('gameOver');
            playGameOver();
          }, 100);
        }
        return newBombCount;
      });
      return;
    }

    // 根据当前规则计算分数和惩罚
    const { scoreDelta, hateDelta, hitType, newLastHatedSubjectId } = calculateScore({
      hitSubjectId: partialRecord.subjectId as SubjectId,
      likedSubjects,
      hatedSubjects,
      currentHateCount: hateCount,
      lastHatedSubjectId
    });

    // 补全命中记录
    const fullRecord: HitRecord = {
      ...partialRecord,
      scoreDelta,
      hitType,
    } as HitRecord;

    setScore(prev => prev + scoreDelta);
    setHitCount(prev => prev + 1);
    setLastHit(fullRecord);
    setLastHatedSubjectId(newLastHatedSubjectId);

    // 更新厌恶次数并判断是否结束
    if (hateDelta !== 0) {
      setHateCount(prev => {
        const newHateCount = prev + hateDelta;
        if (newHateCount >= 5) {
          // 游戏结束
          setTimeout(() => {
            setPage('gameOver');
            playGameOver();
          }, 100);
        }
        return newHateCount;
      });
    }

    // 播放对应音效
    switch (hitType) {
      case 'liked': playHitLiked(); break;
      case 'hated': playHitHated(); break;
      case 'danger': playHitDanger(); break;
      default: playHitNormal(); break;
    }
  };

  return (
    <div className="cyber-bg">
      <div className="scanlines"></div>
      
      <div className="hud-container">
        {page === 'idle' && (
          <StartScreen 
            onStart={() => {
              setEnableMouseDebug(false);
              setPage('rule');
            }} 
            onMouseDebug={handleForceMouseDebug}
          />
        )}
        
        {page === 'rule' && (
          <RulePanel onAccept={() => setPage('calibrating')} />
        )}
        
        {page === 'calibrating' && (
          <StartCalibration 
            onBack={() => setPage('rule')} 
            onAccept={handleStartGame}
            camera={camera}
            tracking={tracking}
          />
        )}

        {page === 'levelIntro' && (
          <LevelIntroPanel
            level={level}
            likedSubjectIds={likedSubjects}
            hatedSubjectIds={hatedSubjects}
            fallSpeed={currentDifficulty.baseFallSpeed}
            spawnInterval={currentDifficulty.spawnInterval}
            maxItems={currentDifficulty.maxItems}
          />
        )}
        {page === 'gameOver' && (
          <GameOverPanel 
            score={score}
            level={level}
            onRestart={handleRestart}
          />
        )}
      </div>

      {(page === 'playing' || page === 'paused' || page === 'levelIntro' || page === 'gameOver') && (
        <>
          <CameraBackground videoRef={videoRef} stream={stream} />
          <HandCanvas handResultRef={handResultRef} />
          
          <GameCanvas 
            handResultRef={handResultRef}
            enableGesture={enableGesture}
            enableMouseDebug={enableMouseDebug || (!enableGesture)}
            difficultyConfig={currentDifficulty}
            isPaused={page !== 'playing'}
            onHit={handleHit} 
            updateStats={() => {}}
            isGameOver={page === 'gameOver'}
            likedSubjects={likedSubjects}
            hatedSubjects={hatedSubjects}
            level={level}
          />
          
          {(page === 'playing' || page === 'paused') && (
            <>
              <HudOverlay 
                score={score} 
                hitCount={hitCount} 
                enableGesture={enableGesture}
                leftHand={leftHand}
                rightHand={rightHand}
                level={level}
                timeLeft={timeLeft}
                bombCount={bombCount}
                isPaused={page === 'paused'}
                onPause={handlePause}
                onResume={handleResume}
                onExit={handleRestart}
              />
              <HitFeedback lastHit={lastHit} />

              {page === 'paused' && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 90,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.45)',
                  backdropFilter: 'blur(3px)',
                  pointerEvents: 'auto'
                }}>
                  <div className="glass-panel" style={{
                    width: 'min(520px, 86vw)',
                    padding: '2.5rem',
                    textAlign: 'center',
                    border: '1px solid var(--primary-cyan)',
                    boxShadow: '0 0 30px rgba(0, 255, 255, 0.28)'
                  }}>
                    <h2 className="text-glow-cyan" style={{ margin: '0 0 1rem 0', fontSize: '2.4rem', letterSpacing: '0.12em' }}>
                      游戏已暂停
                    </h2>
                    <p style={{ margin: '0 0 2rem 0', color: '#fff', opacity: 0.85 }}>
                      倒计时与掉落物已冻结，可继续本局或直接退出。
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <button className="cyber-btn" onClick={handleResume} style={{ padding: '10px 28px', fontSize: '1rem' }}>
                        继续游戏
                      </button>
                      <button
                        className="cyber-btn"
                        onClick={handleRestart}
                        style={{ padding: '10px 28px', fontSize: '1rem', borderColor: 'var(--hate-color)', color: 'var(--hate-color)' }}
                      >
                        退出本局
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 新手引导 Overlay */}
              {page === 'playing' && showTutorial && level === 1 && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(0, 30, 40, 0.9)',
                  border: '1px solid var(--primary-cyan)',
                  padding: '2rem 3rem',
                  borderRadius: '12px',
                  zIndex: 100,
                  boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)',
                  textAlign: 'center',
                  animation: 'fadeIn 0.5s ease-out'
                }}>
                  <h3 className="text-glow-cyan" style={{ margin: '0 0 1.5rem 0', fontSize: '1.8rem' }}>系统初始化完成</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ background: 'var(--primary-cyan)', color: '#000', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>1</span>
                      <span style={{ fontSize: '1.1rem', color: '#fff' }}>举起双手，系统将锁定您的<span style={{ color: 'var(--primary-cyan)' }}>食指</span>位置。</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ background: 'var(--primary-cyan)', color: '#000', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>2</span>
                      <span style={{ fontSize: '1.1rem', color: '#fff' }}>快速挥动食指<span style={{ color: 'var(--primary-cyan)' }}>切开</span>掉落的学科物件。</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ background: 'var(--primary-cyan)', color: '#000', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>3</span>
                      <span style={{ fontSize: '1.1rem', color: '#fff' }}>优先切中<span style={{ color: 'var(--like-color)' }}>绿色喜爱学科</span>，避开<span style={{ color: 'var(--hate-color)' }}>红色厌恶学科</span>！</span>
                    </div>
                  </div>
                  <button className="cyber-btn" onClick={() => setShowTutorial(false)}>
                    收到，关闭提示
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
