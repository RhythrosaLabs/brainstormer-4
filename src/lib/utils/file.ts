import { CodeFile } from '../../types/code-editor';

export function createFile(name: string, language: string = 'javascript'): CodeFile {
  return {
    id: `file-${Date.now()}`,
    name,
    content: '',
    language,
    lastModified: new Date()
  };
}

export function updateFile(file: CodeFile, content: string): CodeFile {
  return {
    ...file,
    content,
    lastModified: new Date()
  };
}