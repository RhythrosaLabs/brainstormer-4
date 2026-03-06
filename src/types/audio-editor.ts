export interface Track {
  id: string;
  name: string;
  type: 'audio' | 'midi' | 'instrument';
  volume: number;
  pan: number;
  muted: boolean;
  soloed: boolean;
  armed: boolean;
  clips: AudioClip[];
  effects: Effect[];
  color: string;
}

export interface AudioClip {
  id: string;
  name: string;
  startTime: number;
  duration: number;
  url?: string;
  notes?: Note[];
}

export interface Note {
  pitch: number;
  velocity: number;
  startTime: number;
  duration: number;
}

export interface Effect {
  id: string;
  type: string;
  name: string;
  enabled: boolean;
  parameters: Record<string, number>;
}