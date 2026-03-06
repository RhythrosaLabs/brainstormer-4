export interface Cell {
  value: string;
  formula?: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    align?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    textColor?: string;
    fontSize?: number;
    fontFamily?: string;
  };
}

export interface Sheet {
  id: string;
  name: string;
  cells: { [key: string]: Cell };
  columnWidths: { [key: string]: number };
  rowHeights: { [key: string]: number };
  mergedCells: { [key: string]: string[] };
  frozenRows?: number;
  frozenColumns?: number;
}

export interface SpreadsheetState {
  sheets: Sheet[];
  selectedSheet: string | null;
  selectedCell: string | null;
  copiedCells: { [key: string]: Cell } | null;
  undoStack: Sheet[][];
  redoStack: Sheet[][];
  zoom: number;
  showGridlines: boolean;
  showHeaders: boolean;
}