'use client';

import { ChartPieIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

import { PieSlice } from '@/components/charts/PieChart';
import { PortfolioStock } from '@/lib/models/PortfolioStock';

import LoadingSpinner from '../loading/LoadingSpinner';

const PieChart = dynamic(() => import('../charts/PieChart'), { ssr: false });

const PortfolioEquityPieChart: React.FC<{ loading: boolean; stocks: PortfolioStock[] }> = ({
  loading,
  stocks,
}): React.ReactElement => {
  const [equityPieSlices, setEquityPieSlices] = useState<PieSlice[]>([]);

  useEffect((): void => {
    console.log('Setting equity pie slices...');
    console.log(equityPieSlices);
    const pieSlices: PieSlice[] = computePieData();
    console.log(pieSlices);
    setEquityPieSlices(pieSlices);
    console.log(equityPieSlices);
  }, [loading, stocks]);

  const computePieData: () => PieSlice[] = (): PieSlice[] => {
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
  };

  if (loading) {
    return (
      <div className="h-96 bg-white rounded-2xl p-6 shadow-md flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (equityPieSlices.length === 0) {
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
    <div className="bg-white rounded-2xl p-6 shadow-md" style={{ height: '384px' }}>
      <h1>Hello!</h1>
      <PieChart data={equityPieSlices} onClick={(): void => {}} />
    </div>
  );
};

export default PortfolioEquityPieChart;
