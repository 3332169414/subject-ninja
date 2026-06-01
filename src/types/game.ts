export type SubjectId =
  | "chinese"
  | "math"
  | "english"
  | "physics"
  | "chemistry"
  | "biology"
  | "politics"
  | "history"
  | "geography"
  | "computer"
  | "painting"
  | "music";

export type GameStatus =
  | "idle"
  | "calibrating"
  | "levelIntro"
  | "playing"
  | "paused"
  | "gameOver";

export interface SubjectObject {
  id: string;
  name: string;
  emoji: string;
  image: string;
}

export interface SubjectItem {
  id: SubjectId;
  name: string;
  objects: SubjectObject[];
  color: string;
}

export interface FallingItem {
  id: string;
  itemType?: 'subject' | 'flame' | 'bomb';
  subjectId: SubjectId | string;
  subjectName: string;
  objectId: string;
  objectName: string;
  emoji: string;
  image: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  rotationSpeed: number;
  selected: boolean;
}

export interface GesturePointer {
  id: string;
  handSide: 'Left' | 'Right';
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  isActive: boolean;
  lastUpdateTime: number;
}

export interface TrailPoint {
  x: number;
  y: number;
}

export interface DifficultyConfig {
  level: number;
  spawnInterval: number;
  baseFallSpeed: number;
  maxItems: number;
}

export type HitType = 'normal' | 'liked' | 'hated' | 'danger';

export interface HitRecord {
  id: string;
  itemType?: 'subject' | 'flame' | 'bomb';
  subjectId: SubjectId | string;
  subjectName: string;
  objectName: string;
  scoreDelta: number;
  hitType: HitType;
  createdAt: number;
  x: number;
  y: number;
  handSide?: 'Left' | 'Right' | 'mouse';
}

export interface GameRuntimeStats {
  hits: number;
  misses: number;
  currentSpeed: number;
  gameTimeMs: number;
}

export interface GameState {
  status: GameStatus;
  score: number;
  level: number;
  hateCount: number;
  likedSubjects: SubjectId[];
  hatedSubjects: SubjectId[];
  lastHatedSubject: SubjectId | null;
}

export type HandSide = 'Left' | 'Right';

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface TrackedHand {
  side: HandSide;
  landmarks: Point3D[];
  indexTip: Point3D;
  thumbTip: Point3D;
  confidence: number;
}

export type CameraStatus = 'idle' | 'requesting' | 'ready' | 'denied' | 'error';
export type HandTrackingStatus = 'idle' | 'loading' | 'ready' | 'error';