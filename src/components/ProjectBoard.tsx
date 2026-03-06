import React, { useState } from 'react';
import { Plus, MoreVertical, MessageSquare, Image, Video, Box, Music, Code, FileText, Table, BarChart2, Folder } from 'lucide-react';

interface BoardItem {
  id: string;
  type: 'text' | 'image' | 'video' | '3d' | 'audio' | 'code' | 'document' | 'spreadsheet' | 'chart' | 'file';
  title: string;
  description: string;
  mediaUrl?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  createdAt: Date;
}

interface Column {
  id: 'todo' | 'in-progress' | 'review' | 'done';
  title: string;
  items: BoardItem[];
}

export function ProjectBoard() {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', items: [] },
    { id: 'in-progress', title: 'In Progress', items: [] },
    { id: 'review', title: 'Review', items: [] },
    { id: 'done', title: 'Done', items: [] }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<Column['id']>('todo');

  const mediaTypes = [
    { type: 'text', icon: MessageSquare, label: 'Text' },
    { type: 'image', icon: Image, label: 'Image' },
    { type: 'video', icon: Video, label: 'Video' },
    { type: '3d', icon: Box, label: '3D Model' },
    { type: 'audio', icon: Music, label: 'Audio' },
    { type: 'code', icon: Code, label: 'Code' },
    { type: 'document', icon: FileText, label: 'Document' },
    { type: 'spreadsheet', icon: Table, label: 'Spreadsheet' },
    { type: 'chart', icon: BarChart2, label: 'Chart' },
    { type: 'file', icon: Folder, label: 'File' }
  ];

  const handleDragStart = (e: React.DragEvent, itemId: string, sourceColumn: string) => {
    e.dataTransfer.setData('itemId', itemId);
    e.dataTransfer.setData('sourceColumn', sourceColumn);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumn: Column['id']) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    const sourceColumn = e.dataTransfer.getData('sourceColumn');

    if (sourceColumn === targetColumn) return;

    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const sourceCol = newColumns.find(col => col.id === sourceColumn);
      const targetCol = newColumns.find(col => col.id === targetColumn);
      
      if (!sourceCol || !targetCol) return prevColumns;

      const item = sourceCol.items.find(item => item.id === itemId);
      if (!item) return prevColumns;

      sourceCol.items = sourceCol.items.filter(item => item.id !== itemId);
      targetCol.items = [...targetCol.items, { ...item, status: targetColumn }];

      return newColumns;
    });
  };

  const getIconForType = (type: BoardItem['type']) => {
    const mediaType = mediaTypes.find(t => t.type === type);
    return mediaType?.icon || Folder;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1a1a1a] text-white">
      {/* Board Header */}
      <div className="p-4 border-b border-[#333] flex items-center justify-between">
        <h2 className="text-xl font-semibold">Project Board</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-[#ff1b6b] to-[#45caff] rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* Board Columns */}
      <div className="flex-1 p-4 overflow-x-auto">
        <div className="flex gap-4 h-full min-w-max">
          {columns.map(column => (
            <div
              key={column.id}
              className="w-80 flex flex-col bg-[#242424] rounded-lg"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="p-3 border-b border-[#333]">
                <h3 className="font-medium">{column.title}</h3>
                <div className="text-sm text-gray-400">{column.items.length} items</div>
              </div>

              <div className="flex-1 p-2 overflow-y-auto space-y-2">
                {column.items.map(item => {
                  const Icon = getIconForType(item.type);
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id, column.id)}
                      className="bg-[#2a2a2a] p-3 rounded-lg cursor-move hover:bg-[#333] group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Icon size={16} className="text-gray-400" />
                          <h4 className="font-medium">{item.title}</h4>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#404040] rounded">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                      {item.mediaUrl && (
                        <div className="mt-2 rounded overflow-hidden">
                          {item.type === 'image' && (
                            <img src={item.mediaUrl} alt={item.title} className="w-full h-32 object-cover" />
                          )}
                          {item.type === 'video' && (
                            <video src={item.mediaUrl} className="w-full h-32 object-cover" />
                          )}
                        </div>
                      )}
                      <p className="mt-2 text-sm text-gray-400">{item.description}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        Added {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setSelectedColumn(column.id);
                  setShowAddModal(true);
                }}
                className="m-2 p-2 border border-dashed border-[#404040] rounded text-gray-400 hover:bg-[#2a2a2a] hover:border-[#45caff] hover:text-white transition-colors"
              >
                <Plus size={16} className="mx-auto" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#242424] rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Add New Item</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {mediaTypes.map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  className="flex items-center gap-2 p-2 rounded hover:bg-[#333]"
                  onClick={() => {
                    // Handle media type selection
                  }}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 hover:bg-[#333] rounded"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-[#ff1b6b] to-[#45caff] rounded hover:opacity-90">
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}