import { useCallback, useEffect, useRef, useState } from 'react';
import { CameraStatus } from '../types/game';

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const statusRef = useRef<CameraStatus>('idle');
  const requestIdRef = useRef<number>(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const updateStatus = useCallback((status: CameraStatus) => {
    statusRef.current = status;
    setCameraStatus(status);
  }, []);

  const attachStreamToVideo = useCallback((mediaStream = streamRef.current) => {
    const video = videoRef.current;
    if (!video || !mediaStream) return;

    if (video.srcObject !== mediaStream) {
      video.srcObject = mediaStream;
    }

    void video.play().catch((err) => {
      console.warn('Video autoplay was interrupted:', err);
    });
  }, []);

  const startCamera = useCallback(async () => {
    if (statusRef.current === 'requesting') return streamRef.current;
    if (statusRef.current === 'ready' && streamRef.current) {
      attachStreamToVideo();
      return streamRef.current;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      updateStatus('error');
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const isSecure = window.location.protocol === 'https:';
      if (!isLocal && !isSecure) {
        setErrorMessage('摄像头功能需要 HTTPS 环境，请使用正式部署链接或 localhost 运行');
      } else {
        setErrorMessage('当前浏览器不支持摄像头访问，请使用最新版 Chrome 或 Edge');
      }
      return null;
    }

    updateStatus('requesting');
    setErrorMessage('');
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    try {
      let mediaStream: MediaStream;

      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: false,
        });
      } catch (err) {
        if (!(err instanceof DOMException) || err.name !== 'OverconstrainedError') {
          throw err;
        }

        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      if (requestId !== requestIdRef.current) {
        mediaStream.getTracks().forEach((track) => track.stop());
        return null;
      }

      streamRef.current = mediaStream;
      setStream(mediaStream);
      updateStatus('ready');
      attachStreamToVideo(mediaStream);

      return mediaStream;
    } catch (err: unknown) {
      if (requestId !== requestIdRef.current) return null;

      console.error('Failed to access camera:', err);

      const domError = err instanceof DOMException ? err : null;
      const errorName = domError?.name;
      const errorText = err instanceof Error ? err.message : '未知错误';

      if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
        updateStatus('denied');
        setErrorMessage('摄像头权限被拒绝，请在浏览器地址栏或系统隐私设置中允许摄像头访问');
      } else if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
        updateStatus('error');
        setErrorMessage('未检测到可用摄像头，请确认摄像头已连接且没有被其他软件占用');
      } else if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
        updateStatus('error');
        setErrorMessage('摄像头暂时无法读取，请关闭正在使用摄像头的其他程序后重试');
      } else {
        updateStatus('error');
        setErrorMessage(`摄像头访问失败: ${errorText}`);
      }

      return null;
    }
  }, [attachStreamToVideo, updateStatus]);

  const stopCamera = useCallback(() => {
    requestIdRef.current += 1;
    const activeStream = streamRef.current;

    if (activeStream) {
      activeStream.getTracks().forEach((track) => track.stop());
    }

    streamRef.current = null;
    setStream(null);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    updateStatus('idle');
  }, [updateStatus]);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      const activeStream = streamRef.current;
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      streamRef.current = null;
    };
  }, []);

  return {
    videoRef,
    stream,
    cameraStatus,
    errorMessage,
    startCamera,
    stopCamera,
  };
};
