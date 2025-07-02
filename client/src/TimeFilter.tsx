import { useQueryClient } from "@tanstack/react-query";
import { Filter, Database, Clock, Calendar } from "lucide-react";
import { useState } from "react";
import type { Messages } from "./Charts";
type FilterType = 'default' | 'messages' | 'seconds' | 'dateRange'

export type FilterConfig = {
  type: FilterType;
  value: number;
  dateRange?: { from?: string; to?: string };
};

type TimeFilterProps = {
  setConfig: (config: FilterConfig) => void;
  config: FilterConfig
};

const TimeFilter = ({ setConfig, config }: TimeFilterProps) => {
  const queryClient = useQueryClient();

  const [filterType, setFilterType] = useState<FilterType>('messages');
  const [filterValue, setFilterValue] = useState(10);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const handleFilterChange = () => {
    setConfig({
      type: filterType,
      value: filterValue,
      dateRange: dateRange,
    });
  };

  const handleReset = () => {
    setFilterType('messages');
    setFilterValue(10);
    setConfig({ type: "messages", value: 10 })
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="text-blue-600" size={20} />
        <h2 className="text-lg font-semibold text-gray-800">Time Filter</h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">

        <button
          onClick={() => setFilterType('messages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${filterType === 'messages'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          <Clock size={16} />
          By Last Messages
        </button>
        <button
          onClick={() => setFilterType('seconds')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${filterType === 'seconds'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          <Clock size={16} />
          By Last Seconds
        </button>
        <button
          onClick={() => setFilterType('default')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${filterType === 'default'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          <Database size={16} />
          All Data
        </button>
        <button
          onClick={() => setFilterType('dateRange')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${filterType === 'dateRange'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          <Calendar size={16} />
          Date Range
        </button>
      </div>

      {filterType !== 'default' && filterType !== 'dateRange' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {filterType === 'messages' ? 'Number of Messages' :
              filterType === 'seconds' ? 'seconds (×100 messages)' :
                'Minutes (×6000 messages)'}
          </label>
          <input
            type="number"
            value={filterValue}
            onChange={(e) => setFilterValue(parseInt(e.target.value) || 0)}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter value"
          />
          <div className="text-xs text-gray-500 mt-1">
            {filterType === 'messages' && `≈ ${filterValue} messages (${(filterValue / 100).toFixed(1)} seconds)`}
            {filterType === 'seconds' && `≈ ${filterValue * 600} messages (${filterValue} seconds)`}
          </div>
        </div>
      )}

      {filterType === 'dateRange' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="datetime-local"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="datetime-local"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleFilterChange}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Apply Filter
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
        >
          Reset Filter
        </button>
        <button
          onClick={() => queryClient.setQueryData<Messages>(['messages'], () => {
            console.log("clearing");
            return []
          })}
          className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-900 transition-colors"
        >
          Clear Messages
        </button>
      </div>
    </div>
  );
};
export default TimeFilter