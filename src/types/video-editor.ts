export interface Clip {
  id: string;
  name: string;
  url: string;
  duration: number;
  startTime: number;
  color?: string;
  opacity?: number;
  scale?: number;
  rotation?: number;
  effects?: Effect[];
}

export interface Effect {
  id: string;
  type: 'color' | 'blur' | 'sharpen' | 'noise' | 'fade';
  intensity: number;
  startTime: number;
  duration: number;
}