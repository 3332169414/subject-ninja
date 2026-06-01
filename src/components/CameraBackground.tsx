import React, { RefObject, useEffect } from 'react';

interface CameraBackgroundProps {
  videoRef: RefObject<HTMLVideoElement>;
  stream?: MediaStream | null;
}

export const CameraBackground: React.FC<CameraBackgroundProps> = ({ videoRef, stream }) => {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }

    void video.play().catch((err) => {
      console.warn('Camera video play failed:', err);
    });

    return () => {
      if (video.srcObject === stream) {
        video.srcObject = null;
      }
    };
  }, [stream, videoRef]);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      overflow: 'hidden',
      backgroundColor: '#000'
    }}>
      {/* 摄像头视频层 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          // 水平镜像，符合自拍直觉
          transform: 'scaleX(-1)',
          // 降低亮度、提高对比度、稍微增加饱和度，营造赛博朋克氛围
          filter: 'brightness(0.45) contrast(1.25) saturate(1.1)'
        }}
      />
      
      {/* 暗色遮罩层，确保前景文字可见 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(0,20,40,0.5), rgba(0,0,0,0.7))',
        pointerEvents: 'none'
      }}></div>

      {/* 数据流动画层 */}
      <div className="data-stream-container">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="data-stream-line"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 2 + 2}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* 扫描线效果 (复用 globals.css 中的 scanlines) */}
      <div className="scanlines" style={{ opacity: 0.6 }}></div>
      
    </div>
  );
};
