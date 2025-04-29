'use client';

import { ChartPieIcon } from '@heroicons/react/24/outline';
import React from 'react';

import { Transaction } from '@/lib/models/Transaction';

import PieChart, { PieSlice } from '../charts/PieChart';
import LoadingSpinner from '../loading/LoadingSpinner';

const TransactionsCategoryPieChart: React.FC<{
  loading: boolean;
  transactions: Transaction[];
  setCategory: (category: string) => void;
}> = ({ loading, transactions, setCategory }): React.ReactElement => {
  const getTransactionCategories: () => PieSlice[] = (): PieSlice[] => {
    if (loading) return [];
    const categories: Record<string, PieSlice> = {};
    return Object.values(
      transactions.reduce<Record<string, PieSlice>>(
        (
          categories: Record<string, PieSlice>,
          transaction: Transaction
        ): Record<string, PieSlice> => {
          if (!categories[transaction.category]) {
            categories[transaction.category] = {
              id: transaction.category,
              label: transaction.category,
              value: 0,
            };
          }
          categories[transaction.category].value += transaction.amount;
          return categories;
        },
        {}
      )
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
          <p>No data available</p>
        </div>
      </div>
    );
  };

  const renderPieChart: () => React.ReactElement = (): React.ReactElement => {
    return (
      <div className="h-96 bg-white rounded-2xl p-6 shadow-md">
        <PieChart data={transactionCategories} onClick={setCategory} />
      </div>
    );
  };

  if (loading) return renderLoadingState();
  const transactionCategories: PieSlice[] = getTransactionCategories();
  if (transactionCategories.length === 0) return renderEmptyState();

  return renderPieChart();
};

export default TransactionsCategoryPieChart;
