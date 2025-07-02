import { Database } from "lucide-react";

const DataSummary = ({ data }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 ">
    <div className=" bg-gradient-to-r flex items-center gap-3 mb-4 rounded-lg">
      <Database className="w-5 h-5 text-blue-600" />
      <div>
        <h3 className="text-lg font-bold text-gray-800">Data Summary</h3>
        <p className="text-sm text-gray-500">Latest dataset information</p>
      </div>
    </div>
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        Most Recent Entry
      </h4>
      <div className="flex flex-wrap gap-2">
        {(data[data.length - 1] || []).map((val, idx) => (
          <span
            key={idx}
            className="inline-flex items-center px-3 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            {val}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default DataSummary;