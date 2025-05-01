import { PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { Serie } from '@nivo/line';
import React from 'react';

import LineChart from '@/components/charts/LineChart';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import { Transaction } from '@/lib/models/Transaction';

const TransactionsCashFlowLineChart: React.FC<{
  loading: boolean;
  transactions: Transaction[];
}> = ({ loading, transactions }): React.ReactElement => {
  const generateData: () => Serie[] = (): Serie[] => {
    if (loading || !transactions || transactions.length === 0) return [];

    const transactionsDailySums: { [key: string]: number } = transactions.reduce(
      (acc: { [key: string]: number }, transaction: Transaction): { [key: string]: number } => {
        const transactionDate: string = transaction.date;
        acc[transactionDate] = (acc[transactionDate] || 0) + transaction.amount;
        return acc;
      },
      {}
    );

    let runningSum: number = 0;
    const cashFlowData: { x: string; y: number }[] = Object.entries(transactionsDailySums)
      .sort(
        ([dateA]: [string, number], [dateB]: [string, number]): number =>
          new Date(dateA).getTime() - new Date(dateB).getTime()
      )
      .map(([date, amount]: [string, number]): { x: string; y: number } => {
        runningSum += amount;
        return {
          x: new Date(date).toISOString().split('.')[0],
          y: runningSum,
        };
      });

    const dates = cashFlowData.map((point) => point.x);
    const baselineData = dates.map((date) => ({
      x: date,
      y: 0,
    }));

    return [
      {
        id: 'Cash Flow',
        color: 'hsl(343, 70%, 50%)',
        data: cashFlowData,
      },
      {
        id: 'Baseline',
        color: 'hsl(0, 0%, 70%)',
        data: baselineData,
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
          <PresentationChartLineIcon className="h-12 w-12 mb-4" />
          <div className="text-gray-500 text-center">No data available</div>
        </div>
      </div>
    );
  };

  const renderLineChart: (data: Serie[]) => React.ReactElement = (
    data: Serie[]
  ): React.ReactElement => {
    return (
      <div className="h-96 bg-white rounded-2xl p-6 shadow-md">
        <LineChart data={data} />
      </div>
    );
  };

  if (loading) return renderLoadingState();

  if (!transactions || transactions.length === 0) return renderEmptyState();

  const data: Serie[] = generateData();
  return renderLineChart(data);
};

export default TransactionsCashFlowLineChart;
