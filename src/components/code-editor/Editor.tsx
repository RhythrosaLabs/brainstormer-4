import React from 'react';
import { useCodeEditor } from '../../hooks/useCodeEditor';
import { FileList } from './FileList';
import { EditorToolbar } from './EditorToolbar';
import { CodeArea } from './CodeArea';
import { Terminal } from './Terminal';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";

export function Editor() {
  const {
    files,
    selectedFile,
    content,
    isProcessing,
    handleNewFile,
    handleFileSelect,
    handleContentChange,
    handleSave,
    handleDelete
  } = useCodeEditor();

  return (
    <div className="flex h-full bg-[#1a1a1a]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={15} minSize={10} maxSize={20}>
          <FileList
            files={files}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            onNewFile={handleNewFile}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={85}>
          <div className="flex flex-col h-full">
            <EditorToolbar
              selectedFile={selectedFile}
              onSave={handleSave}
              onDelete={handleDelete}
            />

            <div className="flex-1 relative">
              <CodeArea
                content={content}
                onChange={handleContentChange}
                language={files.find(f => f.id === selectedFile)?.language || 'javascript'}
              />
            </div>

            <Terminal />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}