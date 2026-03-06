import { useState, useCallback } from 'react';
import { CodeFile } from '../types/code-editor';
import { useToast } from './useToast';
import { createFile, updateFile } from '../lib/utils/file';

export function useCodeEditor() {
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  const handleNewFile = useCallback(() => {
    const newFile = createFile('Untitled.js');
    setFiles(prev => [...prev, newFile]);
    setSelectedFile(newFile.id);
    setContent('');
  }, []);

  const handleFileSelect = useCallback((fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      setSelectedFile(fileId);
      setContent(file.content);
    }
  }, [files]);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const handleSave = useCallback(() => {
    if (!selectedFile) return;
    
    setFiles(prev => prev.map(file =>
      file.id === selectedFile
        ? updateFile(file, content)
        : file
    ));
    showToast('File saved successfully', 'success');
  }, [selectedFile, content, showToast]);

  const handleDelete = useCallback(() => {
    if (!selectedFile) return;
    
    setFiles(prev => prev.filter(file => file.id !== selectedFile));
    setSelectedFile(null);
    setContent('');
    showToast('File deleted successfully', 'success');
  }, [selectedFile, showToast]);

  return {
    files,
    selectedFile,
    content,
    isProcessing,
    handleNewFile,
    handleFileSelect,
    handleContentChange,
    handleSave,
    handleDelete
  };
}