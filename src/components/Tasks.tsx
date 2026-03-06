import React, { useState } from 'react';
import { Plus, MoreVertical, MessageSquare, Image, Video, Box, Music, Code, FileText, Table, BarChart2, Folder } from 'lucide-react';

interface BoardItem {
  id: string;
  type: 'text' | 'image' | 'video' | '3d' | 'audio' | 'code' | 'document' | 'spreadsheet' | 'chart' | 'file';
  title: string;
  description: string;
  mediaUrl?: string;
  status: 'todo' | 'in-progress';
  createdAt: Date;
}

interface Column {
  id: 'todo' | 'in-progress';
  title: string;
  items: BoardItem[];
}

export function Tasks() {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', items: [] },
    { id: 'in-progress', title: 'In Progress', items: [] }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<Column['id']>('todo');
  const [newItemType, setNewItemType] = useState<BoardItem['type']>('text');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  const mediaTypes = [
    { type: 'text' as const, icon: MessageSquare, label: 'Text' },
    { type: 'image' as const, icon: Image, label: 'Image' },
    { type: 'video' as const, icon: Video, label: 'Video' },
    { type: '3d' as const, icon: Box, label: '3D Model' },
    { type: 'audio' as const, icon: Music, label: 'Audio' },
    { type: 'code' as const, icon: Code, label: 'Code' },
    { type: 'document' as const, icon: FileText, label: 'Document' },
    { type: 'spreadsheet' as const, icon: Table, label: 'Spreadsheet' },
    { type: 'chart' as const, icon: BarChart2, label: 'Chart' },
    { type: 'file' as const, icon: Folder, label: 'File' }
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

  const handleAddItem = () => {
    if (!newItemTitle.trim()) return;

    const newItem: BoardItem = {
      id: `item-${Date.now()}`,
      type: newItemType,
      title: newItemTitle,
      description: newItemDescription,
      status: selectedColumn,
      createdAt: new Date()
    };

    setColumns(prevColumns => 
      prevColumns.map(col =>
        col.id === selectedColumn
          ? { ...col, items: [...col.items, newItem] }
          : col
      )
    );

    setNewItemTitle('');
    setNewItemDescription('');
    setShowAddModal(false);
  };

  const getIconForType = (type: BoardItem['type']) => {
    const mediaType = mediaTypes.find(t => t.type === type);
    return mediaType?.icon || Folder;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1a1a1a] text-white overflow-hidden">
      {/* Board Header */}
      <div className="flex-shrink-0 p-4 border-b border-[#333] flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-[#ff1b6b] to-[#45caff] rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {/* Board Columns */}
      <div className="flex-1 p-4 overflow-x-auto">
        <div className="grid grid-cols-2 gap-4 h-full">
          {columns.map(column => (
            <div
              key={column.id}
              className="flex flex-col bg-[#242424] rounded-lg"
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
                        Added {item.createdAt.toLocaleDateString()}
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
            <h3 className="text-lg font-medium mb-4">Add New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {mediaTypes.map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      onClick={() => setNewItemType(type)}
                      className={`flex items-center gap-2 p-2 rounded ${
                        newItemType === type ? 'bg-[#45caff] text-white' : 'hover:bg-[#333]'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className="w-full bg-[#333] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  className="w-full bg-[#333] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#45caff] resize-none"
                  rows={3}
                  placeholder="Enter task description"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 hover:bg-[#333] rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-gradient-to-r from-[#ff1b6b] to-[#45caff] rounded hover:opacity-90"
                disabled={!newItemTitle.trim()}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}