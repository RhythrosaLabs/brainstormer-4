import React from 'react';
import { Eye, EyeOff, Plus, Box } from 'lucide-react';
import { Scene3D } from './types';

interface SceneHierarchyProps {
  scenes: Scene3D[];
  selectedScene: string | null;
  selectedObject: string | null;
  onSceneSelect: (id: string) => void;
  onObjectSelect: (id: string) => void;
  onNewScene: () => void;
}

export function SceneHierarchy({
  scenes,
  selectedScene,
  selectedObject,
  onSceneSelect,
  onObjectSelect,
  onNewScene
}: SceneHierarchyProps) {
  const activeScene = scenes.find(scene => scene.id === selectedScene);

  return (
    <div className="w-64 border-r border-[#333] bg-[#242424]">
      <div className="p-4 border-b border-[#333]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Scenes</h3>
          <button
            onClick={onNewScene}
            className="p-1.5 hover:bg-[#333] rounded"
            title="New Scene"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-2">
          {scenes.map(scene => (
            <button
              key={scene.id}
              onClick={() => onSceneSelect(scene.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded ${
                selectedScene === scene.id
                  ? "bg-[#333] text-white"
                  : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
              }`}
            >
              <Box size={16} />
              <span className="truncate">{scene.name}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedScene && (
        <div className="p-4">
          <h4 className="text-sm font-medium mb-2">Objects</h4>
          <div className="space-y-1">
            {activeScene?.objects.map(obj => (
              <button
                key={obj.id}
                onClick={() => onObjectSelect(obj.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded ${
                  selectedObject === obj.id
                    ? "bg-[#333] text-white"
                    : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
                }`}
              >
                {obj.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                <span className="truncate">{obj.type}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}