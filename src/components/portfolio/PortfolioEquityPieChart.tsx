'use client';

import React from 'react';
import PieChart from '../charts/PieChart';
import { PortfolioStock } from '@/lib/PortfolioStock';
import LoadingSpinner from '../loading/LoadingSpinner';

const PortfolioEquityPieChart: React.FC<{ loading: boolean; stocks: PortfolioStock[] }> = ({
  loading,
  stocks,
}): React.ReactElement => {
  const getPortfolioStockEquities = () => {
    if (loading) {
      return [];
    }

    return stocks.map((stock: PortfolioStock) => ({
      id: stock.symbol,
      label: stock.company,
      value: stock.equity,
    }));
  };

  return (
    <div className="h-96 bg-white rounded-2xl p-6 shadow-md">
      {loading ? <LoadingSpinner /> : <PieChart data={getPortfolioStockEquities()} />}
    </div>
  );
};

export default PortfolioEquityPieChart;
