import React from 'react';
import { BarChart2, LineChart, PieChart } from 'lucide-react';

interface ChartViewerProps {
  data: any;
  type?: string;
}

export function ChartViewer({ data, type = 'bar' }: ChartViewerProps) {
  return (
    <div className="bg-[#242424] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        {type === 'bar' && <BarChart2 size={20} className="text-gray-400" />}
        {type === 'line' && <LineChart size={20} className="text-gray-400" />}
        {type === 'pie' && <PieChart size={20} className="text-gray-400" />}
        <span className="text-sm font-medium">Chart Preview</span>
      </div>
      <div className="aspect-video bg-[#1a1a1a] rounded flex items-center justify-center">
        <span className="text-gray-500">Chart visualization will be displayed here</span>
      </div>
    </div>
  );
}