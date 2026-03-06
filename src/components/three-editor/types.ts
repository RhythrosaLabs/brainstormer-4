export interface Object3D {
  id: string;
  type: "box" | "sphere" | "cylinder" | "custom";
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  material: {
    color: string;
    metalness: number;
    roughness: number;
  };
  visible: boolean;
}

export interface Scene3D {
  id: string;
  name: string;
  objects: Object3D[];
  lastModified: Date;
}

export type TransformMode = "translate" | "rotate" | "scale";
export type ViewMode = "solid" | "wireframe" | "rendered";