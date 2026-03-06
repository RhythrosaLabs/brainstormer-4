import React, { useState, useRef } from 'react';
import { SpreadsheetToolbar } from './SpreadsheetToolbar';
import { SpreadsheetGrid } from './SpreadsheetGrid';
import { SpreadsheetSidebar } from './SpreadsheetSidebar';
import { SpreadsheetFormulaBar } from './SpreadsheetFormulaBar';
import { SpreadsheetStatusBar } from './SpreadsheetStatusBar';
import { Sheet, Cell } from './types';

export function SpreadsheetEditor() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<string[]>([]);
  const [formulaBarValue, setFormulaBarValue] = useState('');
  const [zoom, setZoom] = useState(100);
  const [showGridlines, setShowGridlines] = useState(true);
  const [showHeaders, setShowHeaders] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [clipboard, setClipboard] = useState<{cells: {[key: string]: Cell}}>({ cells: {} });
  
  const gridRef = useRef<HTMLDivElement>(null);

  const handleNewSheet = () => {
    const newSheet: Sheet = {
      id: `sheet-${Date.now()}`,
      name: `Sheet${sheets.length + 1}`,
      cells: {},
      columnWidths: {},
      rowHeights: {}
    };
    setSheets([...sheets, newSheet]);
    setSelectedSheet(newSheet.id);
  };

  const handleCellChange = (cellId: string, value: string, isFormula = false) => {
    if (!selectedSheet) return;

    setSheets(sheets.map(sheet => {
      if (sheet.id !== selectedSheet) return sheet;

      const updatedCells = { ...sheet.cells };
      if (isFormula) {
        updatedCells[cellId] = {
          ...updatedCells[cellId],
          value: evaluateFormula(value),
          formula: value
        };
      } else {
        updatedCells[cellId] = {
          ...updatedCells[cellId],
          value,
          formula: undefined
        };
      }

      return { ...sheet, cells: updatedCells };
    }));
  };

  const evaluateFormula = (formula: string): string => {
    if (!formula.startsWith('=')) return formula;

    try {
      const withoutEquals = formula.substring(1);
      return eval(withoutEquals).toString();
    } catch {
      return '#ERROR!';
    }
  };

  return (
    <div className="flex h-full bg-[#1a1a1a]">
      <SpreadsheetSidebar
        sheets={sheets}
        selectedSheet={selectedSheet}
        onNewSheet={handleNewSheet}
        onSelectSheet={setSelectedSheet}
      />

      <div className="flex-1 flex flex-col">
        <SpreadsheetToolbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCopy={() => {/* Handle copy */}}
          onPaste={() => {/* Handle paste */}}
          onCut={() => {/* Handle cut */}}
        />

        <SpreadsheetFormulaBar
          value={formulaBarValue}
          onChange={(value) => {
            setFormulaBarValue(value);
            if (selectedCell) {
              handleCellChange(selectedCell, value, value.startsWith('='));
            }
          }}
        />

        <SpreadsheetGrid
          ref={gridRef}
          sheets={sheets}
          selectedSheet={selectedSheet}
          selectedCell={selectedCell}
          onSelectCell={setSelectedCell}
          onCellChange={handleCellChange}
          showGridlines={showGridlines}
          showHeaders={showHeaders}
          zoom={zoom}
        />

        <SpreadsheetStatusBar
          selectedCell={selectedCell}
          zoom={zoom}
          showGridlines={showGridlines}
          onZoomChange={setZoom}
          onShowGridlinesChange={setShowGridlines}
        />
      </div>
    </div>
  );
}