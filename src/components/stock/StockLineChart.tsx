import { ChartPieIcon } from '@heroicons/react/24/outline';
import { Serie } from '@nivo/line';
import React from 'react';

import LoadingSpinner from '@/components/loading/LoadingSpinner';
import { Price } from '@/lib/models/Price';

import LineChart from '../charts/LineChart';

const StockLineChart: React.FC<{ prices: Price[]; loading: boolean }> = ({
  prices,
  loading,
}): React.ReactElement => {
  const generateData: () => Serie[] = (): Serie[] => {
    if (!prices || prices.length === 0) return [];
    return [
      {
        id: 'Stock Price',
        color: 'hsl(343, 70%, 50%)',
        data: prices.map((price: Price) => ({
          x: price.timestamp,
          y: price.price,
        })),
      },
    ];
  };

  const renderLoadingState: () => React.ReactElement = (): React.ReactElement => {
    return (
      <div className="h-96 bg-white rounded-2xl p-6 shadow-md flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  };

  const renderEmptyState: () => React.ReactElement = (): React.ReactElement => {
    return (
      <div className="h-96 bg-white rounded-2xl p-6 shadow-md flex items-center justify-center text-gray-500">
        <div className="flex flex-col items-center">
          <ChartPieIcon className="h-12 w-12 mb-4" />
          <div className="text-gray-500 text-center">No data available</div>
        </div>
      </div>
    );
  };

  const renderLineChart: () => React.ReactElement = (): React.ReactElement => {
    return (
      <div className="h-96 bg-white rounded-2xl p-6 shadow-md">
        <LineChart data={data} />
      </div>
    );
  };

  if (loading) return renderLoadingState();

  const data: Serie[] = generateData();
  if (data.length === 0) return renderEmptyState();

  return renderLineChart();
};

export default StockLineChart;
