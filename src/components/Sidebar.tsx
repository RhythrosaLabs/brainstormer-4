import React from 'react';
import {
  MessageSquare,
  Image,
  Video,
  Music,
  Box,
  FileText,
  Table,
  BarChart2,
  Code,
  Calendar,
  Layout,
  Folder,
  HelpCircle,
  Settings,
  Pen
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'images', icon: Image, label: 'Images' },
    { id: 'videos', icon: Video, label: 'Videos' },
    { id: 'audio', icon: Music, label: 'Audio' },
    { id: '3d', icon: Box, label: '3D' },
    { id: 'documents', icon: FileText, label: 'Documents' },
    { id: 'spreadsheets', icon: Table, label: 'Spreadsheets' },
    { id: 'charts', icon: BarChart2, label: 'Charts' },
    { id: 'code', icon: Code, label: 'Code' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'whiteboard', icon: Pen, label: 'Whiteboard' },
    { id: 'tasks', icon: Layout, label: 'Tasks' },
    { id: 'files', icon: Folder, label: 'Files' },
    { id: 'help', icon: HelpCircle, label: 'Help' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="h-full bg-[#1a1a1a] border-r border-[#333] flex flex-col py-4">
      {tabs.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`w-full flex items-center gap-3 px-4 py-2 transition-all duration-200 ${
            activeTab === id 
              ? 'bg-gradient-to-r from-[#ff1b6b] to-[#45caff] text-white'
              : 'text-gray-400 hover:bg-[#242424] hover:text-white'
          }`}
          title={label}
        >
          <Icon size={20} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}