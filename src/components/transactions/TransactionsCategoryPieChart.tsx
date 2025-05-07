'use client';

import { ChartPieIcon } from '@heroicons/react/24/outline';
import React from 'react';

import { AccountTransaction } from '@/lib/models/AccountTransaction';

import PieChart, { PieSlice } from '../charts/PieChart';
import LoadingSpinner from '../loading/LoadingSpinner';

const TransactionsCategoryPieChart: React.FC<{
  loading: boolean;
  transactions: AccountTransaction[];
  setCategory: (category: string) => void;
}> = ({ loading, transactions, setCategory }): React.ReactElement => {
  const getTransactionCategories: () => PieSlice[] = (): PieSlice[] => {
    if (loading) return [];
    const categories: Record<string, PieSlice> = {};
    return Object.values(
      transactions.reduce<Record<string, PieSlice>>(
        (
          categories: Record<string, PieSlice>,
          transaction: AccountTransaction
        ): Record<string, PieSlice> => {
          if (!categories[transaction.transaction_category]) {
            categories[transaction.transaction_category] = {
              id: transaction.transaction_category,
              label: transaction.transaction_category,
              value: 0,
            };
          }
          categories[transaction.transaction_category].value += transaction.transaction_amount;
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
          <p>No transactions found</p>
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
