import React, { useEffect, useState } from 'react';

import { US_DOLLAR } from '@/lib/constants/Constants';
import { Transaction } from '@/lib/models/Transaction';

const TransactionStats: React.FC<{ transactions: Transaction[] }> = ({
  transactions,
}): React.ReactElement => {
  const [cashFlow, setCashFlow] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

  useEffect((): void => {
    setCashFlow(getCashFlow());
    setTotalIncome(getTotalIncome());
    setTotalExpenses(getTotalExpenses());
  }, [transactions]);

  const getCashFlow: () => number = (): number => {
    return transactions.reduce((total: number, transaction: Transaction): number => {
      return total + transaction.amount;
    }, 0);
  };

  const getTotalIncome: () => number = (): number => {
    return transactions
      .filter((transaction: Transaction): boolean => transaction.amount > 0)
      .reduce((total: number, transaction: Transaction): number => {
        return total + transaction.amount;
      }, 0);
  };

  const getTotalExpenses: () => number = (): number => {
    return transactions
      .filter((transaction: Transaction): boolean => transaction.amount < 0)
      .reduce((total: number, transaction: Transaction): number => {
        return total + transaction.amount;
      }, 0);
  };

  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Cash Flow */}
        <div
          key="Cash Flow"
          className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6"
        >
          <dt className="truncate text-sm font-medium text-gray-500">Cash Flow</dt>
          <dd
            className={`mt-1 text-3xl font-semibold tracking-tight ${
              cashFlow < 0 ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {US_DOLLAR.format(cashFlow > 0 ? cashFlow : -1 * cashFlow)}
          </dd>
        </div>

        {/* Total Income */}
        <div
          key="Total Income"
          className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6"
        >
          <dt className="truncate text-sm font-medium text-gray-500">Total Income</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight">
            {US_DOLLAR.format(totalIncome)}
          </dd>
        </div>

        {/* Total Expenses */}
        <div
          key="Total Expenses"
          className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6"
        >
          <dt className="truncate text-sm font-medium text-gray-500">Total Expenses</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight">
            {US_DOLLAR.format(-1 * totalExpenses)}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default TransactionStats;
