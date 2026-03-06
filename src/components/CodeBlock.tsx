import React from 'react';
import { ClipboardCopy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Copy code"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <ClipboardCopy size={16} />}
          </button>
        </div>
        <code className="text-sm font-mono text-gray-300">{code}</code>
      </pre>
      {language && (
        <div className="absolute right-2 bottom-2 text-xs text-gray-500">
          {language}
        </div>
      )}
    </div>
  );
}