import React from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls, TransformControls, Grid, PerspectiveCamera } from "@react-three/drei";
import { Object3D, TransformMode } from './types';

interface ViewportProps {
  objects: Object3D[];
  selectedObject: string | null;
  transformMode: TransformMode;
  showGrid: boolean;
  snapToGrid: boolean;
  onObjectSelect: (id: string) => void;
}

export function Viewport({
  objects,
  selectedObject,
  transformMode,
  showGrid,
  snapToGrid,
  onObjectSelect
}: ViewportProps) {
  const renderObject = (object: Object3D) => {
    const props = {
      position: object.position,
      rotation: object.rotation,
      scale: object.scale,
      visible: object.visible,
      onClick: () => onObjectSelect(object.id)
    };

    switch (object.type) {
      case "box":
        return (
          <mesh key={object.id} {...props}>
            <boxGeometry />
            <meshStandardMaterial
              color={object.material.color}
              metalness={object.material.metalness}
              roughness={object.material.roughness}
            />
          </mesh>
        );
      case "sphere":
        return (
          <mesh key={object.id} {...props}>
            <sphereGeometry />
            <meshStandardMaterial
              color={object.material.color}
              metalness={object.material.metalness}
              roughness={object.material.roughness}
            />
          </mesh>
        );
      case "cylinder":
        return (
          <mesh key={object.id} {...props}>
            <cylinderGeometry />
            <meshStandardMaterial
              color={object.material.color}
              metalness={object.material.metalness}
              roughness={object.material.roughness}
            />
          </mesh>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 relative">
      <Canvas>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} />
        <OrbitControls />
        {showGrid && <Grid infiniteGrid />}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {objects.map(obj => renderObject(obj))}
        
        {selectedObject && (
          <TransformControls
            mode={transformMode}
            size={1}
            showX
            showY
            showZ
            space="world"
            snap={snapToGrid}
            snapValue={1}
          />
        )}
      </Canvas>
    </div>
  );
}