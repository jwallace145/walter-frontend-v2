'use client';

import React from 'react';

import { Expense } from '@/lib/models/Expense';

import PieChart from '../charts/PieChart';
import LoadingSpinner from '../loading/LoadingSpinner';

const TransactionsCategoryPieChart: React.FC<{
  loading: boolean;
  transactions: Expense[];
  setCategory: (category: string) => void;
}> = ({ loading, transactions, setCategory }): React.ReactElement => {
  const getTransactionCategories = () => {
    if (loading) {
      return [];
    }

    return Object.values(
      transactions.reduce((categories, transaction) => {
        if (!categories[transaction.category]) {
          categories[transaction.category] = {
            id: transaction.category,
            label: transaction.category,
            value: transaction.amount,
          };
        }
        categories[transaction.category].value += transaction.amount;
        return categories;
      }, {})
    );
  };

  return (
    <div className="h-96 bg-white rounded-2xl p-6 shadow-md">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <PieChart data={getTransactionCategories()} onClick={setCategory} />
      )}
    </div>
  );
};

export default TransactionsCategoryPieChart;
