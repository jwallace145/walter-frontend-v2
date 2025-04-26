'use client';

import { ChartPieIcon } from '@heroicons/react/24/outline'; // Icon import
import React, { useMemo } from 'react';

import { PortfolioStock } from '@/lib/models/PortfolioStock';

import PieChart, { PieSlice } from '../charts/PieChart';
import LoadingSpinner from '../loading/LoadingSpinner';

const PortfolioEquityPieChart: React.FC<{ loading: boolean; stocks: PortfolioStock[] }> = ({
  loading,
  stocks,
}): React.ReactElement => {
  const pieData: PieSlice[] = useMemo(() => {
    if (loading || !stocks || stocks.length === 0) {
      return [];
    }

    return stocks.map(
      (stock: PortfolioStock): PieSlice => ({
        id: stock.symbol,
        label: stock.company,
        value: stock.equity,
      })
    );
  }, [loading, stocks]);

  if (loading) {
    return (
      <div className="h-96 bg-white rounded-2xl p-6 shadow-md flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (pieData.length === 0) {
    return (
      <div className="h-96 bg-white rounded-2xl p-6 shadow-md flex items-center justify-center text-gray-500">
        <div className="flex flex-col items-center">
          <ChartPieIcon className="h-12 w-12 mb-4" />
          <p>No portfolio data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 bg-white rounded-2xl p-6 shadow-md">
      <PieChart data={pieData} onClick={(): void => console.log('clicked')} />
    </div>
  );
};

export default PortfolioEquityPieChart;
