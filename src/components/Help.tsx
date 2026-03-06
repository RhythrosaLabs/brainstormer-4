import React, { useState, useMemo } from 'react';
import { Search, Book, Command, Keyboard, Wrench, Wand2, Video, Music, Box, Code, FileText, Table, BarChart2, Folder, Calendar, Layout, Key, HelpCircle, ChevronRight, ChevronDown } from 'lucide-react';

interface HelpSection {
  id: string;
  title: string;
  icon: React.ElementType;
  content: {
    description: string;
    subsections: {
      title: string;
      content: string;
      examples?: string[];
      shortcuts?: { key: string; description: string }[];
    }[];
  };
}

export function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const helpSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      content: {
        description: 'Learn the basics of brAInstormer and how to get started with AI-powered creation.',
        subsections: [
          {
            title: 'Quick Start Guide',
            content: 'brAInstormer is an AI-powered creative suite that helps you generate and edit various types of content. Start by setting up your API keys in the Settings tab, then choose your desired creative tool from the sidebar.'
          },
          {
            title: 'Setting Up API Keys',
            content: 'To use AI features, you\'ll need to add your API keys in Settings. We support OpenAI, Stability AI, Anthropic, Luma AI, and more. Your keys are stored locally and never sent to our servers.'
          },
          {
            title: 'Workspace Overview',
            content: 'The interface consists of a sidebar for navigation, a main workspace for your current tool, and an optional chat panel for AI assistance. Use the command palette (Cmd/Ctrl + K) for quick access to features.'
          }
        ]
      }
    },
    {
      id: 'commands',
      title: 'Command Palette',
      icon: Command,
      content: {
        description: 'Master the command palette to quickly access features and perform actions.',
        subsections: [
          {
            title: 'Basic Usage',
            content: 'Press Cmd/Ctrl + K to open the command palette. Start typing to search for commands, tools, or actions.',
            shortcuts: [
              { key: '⌘/Ctrl + K', description: 'Open command palette' },
              { key: 'ESC', description: 'Close command palette' },
              { key: '↑/↓', description: 'Navigate suggestions' },
              { key: 'Enter', description: 'Execute command' }
            ]
          },
          {
            title: 'Available Commands',
            content: 'Common commands include:',
            examples: [
              '/image - Generate images with AI',
              '/video - Create or edit videos',
              '/code - Get coding assistance',
              '/save - Save current project',
              '/export - Export your work'
            ]
          }
        ]
      }
    },
    {
      id: 'ai-features',
      title: 'AI Features',
      icon: Wand2,
      content: {
        description: 'Learn how to use AI-powered generation and editing features.',
        subsections: [
          {
            title: 'Text Generation',
            content: 'Use GPT-4, Claude, or Llama models for text generation. Write detailed prompts for better results.',
            examples: [
              'Creative writing and storytelling',
              'Technical documentation',
              'Code generation and explanation',
              'Content translation and refinement'
            ]
          },
          {
            title: 'Image Generation',
            content: 'Generate images using DALL·E 3, Stable Diffusion, or other models. Experiment with different prompts and styles.',
            examples: [
              'Detailed scene descriptions',
              'Style-specific prompts',
              'Negative prompts for refinement',
              'Variations and iterations'
            ]
          },
          {
            title: 'Other AI Tools',
            content: 'Explore video generation, 3D modeling, audio creation, and more through our integrated AI services.'
          }
        ]
      }
    },
    {
      id: 'tools',
      title: 'Creative Tools',
      icon: Wrench,
      content: {
        description: 'Detailed guide for each creative tool in the suite.',
        subsections: [
          {
            title: 'Image Editor',
            content: 'Professional-grade image editor with layers, effects, and AI assistance.',
            shortcuts: [
              { key: 'V', description: 'Move tool' },
              { key: 'B', description: 'Brush tool' },
              { key: 'E', description: 'Eraser tool' },
              { key: 'L', description: 'Lasso tool' }
            ]
          },
          {
            title: 'Video Editor',
            content: 'Timeline-based video editor with effects, transitions, and AI video generation.',
            shortcuts: [
              { key: 'Space', description: 'Play/Pause' },
              { key: 'K', description: 'Split clip' },
              { key: '[/]', description: 'Previous/Next frame' }
            ]
          },
          {
            title: 'Audio Editor',
            content: 'Multi-track audio workstation with virtual instruments and AI music generation.',
            shortcuts: [
              { key: 'Space', description: 'Play/Pause' },
              { key: 'R', description: 'Record' },
              { key: 'M', description: 'Mute track' }
            ]
          }
        ]
      }
    },
    {
      id: 'keyboard-shortcuts',
      title: 'Keyboard Shortcuts',
      icon: Keyboard,
      content: {
        description: 'Master the keyboard shortcuts for efficient workflow.',
        subsections: [
          {
            title: 'Global Shortcuts',
            content: 'These shortcuts work anywhere in the application:',
            shortcuts: [
              { key: '⌘/Ctrl + K', description: 'Command palette' },
              { key: '⌘/Ctrl + S', description: 'Save project' },
              { key: '⌘/Ctrl + Z', description: 'Undo' },
              { key: '⌘/Ctrl + Shift + Z', description: 'Redo' },
              { key: '⌘/Ctrl + /', description: 'Show this help' }
            ]
          },
          {
            title: 'Tool-Specific Shortcuts',
            content: 'Each tool has its own set of shortcuts. Click on a tool in the Creative Tools section to see its shortcuts.'
          }
        ]
      }
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery) return helpSections;

    const query = searchQuery.toLowerCase();
    return helpSections.filter(section =>
      section.title.toLowerCase().includes(query) ||
      section.content.description.toLowerCase().includes(query) ||
      section.content.subsections.some(sub =>
        sub.title.toLowerCase().includes(query) ||
        sub.content.toLowerCase().includes(query) ||
        sub.examples?.some(ex => ex.toLowerCase().includes(query)) ||
        sub.shortcuts?.some(sc => 
          sc.key.toLowerCase().includes(query) ||
          sc.description.toLowerCase().includes(query)
        )
      )
    );
  }, [searchQuery]);

  return (
    <div className="flex-1 flex flex-col bg-[#1a1a1a] text-white">
      {/* Header */}
      <div className="p-4 border-b border-[#333]">
        <div className="flex items-center gap-2">
          <HelpCircle size={20} className="text-gray-400" />
          <h2 className="text-xl font-semibold">Help Center</h2>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-[#333]">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help topics..."
            className="w-full bg-[#242424] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#45caff]"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Help Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {filteredSections.map(section => {
            const isExpanded = expandedSections.includes(section.id);
            const Icon = section.icon;

            return (
              <div key={section.id} className="bg-[#242424] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-[#2a2a2a] transition-colors"
                >
                  <Icon size={20} className="text-gray-400" />
                  <span className="font-medium flex-1 text-left">{section.title}</span>
                  {isExpanded ? (
                    <ChevronDown size={20} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0">
                    <p className="text-gray-400 mb-4">{section.content.description}</p>
                    
                    <div className="space-y-6">
                      {section.content.subsections.map((subsection, index) => (
                        <div key={index} className="pl-4 border-l border-[#333]">
                          <h4 className="text-lg font-medium mb-2">{subsection.title}</h4>
                          <p className="text-gray-300 mb-3">{subsection.content}</p>

                          {subsection.examples && (
                            <div className="mb-3">
                              <div className="text-sm font-medium text-gray-400 mb-2">Examples:</div>
                              <ul className="list-disc list-inside space-y-1 text-gray-300">
                                {subsection.examples.map((example, i) => (
                                  <li key={i}>{example}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {subsection.shortcuts && (
                            <div className="mb-3">
                              <div className="text-sm font-medium text-gray-400 mb-2">Shortcuts:</div>
                              <div className="grid grid-cols-2 gap-2">
                                {subsection.shortcuts.map((shortcut, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-[#333] rounded text-sm">{shortcut.key}</kbd>
                                    <span className="text-gray-300">{shortcut.description}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}