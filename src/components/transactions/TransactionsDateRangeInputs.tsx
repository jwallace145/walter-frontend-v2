import React from 'react';

const TransactionsDateRangeInputs: React.FC<{
  startDate: string;
  endDate: string;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
}> = ({ startDate, endDate, setStartDate, setEndDate }): React.ReactElement => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 w-full sm:w-auto">
      <div className="flex w-full sm:w-auto items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e): void => setStartDate(e.target.value)}
          className="flex-1 min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <span className="text-sm text-gray-500 hidden sm:inline">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e): void => setEndDate(e.target.value)}
          className="flex-1 min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      {/* Optional label for smaller screens */}
      <span className="text-sm text-gray-500 sm:hidden mt-1">Select start and end dates</span>
    </div>
  );
};

export default TransactionsDateRangeInputs;
