import React, { useState, useCallback } from 'react';
import { Folder, File, Upload, Download, Trash2, Plus } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  lastModified: Date;
  parentId: string | null;
}

export function FileManager() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleNewFolder = () => {
    const newFolder: FileItem = {
      id: `folder-${Date.now()}`,
      name: 'New Folder',
      type: 'folder',
      lastModified: new Date(),
      parentId: currentFolder
    };
    setItems([...items, newFolder]);
  };

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles: FileItem[] = Array.from(files).map(file => ({
      id: `file-${Date.now()}-${file.name}`,
      name: file.name,
      type: 'file',
      size: file.size,
      lastModified: new Date(file.lastModified),
      parentId: currentFolder
    }));

    setItems(prev => [...prev, ...newFiles]);
  }, [currentFolder]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFolderDrop = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (selectedItem) {
      // Move item to new folder
      setItems(prev => prev.map(item =>
        item.id === selectedItem
          ? { ...item, parentId: folderId }
          : item
      ));
    } else if (e.dataTransfer.files.length > 0) {
      // Upload files directly to folder
      const newFiles: FileItem[] = Array.from(e.dataTransfer.files).map(file => ({
        id: `file-${Date.now()}-${file.name}`,
        name: file.name,
        type: 'file',
        size: file.size,
        lastModified: new Date(file.lastModified),
        parentId: folderId
      }));
      setItems(prev => [...prev, ...newFiles]);
    }
  };

  const getCurrentItems = () => {
    return items.filter(item => item.parentId === currentFolder);
  };

  const getBreadcrumbs = () => {
    const breadcrumbs: FileItem[] = [];
    let currentId = currentFolder;
    
    while (currentId) {
      const folder = items.find(item => item.id === currentId);
      if (folder) {
        breadcrumbs.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }

    return breadcrumbs;
  };

  return (
    <div className="flex h-full bg-[#1a1a1a]">
      {/* Left Sidebar - Quick Access */}
      <div className="w-64 border-r border-[#333] bg-[#242424]">
        <div className="p-4 border-b border-[#333]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Quick Access</h3>
            <div className="flex gap-1">
              <button
                onClick={handleNewFolder}
                className="p-1.5 hover:bg-[#333] rounded"
                title="New Folder"
              >
                <Plus size={16} />
              </button>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
                multiple
              />
              <label
                htmlFor="file-upload"
                className="p-1.5 hover:bg-[#333] rounded cursor-pointer"
                title="Upload File"
              >
                <Upload size={16} />
              </label>
            </div>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => setCurrentFolder(null)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#333] rounded"
            >
              <Folder size={16} />
              <span>All Files</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Breadcrumb Navigation */}
        <div className="h-12 border-b border-[#333] flex items-center px-4 gap-2">
          <button
            onClick={() => setCurrentFolder(null)}
            className="text-sm text-gray-400 hover:text-white"
          >
            Root
          </button>
          {getBreadcrumbs().map((folder, index) => (
            <React.Fragment key={folder.id}>
              <span className="text-gray-600">/</span>
              <button
                onClick={() => setCurrentFolder(folder.id)}
                className="text-sm text-gray-400 hover:text-white"
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* File Grid */}
        <div 
          className={`flex-1 p-4 overflow-auto ${
            isDraggingOver ? 'bg-[#242424] bg-opacity-50' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="grid grid-cols-4 gap-4">
            {getCurrentItems().map(item => (
              <div
                key={item.id}
                draggable
                onDragStart={() => setSelectedItem(item.id)}
                onDragEnd={() => setSelectedItem(null)}
                onDragOver={(e) => {
                  if (item.type === 'folder') {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                onDrop={(e) => {
                  if (item.type === 'folder') {
                    handleFolderDrop(e, item.id);
                  }
                }}
                onClick={() => {
                  if (item.type === 'folder') {
                    setCurrentFolder(item.id);
                  } else {
                    setSelectedItem(item.id);
                  }
                }}
                className={`p-4 rounded flex flex-col items-center gap-2 cursor-pointer ${
                  selectedItem === item.id
                    ? 'bg-[#333] text-white'
                    : 'hover:bg-[#242424] text-gray-400 hover:text-white'
                }`}
              >
                {item.type === 'folder' ? (
                  <Folder size={32} />
                ) : (
                  <File size={32} />
                )}
                <span className="text-sm truncate w-full text-center">
                  {item.name}
                </span>
                {item.size && (
                  <span className="text-xs text-gray-500">
                    {(item.size / 1024).toFixed(1)} KB
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-64 border-l border-[#333] bg-[#242424]">
        {selectedItem && (
          <div className="p-4">
            <h3 className="text-sm font-medium mb-4">Properties</h3>
            <div className="space-y-4">
              {/* File/Folder Properties */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={items.find(item => item.id === selectedItem)?.name}
                  onChange={(e) => {
                    setItems(items.map(item =>
                      item.id === selectedItem
                        ? { ...item, name: e.target.value }
                        : item
                    ));
                  }}
                  className="w-full bg-[#333] text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Type</label>
                <p className="text-sm">
                  {items.find(item => item.id === selectedItem)?.type === 'folder'
                    ? 'Folder'
                    : 'File'}
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Last Modified</label>
                <p className="text-sm">
                  {items.find(item => item.id === selectedItem)?.lastModified.toLocaleDateString()}
                </p>
              </div>
              {items.find(item => item.id === selectedItem)?.size && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Size</label>
                  <p className="text-sm">
                    {(items.find(item => item.id === selectedItem)?.size! / 1024).toFixed(1)} KB
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}