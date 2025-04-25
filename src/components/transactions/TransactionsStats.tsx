import React from 'react';
import { Expense } from '@/lib/models/Expense';
import { US_DOLLAR } from '@/pages/api/Constants';

const TransactionStats: React.FC<{ transactions: Expense[] }> = ({
  transactions,
}): React.ReactElement => {
  const getStats = () => {
    // get sum of expenses
    const totalExpenses: number = transactions.reduce(
      (total: number, transaction: Expense): number => {
        return total + transaction.amount;
      },
      0
    );

    // get largest expense to display
    const largestExpense: number = Math.max(
      ...transactions.map((transaction: Expense): number => transaction.amount)
    );

    // get expense category totals to find largest category
    const categories: Record<string, number> = transactions.reduce(
      (acc: Record<string, number>, transaction: Expense): Record<string, number> => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      },
      {}
    );

    // get largest expense category
    const largestExpenseCategory: [string, number] = Object.entries(categories).reduce(
      (max: [string, number], current: [string, number]): [string, number] =>
        current[1] > max[1] ? current : max,
      ['', 0] as [string, number]
    );

    // get largest expense category name and percentage
    const largestExpenseCategoryName: string = largestExpenseCategory[0];
    const largestExpenseCategoryPercentage: number =
      (largestExpenseCategory[1] / totalExpenses) * 100;

    return [
      {
        name: 'Total Expenses',
        stat: US_DOLLAR.format(totalExpenses),
      },
      {
        name: 'Largest Expense',
        stat: US_DOLLAR.format(largestExpense),
      },
      {
        name: `Largest Category`,
        stat: `${largestExpenseCategoryName}`,
      },
    ];
  };

  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {getStats().map(
          (item: any): React.ReactElement => (
            <div
              key={item.name}
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {item.stat}
              </dd>
            </div>
          )
        )}
      </dl>
    </div>
  );
};

export default TransactionStats;
