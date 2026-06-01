import React, { useEffect, useState } from 'react';
import { CameraBackground } from './CameraBackground';
import { HandCanvas } from './HandCanvas';
import { GameCanvas } from './GameCanvas';
import { DifficultyConfig, HitRecord } from '../types/game';

interface StartCalibrationProps {
  onBack: () => void;
  onAccept: () => void;
  camera: any;
  tracking: any;
}

// 固定的简单测试难度配置
const CALIBRATION_DIFFICULTY: DifficultyConfig = {
  level: 0,
  spawnInterval: 600, // 生成较慢，便于测试
  baseFallSpeed: 100, // 下落较慢
  maxItems: 5         // 同屏少量
};

export const StartCalibration: React.FC<StartCalibrationProps> = ({
  onBack,
  onAccept,
  camera,
  tracking,
}) => {
  const {
    videoRef,
    stream,
    cameraStatus,
    errorMessage: camError,
    startCamera,
  } = camera;
  const {
    handResultRef,
    trackingStatus,
    errorMessage: trackingError,
  } = tracking;

  const [leftHitCount, setLeftHitCount] = useState(0);
  const [rightHitCount, setRightHitCount] = useState(0);
  const [calibrationSuccess, setCalibrationSuccess] = useState(false);

  const hasCameraError = cameraStatus === 'denied' || cameraStatus === 'error';
  const hasTrackingError = trackingStatus === 'error';
  const enableGesture = cameraStatus === 'ready';

  // 命中回调，记录左右手切中次数
  const handleHit = (record: HitRecord) => {
    if (record.handSide === 'Left') {
      setLeftHitCount(prev => prev + 1);
    } else if (record.handSide === 'Right') {
      setRightHitCount(prev => prev + 1);
    } else if (record.handSide === 'mouse') {
      // 如果使用鼠标测试，可以强制两边都算，或者分开算，这里为了测试流畅度，只要鼠标切中也算通过
      setLeftHitCount(prev => prev + 1);
      setRightHitCount(prev => prev + 1);
    }
  };

  // 提供给无摄像头玩家直接跳过的逻辑
  const forceMouseDebug = () => {
    setLeftHitCount(1);
    setRightHitCount(1);
    setCalibrationSuccess(true);
  };

  // 检查是否左右手都至少切中一次
  useEffect(() => {
    if (leftHitCount > 0 && rightHitCount > 0 && !calibrationSuccess) {
      setCalibrationSuccess(true);
    }
  }, [leftHitCount, rightHitCount, calibrationSuccess]);

  // 成功后延迟跳转
  useEffect(() => {
    let timer: number;
    if (calibrationSuccess) {
      // 只要 calibrationSuccess 变为 true，设定定时器在 3 秒后跳转
      timer = window.setTimeout(() => {
        onAccept();
      }, 3000); // 3秒后进入游戏
    }
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [calibrationSuccess, onAccept]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <CameraBackground videoRef={videoRef} stream={stream} />
      <HandCanvas handResultRef={handResultRef} />
      
      {/* 叠加测试用的游戏画布 */}
      {cameraStatus === 'ready' && !calibrationSuccess && (
        <GameCanvas 
          handResultRef={handResultRef}
          enableGesture={enableGesture}
          enableMouseDebug={true} // 允许鼠标备用
          difficultyConfig={CALIBRATION_DIFFICULTY}
          isPaused={false}
          onHit={handleHit}
          updateStats={() => {}}
          isGameOver={false}
          level={1}
        />
      )}

      {/* 在测试阶段（摄像头ready但还未成功）显示顶部操作提示 */}
      {cameraStatus === 'ready' && !calibrationSuccess && (
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 20, 30, 0.8)',
          border: '1px solid var(--primary-cyan)',
          padding: '1rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
          zIndex: 30,
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <h3 className="text-glow-cyan" style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>操作提示</h3>
          <p style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>
            请举起双手，用<span style={{ color: 'var(--primary-cyan)', fontWeight: 'bold' }}>食指指尖</span>划过屏幕上掉落的物件！
          </p>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>
            (左手和右手都需要至少切中一次以完成测试)
          </div>
        </div>
      )}

      {/* 在测试阶段（摄像头ready但还未成功）隐藏中心提示框，避免遮挡画布 */}
      {(!enableGesture || calibrationSuccess || hasCameraError || hasTrackingError) && (
        <div style={{ position: 'absolute', zIndex: 20, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
          <div className="glass-panel" style={{ width: '80%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'auto' }}>
            
            {calibrationSuccess ? (
              <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
                <h2 className="text-glow-like" style={{ fontSize: '4rem', margin: '0 0 1rem 0' }}>识别成功</h2>
                <p style={{ fontSize: '1.5rem', color: '#fff', opacity: 0.9 }}>
                  系统已锁定您的双手操作，即将进入战场...
                </p>
                <div style={{ marginTop: '2rem' }}>
                   <button 
                     className="cyber-btn" 
                     onClick={onAccept} 
                     style={{ 
                       borderColor: 'var(--primary-cyan)', 
                       color: 'var(--primary-cyan)', 
                       background: 'rgba(0, 255, 255, 0.1)',
                       textShadow: 'none',
                       boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)'
                     }}
                   >
                     如果未自动跳转，请点击这里
                   </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-glow-cyan" style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>手势实战校准</h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
                  请挥动您的<span style={{ color: 'var(--primary-cyan)', fontWeight: 'bold' }}>左右手食指</span>，分别切中至少一个掉落物。
                </p>

                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', width: '100%', justifyContent: 'center' }}>
                  <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary-cyan)' }}>系统状态</h4>
                    <div style={{ marginBottom: '0.5rem' }}>
                      摄像头：
                      {cameraStatus === 'ready' ? <span style={{ color: 'var(--like-color)' }}>正常</span> :
                        hasCameraError ? <span style={{ color: 'var(--hate-color)' }}>异常</span> :
                          <span style={{ color: '#FFB86C' }}>请求中...</span>}
                    </div>
                    <div>
                      识别引擎：
                      {trackingStatus === 'ready' ? <span style={{ color: 'var(--like-color)' }}>在线</span> :
                        hasTrackingError ? <span style={{ color: 'var(--hate-color)' }}>异常</span> :
                          <span style={{ color: '#FFB86C' }}>加载中...</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{
                      width: '140px',
                      border: `1px solid ${leftHitCount > 0 ? 'var(--like-color)' : 'var(--hate-color)'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: leftHitCount > 0 ? 'rgba(0,255,153,0.1)' : 'rgba(255,51,102,0.1)',
                      borderRadius: '8px',
                      padding: '1rem',
                    }}>
                      <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✋</span>
                      <span style={{ color: leftHitCount > 0 ? 'var(--like-color)' : 'var(--hate-color)' }}>
                        左手测试：{leftHitCount > 0 ? '通过' : '待切中'}
                      </span>
                    </div>

                    <div style={{
                      width: '140px',
                      border: `1px solid ${rightHitCount > 0 ? 'var(--like-color)' : 'var(--hate-color)'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: rightHitCount > 0 ? 'rgba(0,255,153,0.1)' : 'rgba(255,51,102,0.1)',
                      borderRadius: '8px',
                      padding: '1rem',
                    }}>
                      <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem', transform: 'scaleX(-1)' }}>✋</span>
                      <span style={{ color: rightHitCount > 0 ? 'var(--like-color)' : 'var(--hate-color)' }}>
                        右手测试：{rightHitCount > 0 ? '通过' : '待切中'}
                      </span>
                    </div>
                  </div>
                </div>

                {hasCameraError && (
                  <div style={{ color: 'var(--hate-color)', marginBottom: '1rem', background: 'rgba(255,0,0,0.1)', padding: '1rem', borderRadius: '4px' }}>
                    <strong>错误：</strong> {camError || '无法访问摄像头。请检查浏览器权限，或确保使用了 HTTPS / localhost。'}
                    <br />您可以直接进入鼠标调试模式体验游戏。
                  </div>
                )}

                {hasTrackingError && (
                  <div style={{ color: 'var(--hate-color)', marginBottom: '1rem', background: 'rgba(255,0,0,0.1)', padding: '1rem', borderRadius: '4px' }}>
                    <strong>错误：</strong> {trackingError || '手势模型加载中或加载失败，网络可能存在波动。'}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="cyber-btn" onClick={onBack} style={{ borderColor: '#666', color: '#ccc' }}>
                    取消
                  </button>
                  {hasCameraError && (
                    <button className="cyber-btn" onClick={startCamera}>
                      重试摄像头
                    </button>
                  )}
                  {(!enableGesture || hasCameraError || hasTrackingError) && (
                    <button 
                      className="cyber-btn" 
                      onClick={forceMouseDebug}
                      style={{ background: 'transparent', borderStyle: 'dashed', color: 'var(--primary-cyan)' }}
                    >
                      进入鼠标调试模式
                    </button>
                  )}
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
