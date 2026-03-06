import React from 'react';
import { Layer } from '../../types/image-editor';
import { Sliders } from 'lucide-react';

interface AdjustmentsPanelProps {
  layer: Layer | undefined;
  onAdjustmentChange: (adjustment: Record<string, number>) => void;
}

export function AdjustmentsPanel({ layer, onAdjustmentChange }: AdjustmentsPanelProps) {
  const adjustments = [
    { id: 'brightness', label: 'Brightness', min: -100, max: 100, step: 1 },
    { id: 'contrast', label: 'Contrast', min: -100, max: 100, step: 1 },
    { id: 'saturation', label: 'Saturation', min: -100, max: 100, step: 1 },
    { id: 'exposure', label: 'Exposure', min: -100, max: 100, step: 1 },
    { id: 'highlights', label: 'Highlights', min: -100, max: 100, step: 1 },
    { id: 'shadows', label: 'Shadows', min: -100, max: 100, step: 1 }
  ];

  if (!layer) return null;

  return (
    <div className="border-t border-[#333] p-2">
      <div className="flex items-center mb-2">
        <Sliders size={14} className="mr-2 text-gray-400" />
        <h3 className="text-sm font-medium text-gray-300">Adjustments</h3>
      </div>
      <div className="space-y-3">
        {adjustments.map(({ id, label, min, max, step }) => (
          <div key={id} className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{label}</span>
              <span>{layer.adjustments?.[id] ?? 0}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={layer.adjustments?.[id] ?? 0}
              onChange={(e) => onAdjustmentChange({ [id]: Number(e.target.value) })}
              className="w-full h-1 bg-[#454545] rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}