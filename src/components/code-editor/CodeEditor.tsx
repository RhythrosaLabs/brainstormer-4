import React, { useState, useCallback } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { FileList } from './FileList';
import { CodeArea } from './CodeArea';
import { Terminal } from './Terminal';
import { generateOpenAIText } from '../../services/openai';
import { useToast } from '../../hooks/useToast';
import { Send, Terminal as TerminalIcon } from 'lucide-react';

interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: string;
  lastModified: Date;
}

export function CodeEditor() {
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const { showToast } = useToast();

  const handleNewFile = useCallback(() => {
    const newFile: CodeFile = {
      id: `file-${Date.now()}`,
      name: 'Untitled.js',
      content: '',
      language: 'javascript',
      lastModified: new Date()
    };
    setFiles(prev => [...prev, newFile]);
    setSelectedFile(newFile.id);
    setContent('');
  }, []);

  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      showToast('Please enter a prompt', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await generateOpenAIText({
        model: 'gpt-4',
        prompt: `Generate code for: ${prompt}\nProvide only the code without any explanations.`
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to generate code');
      }

      // Create new file with generated code
      const fileExtension = prompt.toLowerCase().includes('python') ? '.py' : '.js';
      const newFile: CodeFile = {
        id: `file-${Date.now()}`,
        name: `generated${fileExtension}`,
        content: result.data.trim(),
        language: fileExtension === '.py' ? 'python' : 'javascript',
        lastModified: new Date()
      };

      setFiles(prev => [...prev, newFile]);
      setSelectedFile(newFile.id);
      setContent(newFile.content);
      setPrompt('');
      showToast('Code generated successfully!', 'success');
    } catch (error) {
      console.error('Code generation error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to generate code', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunCode = () => {
    if (!selectedFile) return;
    
    const file = files.find(f => f.id === selectedFile);
    if (!file) return;

    try {
      if (file.language === 'javascript') {
        // Execute JS code
        const result = new Function(content)();
        console.log('Execution result:', result);
        showToast('Code executed successfully!', 'success');
        setShowTerminal(true);
      } else {
        showToast(`Running ${file.language} code is not supported yet`, 'error');
      }
    } catch (error) {
      console.error('Code execution error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to execute code', 'error');
      setShowTerminal(true);
    }
  };

  return (
    <div className="flex h-full bg-[#1e1e1e]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={15} minSize={10} maxSize={20}>
          <FileList
            files={files}
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            onNewFile={handleNewFile}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={85}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70}>
              <div className="flex flex-col h-full">
                {/* Editor Toolbar */}
                <div className="h-10 border-b border-[#333] flex items-center px-4 gap-2">
                  <button
                    onClick={handleRunCode}
                    disabled={!selectedFile}
                    className="px-3 py-1 bg-[#45caff] text-white rounded hover:bg-[#3bb5e6] disabled:opacity-50"
                  >
                    Run
                  </button>
                  <button
                    onClick={() => setShowTerminal(!showTerminal)}
                    className={`p-1.5 rounded ${showTerminal ? 'bg-[#333]' : 'hover:bg-[#333]'}`}
                  >
                    <TerminalIcon size={16} />
                  </button>
                </div>

                {/* Code Editor */}
                <div className="flex-1 relative">
                  <CodeArea
                    content={content}
                    onChange={setContent}
                    language={files.find(f => f.id === selectedFile)?.language || 'javascript'}
                  />
                </div>

                {/* Code Generation Input */}
                <div className="border-t border-[#333] p-2 flex gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the code you want to generate..."
                    className="flex-1 bg-[#252526] text-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerateCode();
                      }
                    }}
                  />
                  <button
                    onClick={handleGenerateCode}
                    disabled={isProcessing || !prompt.trim()}
                    className="px-3 py-1.5 bg-[#45caff] text-white rounded hover:bg-[#3bb5e6] disabled:opacity-50 flex items-center gap-2"
                  >
                    <Send size={16} />
                    Generate
                  </button>
                </div>
              </div>
            </ResizablePanel>

            {showTerminal && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={30}>
                  <Terminal />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}