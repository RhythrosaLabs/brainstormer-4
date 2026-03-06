import React from 'react';
import { Sheet } from './types';

interface SpreadsheetGridProps {
  sheets: Sheet[];
  selectedSheet: string | null;
  selectedCell: string | null;
  onSelectCell: (cellId: string) => void;
  onCellChange: (cellId: string, value: string, isFormula: boolean) => void;
  showGridlines: boolean;
  showHeaders: boolean;
  zoom: number;
}

export function SpreadsheetGrid({
  sheets,
  selectedSheet,
  selectedCell,
  onSelectCell,
  onCellChange,
  showGridlines,
  showHeaders,
  zoom
}: SpreadsheetGridProps) {
  const sheet = sheets.find(s => s.id === selectedSheet);
  const columns = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const rows = Array.from({ length: 100 }, (_, i) => i + 1);

  if (!sheet) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        No sheet selected
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="inline-block min-w-full" style={{ zoom: zoom / 100 }}>
        <table className="border-collapse">
          {showHeaders && (
            <thead>
              <tr>
                <th className="w-10 h-8 bg-[#242424] border border-[#333]"></th>
                {columns.map(col => (
                  <th
                    key={col}
                    className="w-24 h-8 bg-[#242424] border border-[#333] text-sm text-gray-400"
                    style={{ width: sheet.columnWidths[col] || 96 }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map(row => (
              <tr key={row}>
                {showHeaders && (
                  <td
                    className="w-10 h-8 bg-[#242424] border border-[#333] text-sm text-center text-gray-400"
                    style={{ height: sheet.rowHeights[row] || 32 }}
                  >
                    {row}
                  </td>
                )}
                {columns.map(col => {
                  const cellId = `${col}${row}`;
                  const cell = sheet.cells[cellId];
                  const isSelected = selectedCell === cellId;

                  return (
                    <td
                      key={cellId}
                      className={`relative ${
                        showGridlines ? 'border border-[#333]' : ''
                      } ${
                        isSelected ? 'ring-2 ring-[#45caff] z-10' : ''
                      }`}
                      onClick={() => onSelectCell(cellId)}
                    >
                      <input
                        type="text"
                        value={cell?.value || ''}
                        onChange={(e) => onCellChange(cellId, e.target.value, false)}
                        className={`w-full h-full bg-transparent px-2 focus:outline-none ${
                          cell?.style?.bold ? 'font-bold' : ''
                        } ${
                          cell?.style?.italic ? 'italic' : ''
                        } ${
                          cell?.style?.underline ? 'underline' : ''
                        }`}
                        style={{
                          textAlign: cell?.style?.align || 'left',
                          backgroundColor: cell?.style?.backgroundColor,
                          color: cell?.style?.textColor,
                          fontSize: cell?.style?.fontSize,
                          fontFamily: cell?.style?.fontFamily
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}