import { PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { BarDatum } from '@nivo/bar';
import React from 'react';

import BarChart from '@/components/charts/BarChart';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import { Transaction } from '@/lib/models/Transaction';

const TransactionsIncomeBarChart: React.FC<{ loading: boolean; transactions: Transaction[] }> = ({
  loading,
  transactions,
}): React.ReactElement => {
  const generateData: () => BarDatum[] = (): BarDatum[] => {
    if (loading || !transactions || transactions.length === 0) return [];
    const transactionsWeeklySums: { [key: string]: number } = transactions
      .filter((transaction: Transaction): boolean => transaction.amount > 0)
      .reduce(
        (acc: { [key: string]: number }, transaction: Transaction): { [key: string]: number } => {
          const date = new Date(transaction.date);
          const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
          const weekKey = startOfWeek.toISOString().split('T')[0];
          acc[weekKey] = (acc[weekKey] || 0) + transaction.amount;
          return acc;
        },
        {}
      );
    return Object.entries(transactionsWeeklySums)
      .sort(
        ([weekA]: [string, number], [weekB]: [string, number]): number =>
          new Date(weekA).getTime() - new Date(weekB).getTime()
      )
      .map(
        ([week, amount]: [string, number]): BarDatum => ({
          id: week,
          value: amount,
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
          <PresentationChartLineIcon className="h-12 w-12 mb-4" />
          <div className="text-gray-500 text-center">No data available</div>
        </div>
      </div>
    );
  };

  const renderBarChart: (data: BarDatum[]) => React.ReactElement = (
    data: BarDatum[]
  ): React.ReactElement => {
    return (
      <div className="h-96 bg-white rounded-2xl p-6 shadow-md">
        <BarChart data={data} />
      </div>
    );
  };

  if (loading) return renderLoadingState();

  if (!transactions || transactions.length === 0) return renderEmptyState();

  const data: BarDatum[] = generateData();
  return renderBarChart(data);
};

export default TransactionsIncomeBarChart;
