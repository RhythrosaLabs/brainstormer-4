import React from 'react';
import { Calculator } from 'lucide-react';

interface SpreadsheetFormulaBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SpreadsheetFormulaBar({ value, onChange }: SpreadsheetFormulaBarProps) {
  return (
    <div className="h-8 border-b border-[#333] flex items-center px-2 gap-2 bg-[#242424]">
      <Calculator size={14} className="text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-[#333] text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
        placeholder="Enter a value or formula (start with =)"
      />
    </div>
  );
}