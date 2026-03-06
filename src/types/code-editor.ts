export interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: string;
  lastModified: Date;
}

export type CodeLanguage = 
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'html'
  | 'css'
  | 'json'
  | 'markdown';

export interface CodeSuggestion {
  text: string;
  type: 'keyword' | 'function' | 'variable' | 'class' | 'property';
  description?: string;
}