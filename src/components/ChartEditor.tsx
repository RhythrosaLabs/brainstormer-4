import React, { useState } from 'react';
import { BarChart2, LineChart, PieChart, Plus, Settings } from 'lucide-react';

interface Chart {
  id: string;
  name: string;
  type: 'bar' | 'line' | 'pie';
  data: any; // This would be replaced with actual chart data structure
}

export function ChartEditor() {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  const handleNewChart = (type: 'bar' | 'line' | 'pie') => {
    const newChart: Chart = {
      id: `chart-${Date.now()}`,
      name: 'Untitled Chart',
      type,
      data: {}
    };
    setCharts([...charts, newChart]);
    setSelectedChart(newChart.id);
  };

  return (
    <div className="flex h-full bg-[#1a1a1a]">
      {/* Left Sidebar - Chart List */}
      <div className="w-64 border-r border-[#333] bg-[#242424]">
        <div className="p-4 border-b border-[#333]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Charts</h3>
            <div className="flex gap-1">
              <button
                onClick={() => handleNewChart('bar')}
                className="p-1.5 hover:bg-[#333] rounded"
                title="New Bar Chart"
              >
                <BarChart2 size={16} />
              </button>
              <button
                onClick={() => handleNewChart('line')}
                className="p-1.5 hover:bg-[#333] rounded"
                title="New Line Chart"
              >
                <LineChart size={16} />
              </button>
              <button
                onClick={() => handleNewChart('pie')}
                className="p-1.5 hover:bg-[#333] rounded"
                title="New Pie Chart"
              >
                <PieChart size={16} />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {charts.map(chart => (
              <button
                key={chart.id}
                onClick={() => setSelectedChart(chart.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded ${
                  selectedChart === chart.id
                    ? 'bg-[#333] text-white'
                    : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                {chart.type === 'bar' && <BarChart2 size={16} />}
                {chart.type === 'line' && <LineChart size={16} />}
                {chart.type === 'pie' && <PieChart size={16} />}
                <span className="truncate">{chart.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 border-b border-[#333] flex items-center px-4 gap-2">
          <button
            className="p-1.5 hover:bg-[#333] rounded"
            title="Chart Settings"
          >
            <Settings size={16} />
          </button>
        </div>

        {/* Chart Display Area */}
        <div className="flex-1 p-4">
          {selectedChart ? (
            <div className="h-full flex flex-col gap-4">
              <input
                type="text"
                value={charts.find(chart => chart.id === selectedChart)?.name || ''}
                onChange={(e) => {
                  setCharts(charts.map(chart =>
                    chart.id === selectedChart
                      ? { ...chart, name: e.target.value }
                      : chart
                  ));
                }}
                className="bg-[#333] text-lg rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                placeholder="Chart Title"
              />
              <div className="flex-1 bg-[#242424] rounded flex items-center justify-center">
                <p className="text-gray-500">Chart visualization will be displayed here</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
              <BarChart2 size={48} />
              <p>No chart selected</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleNewChart('bar')}
                  className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded flex items-center gap-2"
                >
                  <BarChart2 size={16} />
                  Bar Chart
                </button>
                <button
                  onClick={() => handleNewChart('line')}
                  className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded flex items-center gap-2"
                >
                  <LineChart size={16} />
                  Line Chart
                </button>
                <button
                  onClick={() => handleNewChart('pie')}
                  className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded flex items-center gap-2"
                >
                  <PieChart size={16} />
                  Pie Chart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}