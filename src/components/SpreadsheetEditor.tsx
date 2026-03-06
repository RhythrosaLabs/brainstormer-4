import React, { useState, useCallback } from 'react';
import { SpreadsheetGrid } from './SpreadsheetEditor/SpreadsheetGrid';
import { SpreadsheetSidebar } from './SpreadsheetEditor/SpreadsheetSidebar';
import { SpreadsheetToolbar } from './SpreadsheetEditor/SpreadsheetToolbar';
import { SpreadsheetFormulaBar } from './SpreadsheetEditor/SpreadsheetFormulaBar';
import { SpreadsheetStatusBar } from './SpreadsheetEditor/SpreadsheetStatusBar';
import { Sheet, SpreadsheetState } from './SpreadsheetEditor/types';

export function SpreadsheetEditor() {
  const [state, setState] = useState<SpreadsheetState>({
    sheets: [],
    selectedSheet: null,
    selectedCell: null,
    copiedCells: null,
    undoStack: [],
    redoStack: [],
    zoom: 100,
    showGridlines: true,
    showHeaders: true
  });

  const handleNewSheet = useCallback(() => {
    const newSheet: Sheet = {
      id: `sheet-${Date.now()}`,
      name: `Sheet ${state.sheets.length + 1}`,
      cells: {},
      columnWidths: {},
      rowHeights: {},
      mergedCells: {}
    };
    setState(prev => ({
      ...prev,
      sheets: [...prev.sheets, newSheet],
      selectedSheet: newSheet.id
    }));
  }, [state.sheets.length]);

  const handleCellChange = useCallback((cellId: string, value: string, isFormula = false) => {
    setState(prev => {
      const sheet = prev.sheets.find(s => s.id === prev.selectedSheet);
      if (!sheet) return prev;

      // Save current state for undo
      const newUndoStack = [...prev.undoStack, prev.sheets];

      // Update cell
      const updatedSheet = {
        ...sheet,
        cells: {
          ...sheet.cells,
          [cellId]: {
            value,
            ...(isFormula ? { formula: value } : {})
          }
        }
      };

      return {
        ...prev,
        sheets: prev.sheets.map(s =>
          s.id === prev.selectedSheet ? updatedSheet : s
        ),
        undoStack: newUndoStack,
        redoStack: []
      };
    });
  }, []);

  const handleUndo = useCallback(() => {
    setState(prev => {
      if (prev.undoStack.length === 0) return prev;

      const newUndoStack = [...prev.undoStack];
      const previousSheets = newUndoStack.pop()!;

      return {
        ...prev,
        sheets: previousSheets,
        undoStack: newUndoStack,
        redoStack: [...prev.redoStack, prev.sheets]
      };
    });
  }, []);

  const handleRedo = useCallback(() => {
    setState(prev => {
      if (prev.redoStack.length === 0) return prev;

      const newRedoStack = [...prev.redoStack];
      const nextSheets = newRedoStack.pop()!;

      return {
        ...prev,
        sheets: nextSheets,
        undoStack: [...prev.undoStack, prev.sheets],
        redoStack: newRedoStack
      };
    });
  }, []);

  return (
    <div className="flex h-full bg-[#1a1a1a]">
      <SpreadsheetSidebar
        sheets={state.sheets}
        selectedSheet={state.selectedSheet}
        onNewSheet={handleNewSheet}
        onSelectSheet={(sheetId) => setState(prev => ({ ...prev, selectedSheet: sheetId }))}
      />

      <div className="flex-1 flex flex-col">
        <SpreadsheetToolbar
          onFormatClick={(format) => {
            // Handle format changes
          }}
          onCopy={() => {
            // Handle copy
          }}
          onCut={() => {
            // Handle cut
          }}
          onPaste={() => {
            // Handle paste
          }}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={state.undoStack.length > 0}
          canRedo={state.redoStack.length > 0}
          activeFormats={new Set()}
        />

        <SpreadsheetFormulaBar
          value={state.selectedCell ? state.sheets.find(s => s.id === state.selectedSheet)?.cells[state.selectedCell]?.value || '' : ''}
          onChange={(value) => {
            if (state.selectedCell) {
              handleCellChange(state.selectedCell, value, value.startsWith('='));
            }
          }}
        />

        <SpreadsheetGrid
          sheets={state.sheets}
          selectedSheet={state.selectedSheet}
          selectedCell={state.selectedCell}
          onSelectCell={(cellId) => setState(prev => ({ ...prev, selectedCell: cellId }))}
          onCellChange={handleCellChange}
          showGridlines={state.showGridlines}
          showHeaders={state.showHeaders}
          zoom={state.zoom}
        />

        <SpreadsheetStatusBar
          selectedCell={state.selectedCell}
          zoom={state.zoom}
          showGridlines={state.showGridlines}
          onZoomChange={(zoom) => setState(prev => ({ ...prev, zoom }))}
          onShowGridlinesChange={(show) => setState(prev => ({ ...prev, showGridlines: show }))}
        />
      </div>
    </div>
  );
}