import React from 'react';
import { Object3D } from './types';

interface PropertiesPanelProps {
  object: Object3D | undefined;
  onUpdate: (updates: Partial<Object3D>) => void;
}

export function PropertiesPanel({ object, onUpdate }: PropertiesPanelProps) {
  if (!object) {
    return (
      <div className="p-4 text-gray-400 text-center">
        No object selected
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium mb-4">Properties</h3>
      
      <div className="space-y-4">
        {/* Transform */}
        <div>
          <h4 className="text-xs text-gray-400 mb-2">Transform</h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-400">Position</label>
              <div className="grid grid-cols-3 gap-2">
                {["x", "y", "z"].map((axis, i) => (
                  <input
                    key={axis}
                    type="number"
                    value={object.position[i]}
                    onChange={(e) => {
                      const newPosition = [...object.position];
                      newPosition[i] = parseFloat(e.target.value);
                      onUpdate({ position: newPosition as [number, number, number] });
                    }}
                    className="bg-[#333] text-sm rounded px-2 py-1"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400">Rotation</label>
              <div className="grid grid-cols-3 gap-2">
                {["x", "y", "z"].map((axis, i) => (
                  <input
                    key={axis}
                    type="number"
                    value={object.rotation[i]}
                    onChange={(e) => {
                      const newRotation = [...object.rotation];
                      newRotation[i] = parseFloat(e.target.value);
                      onUpdate({ rotation: newRotation as [number, number, number] });
                    }}
                    className="bg-[#333] text-sm rounded px-2 py-1"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400">Scale</label>
              <div className="grid grid-cols-3 gap-2">
                {["x", "y", "z"].map((axis, i) => (
                  <input
                    key={axis}
                    type="number"
                    value={object.scale[i]}
                    onChange={(e) => {
                      const newScale = [...object.scale];
                      newScale[i] = parseFloat(e.target.value);
                      onUpdate({ scale: newScale as [number, number, number] });
                    }}
                    className="bg-[#333] text-sm rounded px-2 py-1"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Material */}
        <div>
          <h4 className="text-xs text-gray-400 mb-2">Material</h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-400">Color</label>
              <input
                type="color"
                value={object.material.color}
                onChange={(e) => {
                  onUpdate({
                    material: { ...object.material, color: e.target.value }
                  });
                }}
                className="block w-full h-8 bg-[#333] rounded"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">Metalness</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={object.material.metalness}
                onChange={(e) => {
                  onUpdate({
                    material: { ...object.material, metalness: parseFloat(e.target.value) }
                  });
                }}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">Roughness</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={object.material.roughness}
                onChange={(e) => {
                  onUpdate({
                    material: { ...object.material, roughness: parseFloat(e.target.value) }
                  });
                }}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Visibility */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={object.visible}
              onChange={(e) => {
                onUpdate({ visible: e.target.checked });
              }}
              className="rounded border-gray-400"
            />
            <span className="text-sm">Visible</span>
          </label>
        </div>
      </div>
    </div>
  );
}