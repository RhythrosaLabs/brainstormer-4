import React from 'react';
import { Layer } from '../../types/image-editor';
import { Settings } from 'lucide-react';

interface PropertiesPanelProps {
  layer: Layer | undefined;
  onUpdate: (updates: Partial<Layer>) => void;
}

export function PropertiesPanel({ layer, onUpdate }: PropertiesPanelProps) {
  if (!layer) return null;

  const blendModes = [
    'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
    'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference',
    'exclusion', 'hue', 'saturation', 'color', 'luminosity'
  ];

  return (
    <div className="border-t border-[#333] p-2">
      <div className="flex items-center mb-2">
        <Settings size={14} className="mr-2 text-gray-400" />
        <h3 className="text-sm font-medium text-gray-300">Properties</h3>
      </div>
      
      <div className="space-y-3">
        {/* Opacity Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Opacity</span>
            <span>{layer.opacity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={layer.opacity}
            onChange={(e) => onUpdate({ opacity: Number(e.target.value) })}
            className="w-full h-1 bg-[#454545] rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Blend Mode Selector */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Blend Mode</label>
          <select
            value={layer.blendMode}
            onChange={(e) => onUpdate({ blendMode: e.target.value })}
            className="w-full bg-[#454545] text-gray-300 text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
          >
            {blendModes.map(mode => (
              <option key={mode} value={mode}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}