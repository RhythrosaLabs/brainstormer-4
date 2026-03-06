import React from 'react';

interface PreviewPanelProps {
  content: string;
  language: string;
}

export function PreviewPanel({ content, language }: PreviewPanelProps) {
  if (language === 'html') {
    return (
      <div className="w-1/2 border-l border-[#333] bg-white">
        <iframe
          srcDoc={content}
          className="w-full h-full"
          sandbox="allow-scripts"
          title="Preview"
        />
      </div>
    );
  }

  return (
    <div className="w-1/2 border-l border-[#333] p-4">
      <pre className="text-sm text-gray-300">
        <code>{content}</code>
      </pre>
    </div>
  );
}