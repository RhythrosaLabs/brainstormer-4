import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChartViewer } from './ChartViewer';
import { FileViewer } from './FileViewer';
import { ModelViewer } from './ModelViewer';
import 'github-markdown-css/github-markdown-dark.css';
import 'highlight.js/styles/github-dark.css';

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    isError?: boolean;
    media?: {
      type: string;
      url?: string;
      data?: any;
      metadata?: {
        name: string;
        size?: number;
        format?: string;
        dimensions?: string;
        duration?: number;
      };
    };
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const renderMedia = () => {
    if (!message.media) return null;

    switch (message.media.type) {
      case 'image':
        return (
          <img
            src={message.media.url}
            alt="Generated content"
            className="max-w-full rounded-lg"
          />
        );
      case 'video':
        return (
          <video
            src={message.media.url}
            controls
            className="max-w-full rounded-lg"
          />
        );
      case 'audio':
        return (
          <audio
            src={message.media.url}
            controls
            className="w-full"
          />
        );
      case '3d':
        return (
          <ModelViewer
            url={message.media.url}
            data={message.media.data}
          />
        );
      case 'chart':
        return (
          <ChartViewer
            data={message.media.data}
            type={message.media.metadata?.format}
          />
        );
      case 'spreadsheet':
      case 'document':
        return (
          <FileViewer
            url={message.media.url}
            type={message.media.type}
            metadata={message.media.metadata}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          message.role === 'user'
            ? 'bg-gradient-to-r from-[#ff1b6b]/10 via-[#45caff]/10 to-[#ff1b6b]/10 border border-[#ff1b6b]/20 shadow-lg shadow-[#ff1b6b]/5'
            : message.isError
            ? 'bg-red-900/20 border border-red-500/20'
            : 'bg-[#242424] border border-[#333]'
        }`}
      >
        <div className={`markdown-body bg-transparent ${message.role === 'user' ? 'text-gray-100' : ''}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';
                
                if (!inline && language) {
                  return (
                    <div className="relative group">
                      <SyntaxHighlighter
                        language={language}
                        style={oneDark}
                        PreTag="div"
                        className="rounded-lg !bg-[#1a1a1a] !p-4"
                        showLineNumbers
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(String(children));
                          }}
                          className="p-2 bg-[#333] hover:bg-[#444] rounded text-xs text-gray-300"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                        {language}
                      </div>
                    </div>
                  );
                }

                return (
                  <code className="bg-[#1a1a1a] px-1.5 py-0.5 rounded text-sm" {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {message.media && (
          <div className="mt-4">
            {renderMedia()}
            {message.media.metadata && (
              <div className="mt-2 text-sm text-gray-300">
                <p>Name: {message.media.metadata.name}</p>
                {message.media.metadata.size && (
                  <p>Size: {(message.media.metadata.size / 1024).toFixed(2)} KB</p>
                )}
                {message.media.metadata.dimensions && (
                  <p>Dimensions: {message.media.metadata.dimensions}</p>
                )}
                {message.media.metadata.duration && (
                  <p>Duration: {message.media.metadata.duration}s</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}