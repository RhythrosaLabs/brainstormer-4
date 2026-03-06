import React, { useRef, useEffect } from 'react';
import { Clip } from '../../types/video-editor';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface TimelineProps {
  clips: Clip[];
  selectedClip: string | null;
  playheadPosition: number;
  zoom: number;
  onClipSelect: (clipId: string) => void;
  onClipMove: (clipId: string, newStart: number) => void;
  onPlayheadChange: (position: number) => void;
}

export function Timeline({
  clips,
  selectedClip,
  playheadPosition,
  zoom,
  onClipSelect,
  onClipMove,
  onPlayheadChange
}: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef(0);

  const pixelsPerSecond = 100 * zoom;
  const totalDuration = Math.max(
    ...clips.map(clip => clip.startTime + clip.duration),
    30
  );

  const handleMouseDown = (e: React.MouseEvent, clipId: string) => {
    if (timelineRef.current) {
      isDragging.current = true;
      const clip = clips.find(c => c.id === clipId);
      if (clip) {
        const rect = timelineRef.current.getBoundingClientRect();
        dragOffset.current = e.clientX - (clip.startTime * pixelsPerSecond);
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current && timelineRef.current && selectedClip) {
        const rect = timelineRef.current.getBoundingClientRect();
        const newStart = Math.max(0, (e.clientX - rect.left - dragOffset.current) / pixelsPerSecond);
        onClipMove(selectedClip, newStart);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [selectedClip, pixelsPerSecond, onClipMove]);

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      {/* Timeline Ruler */}
      <div className="h-8 border-b border-[#333] relative bg-[#242424]">
        <div className="absolute inset-0" style={{ width: totalDuration * pixelsPerSecond }}>
          {Array.from({ length: Math.ceil(totalDuration) }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 border-l border-[#333] flex items-center"
              style={{ left: i * pixelsPerSecond }}
            >
              <span className="text-xs text-gray-400 ml-1">{i}s</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tracks Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Video Track */}
        <div className="h-32 border-b border-[#333] bg-[#242424] relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-[#1a1a1a] border-r border-[#333] flex items-center justify-center">
            <span className="text-sm text-gray-400">Video 1</span>
          </div>
          <div className="absolute left-32 right-0 h-full overflow-x-auto">
            <div className="relative h-full" style={{ width: totalDuration * pixelsPerSecond }}>
              {clips.map(clip => (
                <div
                  key={clip.id}
                  className={`absolute top-2 bottom-2 rounded cursor-pointer ${
                    selectedClip === clip.id
                      ? 'ring-2 ring-[#45caff]'
                      : 'hover:ring-2 hover:ring-[#45caff]/50'
                  }`}
                  style={{
                    left: clip.startTime * pixelsPerSecond,
                    width: clip.duration * pixelsPerSecond,
                    backgroundColor: clip.color || '#4a5568'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClipSelect(clip.id);
                  }}
                  onMouseDown={(e) => handleMouseDown(e, clip.id)}
                >
                  <div className="p-2 text-xs truncate">{clip.name}</div>
                  {clip.url && (
                    <video
                      src={clip.url}
                      className="absolute inset-0 w-full h-full object-cover opacity-50"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audio Track */}
        <div className="h-32 border-b border-[#333] bg-[#242424] relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-[#1a1a1a] border-r border-[#333] flex items-center justify-center">
            <span className="text-sm text-gray-400">Audio 1</span>
          </div>
          <div className="absolute left-32 right-0 h-full">
            <div className="relative h-full" style={{ width: totalDuration * pixelsPerSecond }}>
              {/* Audio waveform visualization would go here */}
            </div>
          </div>
        </div>
      </div>

      {/* Playhead */}
      <div
        className="absolute top-0 bottom-0 w-px bg-[#45caff] z-10 pointer-events-none"
        style={{ left: playheadPosition * pixelsPerSecond + 128 }}
      >
        <div className="w-4 h-4 -ml-2 -mt-2 bg-[#45caff] rounded-full" />
      </div>
    </div>
  );
}