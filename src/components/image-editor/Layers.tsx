import React from 'react';
import { Eye, EyeOff, Lock, Unlock, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { Layer } from '../../types/image-editor';

interface LayersProps {
  layers: Layer[];
  selectedLayer: string | null;
  onLayerSelect: (id: string) => void;
  onAddLayer: () => void;
  onDeleteLayer: (id: string) => void;
  onLayerUpdate: (layer: Layer) => void;
}

export function Layers({ 
  layers, 
  selectedLayer, 
  onLayerSelect, 
  onAddLayer, 
  onDeleteLayer,
  onLayerUpdate 
}: LayersProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b border-[#333] flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">Layers</h3>
        <div className="flex gap-1">
          <button
            onClick={onAddLayer}
            className="p-1 hover:bg-[#353535] rounded"
            title="Add Layer"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {[...layers].reverse().map((layer) => (
          <div
            key={layer.id}
            onClick={() => onLayerSelect(layer.id)}
            className={`group flex items-center p-2 cursor-pointer ${
              selectedLayer === layer.id ? 'bg-[#454545]' : 'hover:bg-[#353535]'
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLayerUpdate({ ...layer, visible: !layer.visible });
              }}
              className="p-1 hover:bg-[#555] rounded"
              title={layer.visible ? 'Hide Layer' : 'Show Layer'}
            >
              {layer.visible ? (
                <Eye size={14} className="text-gray-300" />
              ) : (
                <EyeOff size={14} className="text-gray-500" />
              )}
            </button>

            <div className="flex-1 mx-2 flex items-center">
              <ImageIcon size={14} className="mr-2 text-gray-400" />
              <input
                type="text"
                value={layer.name}
                onChange={(e) => onLayerUpdate({ ...layer, name: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-[#45caff] rounded px-1 w-full"
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onLayerUpdate({ ...layer, locked: !layer.locked });
              }}
              className="p-1 hover:bg-[#555] rounded opacity-0 group-hover:opacity-100"
              title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
            >
              {layer.locked ? (
                <Lock size={14} className="text-gray-300" />
              ) : (
                <Unlock size={14} className="text-gray-500" />
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteLayer(layer.id);
              }}
              className="p-1 hover:bg-[#555] rounded opacity-0 group-hover:opacity-100"
              title="Delete Layer"
              disabled={layer.locked}
            >
              <Trash2 size={14} className="text-gray-300" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}