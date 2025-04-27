'use client';

import { ChartPieIcon } from '@heroicons/react/24/outline';
import React from 'react';

import PieChart, { PieSlice } from '@/components/charts/PieChart';
import { PortfolioStock } from '@/lib/models/PortfolioStock';

import LoadingSpinner from '../loading/LoadingSpinner';

const PortfolioEquityPieChart: React.FC<{ loading: boolean; stocks: PortfolioStock[] }> = ({
  loading,
  stocks,
}): React.ReactElement => {
  const generateEquityPieSlices: () => PieSlice[] = (): PieSlice[] => {
    if (!stocks || stocks.length === 0) return [];
    return stocks.map(
      (stock: PortfolioStock): PieSlice => ({
        id: stock.symbol,
        label: stock.company,
        value: stock.equity,
      })
    );
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
          <p>No portfolio data available</p>
        </div>
      </div>
    );
  };

  const renderPieChart: () => React.ReactElement = (): React.ReactElement => {
    return (
      <div className="h-96 bg-white rounded-2xl p-6 shadow-md">
        <PieChart data={equityPieSlices} onClick={(): void => {}} />
      </div>
    );
  };

  if (loading) return renderLoadingState();

  const equityPieSlices: PieSlice[] = generateEquityPieSlices();
  if (equityPieSlices.length === 0) return renderEmptyState();

  return renderPieChart();
};

export default PortfolioEquityPieChart;
