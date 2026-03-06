import React, { useState, useRef, useCallback } from 'react';
import { 
  Code as CodeIcon, 
  Save, 
  RefreshCw, 
  Play,
  Trash2,
  Plus,
  Split,
  Terminal as TerminalIcon
} from 'lucide-react';
import { generateOpenAIText } from '../services/openai';
import { useToast } from '../hooks/useToast';
import { CodeEditorToolbar } from './code-editor/CodeEditorToolbar';
import { FileList } from './code-editor/FileList';
import { CodeArea } from './code-editor/CodeArea';
import { PreviewPanel } from './code-editor/PreviewPanel';
import { Terminal } from './code-editor/Terminal';
import { AiAssistant } from './code-editor/AiAssistant';

interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: string;
  lastModified: Date;
  path: string;
}

export function CodeEditor() {
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleNewFile = useCallback(() => {
    const newFile: CodeFile = {
      id: `file-${Date.now()}`,
      name: 'Untitled.js',
      content: '',
      language: 'javascript',
      lastModified: new Date(),
      path: '/Untitled.js'
    };
    setFiles(prev => [...prev, newFile]);
    setSelectedFile(newFile.id);
    setContent('');
  }, []);

  const handleSave = useCallback(() => {
    if (selectedFile) {
      setFiles(files.map(file =>
        file.id === selectedFile
          ? { ...file, content, lastModified: new Date() }
          : file
      ));
      showToast('File saved successfully!', 'success');
    }
  }, [selectedFile, content, files, showToast]);

  const handleDelete = useCallback(() => {
    if (selectedFile) {
      setFiles(files.filter(file => file.id !== selectedFile));
      setSelectedFile(null);
      setContent('');
      showToast('File deleted successfully!', 'success');
    }
  }, [selectedFile, files, showToast]);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const handleFileSelect = useCallback((fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      setSelectedFile(fileId);
      setContent(file.content);
    }
  }, [files]);

  const handleRun = useCallback(() => {
    if (!selectedFile) return;
    
    const file = files.find(f => f.id === selectedFile);
    if (!file) return;

    try {
      if (file.language === 'javascript' || file.language === 'typescript') {
        // Execute JS/TS code
        const result = new Function(content)();
        console.log('Execution result:', result);
        showToast('Code executed successfully!', 'success');
      } else {
        showToast(`Running ${file.language} code is not supported yet`, 'error');
      }
    } catch (error) {
      console.error('Code execution error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to execute code', 'error');
    }
  }, [selectedFile, files, content, showToast]);

  return (
    <div className="flex h-full bg-[#1a1a1a]">
      <FileList
        files={files}
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
        onNewFile={handleNewFile}
      />

      <div className="flex-1 flex flex-col">
        <CodeEditorToolbar
          selectedFile={selectedFile}
          onSave={handleSave}
          onDelete={handleDelete}
          onRun={handleRun}
          showPreview={showPreview}
          onTogglePreview={() => setShowPreview(!showPreview)}
          showTerminal={showTerminal}
          onToggleTerminal={() => setShowTerminal(!showTerminal)}
        />

        <div className="flex-1 flex">
          <div className={`flex-1 flex flex-col ${showPreview ? 'w-1/2' : 'w-full'}`}>
            <CodeArea
              ref={editorRef}
              content={content}
              onChange={handleContentChange}
              language={files.find(f => f.id === selectedFile)?.language || 'javascript'}
            />
          </div>

          {showPreview && (
            <PreviewPanel
              content={content}
              language={files.find(f => f.id === selectedFile)?.language || 'javascript'}
            />
          )}
        </div>

        {showTerminal && (
          <Terminal />
        )}
      </div>

      <AiAssistant
        content={content}
        onContentChange={handleContentChange}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    </div>
  );
}