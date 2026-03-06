import React from 'react';
import { MediaType } from '@/types';

interface MediaRendererProps {
  type: MediaType;
  url: string;
  metadata?: Record<string, unknown>;
}

export function MediaRenderer({ type, url, metadata }: MediaRendererProps) {
  switch (type) {
    case 'image':
      return (
        <div className="relative">
          <img
            src={url}
            alt="Generated content"
            className="max-w-full rounded-lg"
            loading="lazy"
          />
          {metadata?.dimensions && (
            <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
              {metadata.dimensions as string}
            </div>
          )}
        </div>
      );

    case 'video':
      return (
        <video
          src={url}
          controls
          className="max-w-full rounded-lg"
          loop
          playsInline
        />
      );

    case 'audio':
      return (
        <audio
          src={url}
          controls
          className="w-full"
        />
      );

    case '3d':
      return (
        <model-viewer
          src={url}
          alt="3D model"
          auto-rotate
          camera-controls
          style={{ width: '100%', height: '400px' }}
          className="bg-[#242424] rounded-lg"
        />
      );

    case 'code':
      return (
        <pre className="bg-[#1a1a1a] p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">{url}</code>
        </pre>
      );

    default:
      return (
        <div className="text-sm text-gray-400">
          Unsupported media type: {type}
        </div>
      );
  }
}