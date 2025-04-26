import { Serie } from '@nivo/line';
import React from 'react';

import LoadingSpinner from '@/components/loading/LoadingSpinner';
import { Price } from '@/lib/models/Price';

import LineChart from '../charts/LineChart';

const StockLineChart: React.FC<{ prices: Price[]; loading: boolean }> = ({
  prices,
  loading,
}): React.ReactElement => {
  const getStockPrices = (): Serie[] => {
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

  const hasData = prices.length > 0;

  return (
    <div className="h-96 bg-white rounded-2xl p-6 shadow-md flex items-center justify-center">
      {loading ? (
        <LoadingSpinner />
      ) : !hasData ? (
        <div className="text-gray-500 text-center">No data available</div>
      ) : (
        <LineChart data={getStockPrices()} />
      )}
    </div>
  );
};

export default StockLineChart;
