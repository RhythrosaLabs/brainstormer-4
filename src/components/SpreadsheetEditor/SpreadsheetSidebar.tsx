import React from 'react';
import { Plus, Table } from 'lucide-react';
import { Sheet } from './types';

interface SpreadsheetSidebarProps {
  sheets: Sheet[];
  selectedSheet: string | null;
  onNewSheet: () => void;
  onSelectSheet: (sheetId: string) => void;
}

export function SpreadsheetSidebar({
  sheets,
  selectedSheet,
  onNewSheet,
  onSelectSheet
}: SpreadsheetSidebarProps) {
  return (
    <div className="w-48 border-r border-[#333] bg-[#242424]">
      <div className="p-4 border-b border-[#333]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Sheets</h3>
          <button
            onClick={onNewSheet}
            className="p-1.5 hover:bg-[#333] rounded"
            title="New Sheet"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-1">
          {sheets.map(sheet => (
            <button
              key={sheet.id}
              onClick={() => onSelectSheet(sheet.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded ${
                selectedSheet === sheet.id
                  ? 'bg-[#333] text-white'
                  : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
              }`}
            >
              <Table size={16} />
              <span className="truncate">{sheet.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}