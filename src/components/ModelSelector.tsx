import React from 'react';
import { Cpu } from 'lucide-react';
import { AI_MODELS } from '../services/ai';

interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (model: string) => void;
}

export function ModelSelector({ selectedModel, onModelSelect }: ModelSelectorProps) {
  // Get the current model type based on the selected model
  const getCurrentModelType = () => {
    for (const [type, models] of Object.entries(AI_MODELS)) {
      if (models.some(m => m.id === selectedModel)) {
        return type;
      }
    }
    return 'text';
  };

  const currentType = getCurrentModelType();
  const currentModels = AI_MODELS[currentType as keyof typeof AI_MODELS] || [];

  return (
    <div className="flex items-center gap-2">
      <Cpu size={16} className="text-gray-400" />
      <select
        value={selectedModel}
        onChange={(e) => onModelSelect(e.target.value)}
        className="w-full bg-[#2a2a2a] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
      >
        {currentModels.map(model => (
          <option key={model.id} value={model.id}>
            {model.name} ({model.provider})
          </option>
        ))}
      </select>
    </div>
  );
}