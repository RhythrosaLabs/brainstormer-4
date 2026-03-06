import React, { useState } from 'react';
import { ImageModel, generateImage } from '../services/ai';
import { useToast } from '../hooks/useToast';
import { Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageGeneratorProps {
  onImageGenerated?: (imageUrl: string, imageData: Blob) => void;
}

export function ImageGenerator({ onImageGenerated }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<ImageModel>('dalle-3');
  const [isGenerating, setIsGenerating] = useState(false);
  const { showToast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast('Please enter a prompt', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateImage({
        model,
        prompt: prompt.trim()
      });
      
      onImageGenerated?.(result.url, result.data);
      showToast('Image generated successfully!', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate image';
      showToast(message, 'error');
      console.error('Image generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-4">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value as ImageModel)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          disabled={isGenerating}
        >
          <option value="dalle-3">DALL·E 3</option>
          <option value="stable-ultra">Stable Image Ultra</option>
          <option value="stable-diffusion-3">Stable Diffusion 3</option>
          <option value="flux-1.1">Flux 1.1</option>
        </select>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your image prompt..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          disabled={isGenerating}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-white transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ImageIcon className="h-5 w-5" />
          )}
          Generate
        </button>
      </div>
    </div>
  );
}