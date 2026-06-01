import { useCallback, useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { HandTrackingStatus, TrackedHand } from '../types/game';

const WASM_ASSET_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const MODEL_ASSET_PATH =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task';

export const useHandTracking = () => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [trackingStatus, setTrackingStatus] = useState<HandTrackingStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [leftHand, setLeftHand] = useState<TrackedHand | null>(null);
  const [rightHand, setRightHand] = useState<TrackedHand | null>(null);

  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const handResultRef = useRef<HandLandmarkerResult | null>(null);
  const requestRef = useRef<number>();
  const lastVideoTimeRef = useRef<number>(-1);
  const lastUpdateTimeRef = useRef<number>(0);
  const isTrackingRef = useRef<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    const initMediaPipe = async () => {
      try {
        setTrackingStatus('loading');
        setErrorMessage('');

        const vision = await FilesetResolver.forVisionTasks(WASM_ASSET_PATH);
        let landmarker: HandLandmarker;

        try {
          landmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: MODEL_ASSET_PATH,
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numHands: 2,
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
        } catch (gpuError) {
          console.warn('GPU hand tracking failed, falling back to CPU:', gpuError);
          landmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: MODEL_ASSET_PATH,
              delegate: 'CPU',
            },
            runningMode: 'VIDEO',
            numHands: 2,
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
        }

        if (isCancelled) {
          landmarker.close();
          return;
        }

        landmarkerRef.current = landmarker;
        setIsReady(true);
        setTrackingStatus('ready');
      } catch (err: unknown) {
        console.error('Failed to initialize MediaPipe:', err);
        setTrackingStatus('error');
        setErrorMessage(`模型加载失败: ${err instanceof Error ? err.message : '未知错误'}`);
      }
    };

    void initMediaPipe();

    return () => {
      isCancelled = true;
      isTrackingRef.current = false;

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }

      if (landmarkerRef.current) {
        landmarkerRef.current.close();
        landmarkerRef.current = null;
      }
    };
  }, []);

  const detectHands = useCallback((videoElement: HTMLVideoElement) => {
    if (!isTrackingRef.current) return;

    if (!landmarkerRef.current || videoElement.readyState < 2) { // HAVE_CURRENT_DATA = 2
      requestRef.current = requestAnimationFrame(() => detectHands(videoElement));
      return;
    }

    const startTimeMs = performance.now();

    if (lastVideoTimeRef.current !== videoElement.currentTime) {
      lastVideoTimeRef.current = videoElement.currentTime;

      try {
        const results = landmarkerRef.current.detectForVideo(videoElement, startTimeMs);
        handResultRef.current = results;

        if (startTimeMs - lastUpdateTimeRef.current > 150) { // 节流至150ms以减小React重渲染压力
          lastUpdateTimeRef.current = startTimeMs;

          let newLeftHand: TrackedHand | null = null;
          let newRightHand: TrackedHand | null = null;

          results.landmarks.forEach((landmarks, index) => {
            const handedness = results.handedness?.[index]?.[0] ?? results.handednesses?.[index]?.[0];
            
            // 优先使用 handedness 判断左右手
            // @ts-ignore
            let side = (results.handednesses[index][0].category || results.handednesses[index][0].displayName) as 'Left' | 'Right';
            
            // 取消这里的反转，直接使用原始识别结果
            side = side === 'Left' ? 'Left' : 'Right';

            if (!side) return;

            const handData: TrackedHand = {
              side,
              landmarks,
              indexTip: landmarks[8],
              thumbTip: landmarks[4],
              confidence: handedness?.score ?? 0,
            };

            if (side === 'Left') {
              if (!newLeftHand || handData.confidence > newLeftHand.confidence) {
                newLeftHand = handData;
              }
            } else if (!newRightHand || handData.confidence > newRightHand.confidence) {
              newRightHand = handData;
            }
          });

          setLeftHand(newLeftHand);
          setRightHand(newRightHand);
        }
      } catch (err) {
        console.error('Detection error:', err);
      }
    }

    requestRef.current = requestAnimationFrame(() => detectHands(videoElement));
  }, []);

  const startTracking = useCallback(
    (videoElement: HTMLVideoElement) => {
      if (!isReady) return;

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }

      isTrackingRef.current = true;
      lastVideoTimeRef.current = -1;
      detectHands(videoElement);
    },
    [detectHands, isReady],
  );

  const stopTracking = useCallback(() => {
    isTrackingRef.current = false;

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }

    handResultRef.current = null;
    setLeftHand(null);
    setRightHand(null);
  }, []);

  return {
    handResultRef,
    leftHand,
    rightHand,
    isReady,
    trackingStatus,
    errorMessage,
    startTracking,
    stopTracking,
  };
};
