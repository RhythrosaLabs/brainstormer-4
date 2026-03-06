export type Tool = 
  | 'move' 
  | 'marquee' 
  | 'lasso' 
  | 'magic-wand'
  | 'crop'
  | 'eyedropper'
  | 'brush'
  | 'eraser'
  | 'text'
  | 'shape'
  | 'stamp'
  | 'hand'
  | 'zoom';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: string;
  locked: boolean;
  type: 'image' | 'text' | 'shape' | 'adjustment';
  imageData?: HTMLImageElement;
  isBackground?: boolean;
  adjustments?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    exposure?: number;
    highlights?: number;
    shadows?: number;
  };
}