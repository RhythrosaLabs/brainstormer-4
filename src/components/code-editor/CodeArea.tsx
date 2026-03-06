import React, { forwardRef } from 'react';
import { CodeLanguage } from '../../types/code-editor';

interface CodeAreaProps {
  content: string;
  onChange: (content: string) => void;
  language: CodeLanguage;
}

export const CodeArea = forwardRef<HTMLTextAreaElement, CodeAreaProps>(
  function CodeArea({ content, onChange, language }, ref) {
    return (
      <div className="relative flex-1 font-mono text-sm">
        <textarea
          ref={ref}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 bg-[#1e1e1e] text-gray-300 p-4 resize-none focus:outline-none leading-6"
          spellCheck={false}
        />
      </div>
    );
  }
);