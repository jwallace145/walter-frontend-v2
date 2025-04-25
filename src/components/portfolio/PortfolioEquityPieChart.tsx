'use client';

import React from 'react';

import { PortfolioStock } from '@/lib/models/PortfolioStock';

import PieChart, { PieSlice } from '../charts/PieChart';
import LoadingSpinner from '../loading/LoadingSpinner';

const PortfolioEquityPieChart: React.FC<{ loading: boolean; stocks: PortfolioStock[] }> = ({
  loading,
  stocks,
}): React.ReactElement => {
  const getPortfolioStockEquities = (): PieSlice[] => {
    if (loading) {
      return [];
    }

    return stocks.map(
      (stock: PortfolioStock): PieSlice => ({
        id: stock.symbol,
        label: stock.company,
        value: stock.equity,
      })
    );
  };

  return (
    <div className="h-96 bg-white rounded-2xl p-6 shadow-md">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <PieChart data={getPortfolioStockEquities()} onClick={(): void => console.log('clicked')} />
      )}
    </div>
  );
};

export default PortfolioEquityPieChart;
