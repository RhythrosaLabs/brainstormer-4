import React, { useState } from 'react';
import { 
  File, Save, FileText, Plus, Trash2, Bold, Italic, Underline, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Image as ImageIcon, Table as TableIcon,
  Link, Undo, Redo, Type, PaintBucket, Minus, 
  ChevronDown, Printer, Download, Share2
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  content: string;
  lastModified: Date;
  style?: {
    font?: string;
    fontSize?: number;
    alignment?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
    backgroundColor?: string;
  };
}

export function DocumentEditor() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [fontSize, setFontSize] = useState(11);
  const [fontFamily, setFontFamily] = useState('Calibri');
  const [showRuler, setShowRuler] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [activeTab, setActiveTab] = useState('home');

  const fonts = [
    'Calibri', 'Arial', 'Times New Roman', 'Helvetica', 
    'Georgia', 'Verdana', 'Tahoma', 'Trebuchet MS'
  ];

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

  const handleNewDocument = () => {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: 'Untitled Document',
      content: '',
      lastModified: new Date(),
      style: {
        font: 'Calibri',
        fontSize: 11,
        alignment: 'left'
      }
    };
    setDocuments([...documents, newDoc]);
    setSelectedDoc(newDoc.id);
    setContent('');
  };

  const handleSave = () => {
    if (selectedDoc) {
      setDocuments(documents.map(doc =>
        doc.id === selectedDoc
          ? { ...doc, content, lastModified: new Date() }
          : doc
      ));
    }
  };

  const renderRuler = () => {
    return (
      <div className="h-6 border-b border-[#333] flex">
        {Array.from({ length: Math.floor(100 * (zoom / 100)) }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-2 border-l border-[#333] h-full">
            {i % 4 === 0 && (
              <div className="text-[8px] text-gray-400 pl-0.5">{i/4}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-full bg-[#1a1a1a]">
      {/* Left Sidebar - Document List */}
      <div className="w-64 border-r border-[#333] bg-[#242424]">
        <div className="p-4 border-b border-[#333]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Documents</h3>
            <button
              onClick={handleNewDocument}
              className="p-1.5 hover:bg-[#333] rounded"
              title="New Document"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {documents.map(doc => (
              <button
                key={doc.id}
                onClick={() => {
                  setSelectedDoc(doc.id);
                  setContent(doc.content);
                  setFontFamily(doc.style?.font || 'Calibri');
                  setFontSize(doc.style?.fontSize || 11);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded ${
                  selectedDoc === doc.id
                    ? 'bg-[#333] text-white'
                    : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                <FileText size={16} />
                <span className="truncate">{doc.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Quick Access Toolbar */}
        <div className="h-8 border-b border-[#333] flex items-center px-4 gap-2 bg-[#242424]">
          <button
            onClick={handleSave}
            className="p-1.5 hover:bg-[#333] rounded"
            title="Save"
          >
            <Save size={14} />
          </button>
          <button
            className="p-1.5 hover:bg-[#333] rounded"
            title="Print"
          >
            <Printer size={14} />
          </button>
          <Minus className="text-[#333]" />
          <button
            className="p-1.5 hover:bg-[#333] rounded"
            title="Share"
          >
            <Share2 size={14} />
          </button>
          <button
            className="p-1.5 hover:bg-[#333] rounded"
            title="Download"
          >
            <Download size={14} />
          </button>
        </div>

        {/* Ribbon */}
        <div className="border-b border-[#333]">
          {/* Tabs */}
          <div className="flex border-b border-[#333]">
            {['Home', 'Insert', 'Layout', 'References', 'Review', 'View'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 text-sm ${
                  activeTab === tab.toLowerCase()
                    ? 'bg-[#333] text-white'
                    : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="p-2 flex items-center gap-4">
            {/* Font */}
            <div className="flex items-center gap-2 border-r border-[#333] pr-4">
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="bg-[#333] text-sm rounded px-2 py-1 w-32"
              >
                {fonts.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="bg-[#333] text-sm rounded px-2 py-1 w-16"
              >
                {fontSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Text Formatting */}
            <div className="flex items-center gap-2 border-r border-[#333] pr-4">
              <button className="p-1.5 hover:bg-[#333] rounded" title="Bold">
                <Bold size={16} />
              </button>
              <button className="p-1.5 hover:bg-[#333] rounded" title="Italic">
                <Italic size={16} />
              </button>
              <button className="p-1.5 hover:bg-[#333] rounded" title="Underline">
                <Underline size={16} />
              </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-2 border-r border-[#333] pr-4">
              <button className="p-1.5 hover:bg-[#333] rounded" title="Align Left">
                <AlignLeft size={16} />
              </button>
              <button className="p-1.5 hover:bg-[#333] rounded" title="Align Center">
                <AlignCenter size={16} />
              </button>
              <button className="p-1.5 hover:bg-[#333] rounded" title="Align Right">
                <AlignRight size={16} />
              </button>
              <button className="p-1.5 hover:bg-[#333] rounded" title="Justify">
                <AlignJustify size={16} />
              </button>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-2 border-r border-[#333] pr-4">
              <button className="p-1.5 hover:bg-[#333] rounded" title="Bullet List">
                <List size={16} />
              </button>
              <button className="p-1.5 hover:bg-[#333] rounded" title="Numbered List">
                <ListOrdered size={16} />
              </button>
            </div>

            {/* Insert */}
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-[#333] rounded" title="Insert Image">
                <ImageIcon size={16} />
              </button>
              <button className="p-1.5 hover:bg-[#333] rounded" title="Insert Table">
                <TableIcon size={16} />
              </button>
              <button className="p-1.5 hover:bg-[#333] rounded" title="Insert Link">
                <Link size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Document Area */}
        <div className="flex-1 overflow-auto bg-[#242424] p-8">
          {selectedDoc ? (
            <div className="max-w-[850px] mx-auto"> {/* Changed from 816px to 850px for better proportion */}
              {showRuler && renderRuler()}
              <div 
                className="min-h-[1056px] bg-white rounded-sm shadow-lg p-12" /* Changed padding from 16 to 12 */
                style={{ 
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top center'
                }}
              >
                <div
                  contentEditable
                  className="outline-none min-h-full max-w-[650px] mx-auto" /* Added max-width and margin auto */
                  style={{
                    fontFamily,
                    fontSize: `${fontSize}pt`,
                    lineHeight: '1.5',
                    color: '#000'
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                  onInput={(e) => setContent(e.currentTarget.innerHTML)}
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
              <File size={48} />
              <p>No document selected</p>
              <button
                onClick={handleNewDocument}
                className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded"
              >
                Create New Document
              </button>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="h-6 border-t border-[#333] bg-[#242424] flex items-center justify-between px-4 text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span>Words: 0</span>
            <span>Characters: 0</span>
            <span>Page: 1 of 1</span>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="bg-transparent"
            >
              {[50, 75, 90, 100, 125, 150, 200].map(value => (
                <option key={value} value={value}>{value}%</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}