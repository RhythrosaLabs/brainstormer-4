import React, { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { Timeline } from './Timeline';
import { PreviewWindow } from './PreviewWindow';
import { MediaBrowser } from './MediaBrowser';
import { InspectorPanel } from './InspectorPanel';
import { ToolBar } from './ToolBar';
import { Clip } from '../../types/video-editor';
import { generateVideo } from '../services/stability';
import { Wand2, Settings, AlertCircle } from 'lucide-react';

export function VideoEditor() {
  // ... existing state ...

  return (
    <div className="flex-1 flex flex-col bg-[#1a1a1a] text-gray-200">
      {/* AI Generation Bar */}
      {/* ... existing AI generation bar ... */}

      <ResizablePanelGroup direction="horizontal">
        {/* Media Browser */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <MediaBrowser onAddClip={(clip) => setClips([...clips, clip])} />
        </ResizablePanel>

        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            {/* Preview Window */}
            <ResizablePanel defaultSize={60} minSize={30}>
              <PreviewWindow
                selectedClip={clips.find(clip => clip.id === selectedClip)}
                playheadPosition={playheadPosition}
                isPlaying={isPlaying}
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Timeline */}
            <ResizablePanel defaultSize={40}>
              <Timeline
                clips={clips}
                selectedClip={selectedClip}
                playheadPosition={playheadPosition}
                zoom={zoom}
                onClipSelect={setSelectedClip}
                onClipMove={(clipId, newStart) => {
                  setClips(clips.map(clip =>
                    clip.id === clipId
                      ? { ...clip, startTime: newStart }
                      : clip
                  ));
                }}
                onPlayheadChange={setPlayheadPosition}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Inspector Panel */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <InspectorPanel
            clip={clips.find(clip => clip.id === selectedClip)}
            onClipUpdate={(updatedClip) => {
              setClips(clips.map(clip =>
                clip.id === updatedClip.id ? updatedClip : clip
              ));
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}