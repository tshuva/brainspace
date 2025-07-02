import { useQuery } from "@tanstack/react-query";
import { PieChart, TrendingUp, BarChart3, Radar, Grid3X3 } from "lucide-react";
import { useState, useMemo } from "react";
import DataSummary from "./DataSummary";
import type { FilterConfig } from "./TimeFilter";
import { Bar, Heatmap, Line, LineOverLastMsgs, Pie, RadarChart, type Messages } from "./Charts";
import TimeFilter from "./TimeFilter";

const filterFunctions = {
  default: (arr, _) => arr,
  messages: (arr, n) => arr.slice(-n),
  seconds: (arr, t) => arr.slice(-t * 60),
};

const chartOptions = {
  'pie': { name: 'Pie Chart', icon: PieChart, description: 'Value frequency distribution', chart: (msg) => <Pie data={msg} /> },
  'line': { name: 'Line Column Chart', icon: TrendingUp, description: 'Row trends over column\nbast with low no of msgs', chart: (msg) => <Line data={msg} /> },
  'line-colum': { name: 'Line Mesages Chart', icon: TrendingUp, description: 'Row trends over mesages', chart: (msg) => <LineOverLastMsgs data={msg} /> },
  'bar': { name: 'Bar Chart', icon: BarChart3, description: 'Column totals', chart: (msg) => <Bar data={msg} /> },
  'radar': { name: 'Radar Chart', icon: Radar, description: 'Row averages comparison', chart: (msg) => <RadarChart data={msg} /> },
  'heatmap': { name: 'Heatmap', icon: Grid3X3, description: 'Value intensity map', chart: (msg) => <Heatmap data={msg} /> },
} as const;

type ChartId = keyof typeof chartOptions;
type ChartOpt = typeof chartOptions[ChartId]

const filterDate = (filter) => filter.type === 'dateRange'

const MainWindow = () => {
  const [activeChart, setActiveChart] = useState<ChartId>('pie');
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({ type: "messages", value: 10 } as FilterConfig);

  const {
    data: filteredData = [],
    error,
    isLoading: isFilteredDataLoading,
    isFetching: isFilteredDataFetching
  } = useQuery({
    queryKey: ['filteredMessages', filterConfig?.dateRange?.from, filterConfig?.dateRange?.to],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:8000/messages?from=${filterConfig.dateRange.from}&to=${filterConfig.dateRange.to}`
      ).then(r => r.json());
      return res.map(x => JSON.parse(x.value)) as Messages; // using effect.ts?
    },
    enabled: filterDate(filterConfig) && !!filterConfig.dateRange.from && !!filterConfig.dateRange.to,
    staleTime: Infinity,
  });

  const { data: liveMessages = [] } = useQuery<Messages>({ queryKey: ['messages'], queryFn: () => [], staleTime: Infinity, initialData: [] as number[][], });

  const messages = useMemo(() =>
    (filterDate(filterConfig)) ? filteredData : filterFunctions[filterConfig.type](liveMessages, filterConfig.value)
    , [filteredData, liveMessages]);

  console.log(liveMessages);

  if (isFilteredDataLoading || isFilteredDataFetching) return <div>Loading...</div>;
  if (error instanceof Error) return <div>An error has occurred: {error.message}</div>;


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="w-full flex-1 mx-auto flex flex-col">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Data Visualization Dashboard
          </h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Time Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
            <TimeFilter setConfig={setFilterConfig} config={filterConfig} />
          </div>
        </div>

        {/* Chart Selection Buttons */}
        <div className="flex justify-center gap-4 mb-4">
          {Object.entries(chartOptions).map(([id, option]: [ChartId, ChartOpt]) => {
            const Icon = option.icon;
            const isActive = activeChart === id;

            return (
              <button
                key={id}
                onClick={() => setActiveChart(id)}
                className={`
                group relative overflow-hidden rounded-xl p-7 min-w-[400px] 
                transition-all duration-300 transform hover:scale-105 hover:shadow-xl
                ${isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 shadow-md hover:shadow-lg border border-slate-200'
                  }
              `}
              >
                {/* Background decoration for active state */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-90"></div>
                )}

                <div className="relative z-10 flex items-center space-x-4">
                  <div className={`
                  p-3 rounded-lg transition-colors duration-300
                  ${isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600'
                    }
                `}>
                    <Icon size={24} />
                  </div>
                  <div className="text-left">
                    <div className={`font-semibold text-lg ${isActive ? 'text-white' : 'text-slate-800'}`}>
                      {option.name}
                    </div>
                    <div className={`text-sm ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                      {option.description}
                    </div>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            );
          })}
        </div>

        {/* Chart Display */}
        <div className="mb-8 flex-1 min-h-0">
          <div className="w-full h-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                {(() => {
                  const Icon = chartOptions[activeChart].icon;
                  return <Icon size={24} className="mr-3 text-blue-500" />;
                })()}
                {chartOptions[activeChart].name}
              </h2>
            </div>

            <div className="flex-1 min-h-6 p-4">
              <div className="flex-1 min-h-[700px] max-h-[80vh] p-4">
                {chartOptions[activeChart].chart(messages)}
              </div>
            </div>
          </div>
        </div>



        {/* Data Summary */}
        <div className="flex justify-center">
          <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

            <div className="p-6">
              <DataSummary data={messages} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainWindow;