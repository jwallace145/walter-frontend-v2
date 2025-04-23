'use client';

import React, { useEffect, useState } from 'react';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { getCookie } from 'typescript-cookie';
import { WALTER_API_TOKEN_NAME } from '@/pages/api/Constants';
import dayjs from 'dayjs';
import PaginatedTransactionsList from '@/components/transactions/PaginatedTransactionsList';
import { Expense } from '@/lib/Expense';
import dynamic from 'next/dynamic';
import TransactionStats from '@/components/transactions/TransactionsStats';
import { PlusSmallIcon } from '@heroicons/react/20/solid';
import AddTransactionForm from '@/components/transactions/AddTransactionForm';

const secondaryNavigation = [
  { name: 'This month', current: true },
  { name: 'Last month', current: false },
  { name: 'Year to date', current: false },
];

const TransactionsCategoryPieChart = dynamic(
  () => import('@/components/transactions/TransactionsCategoryPieChart'),
  {
    ssr: false,
  }
);

const START_OF_THE_MONTH: string = dayjs().startOf('month').format('YYYY-MM-DD');
const END_OF_THE_MONTH: string = dayjs().endOf('month').format('YYYY-MM-DD');
const START_OF_LAST_MONTH: string = dayjs()
  .subtract(1, 'month')
  .startOf('month')
  .format('YYYY-MM-DD');
const END_OF_LAST_MONTH: string = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
const START_OF_YEAR: string = dayjs().startOf('year').format('YYYY-MM-DD');

const TRANSACTION_DATE_RANGES = [
  {
    name: 'This month',
    startDate: START_OF_THE_MONTH,
    endDate: END_OF_THE_MONTH,
  },
  {
    name: 'Last month',
    startDate: START_OF_LAST_MONTH,
    endDate: END_OF_LAST_MONTH,
  },
  {
    name: 'Year to date',
    startDate: START_OF_YEAR,
    endDate: END_OF_THE_MONTH,
  },
];

export default function Transactions(): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentDateRange, setCurrentDateRange] = useState<string>('This month');
  const [startDate, setStartDate] = useState<string>(START_OF_THE_MONTH);
  const [endDate, setEndDate] = useState<string>(END_OF_THE_MONTH);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [openAddTransactionForm, setOpenAddTransactionForm] = useState<boolean>(false);

  useEffect((): void => {
    getTransactions(startDate, endDate);
  }, [startDate, endDate]);

  const getTransactions: (startDate: string, endDate: string) => void = (
    startDate: string,
    endDate: string
  ): void => {
    setLoading(true);
    fetch(`/api/transactions/get-transactions?start_date=${startDate}&end_date=${endDate}`, {
      headers: {
        Authorization: `Bearer ${getCookie(WALTER_API_TOKEN_NAME)}`,
      },
    })
      .then((response: Response) => response.json())
      .then((data): void => {
        setExpenses(data['Data']['expenses']);
      })
      .catch((error): void => console.error('Error:', error))
      .finally((): void => setLoading(false));
  };

  const handleChangeDateRange: (dateRange: string) => void = (dateRange: string): void => {
    const normalizedRange = dateRange.toLowerCase();
    if (normalizedRange === 'this month') {
      setCurrentDateRange(normalizedRange);
      setStartDate(START_OF_THE_MONTH);
      setEndDate(END_OF_THE_MONTH);
    } else if (normalizedRange === 'last month') {
      setCurrentDateRange(normalizedRange);
      setStartDate(START_OF_LAST_MONTH);
      setEndDate(END_OF_LAST_MONTH);
    } else if (normalizedRange === 'year to date') {
      setCurrentDateRange(normalizedRange);
      setStartDate(START_OF_YEAR);
      setEndDate(END_OF_THE_MONTH);
    }
  };

  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return (
      <>
        <main className="p-8">
          <h1 className="text-2xl font-bold mb-4">Your Transactions</h1>
          <header className="pt-6 pb-4 sm:pb-6">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
              <div className="order-last flex w-full gap-x-8 text-sm/6 font-semibold sm:order-none sm:w-auto sm:border-gray-200 sm:pl-6 sm:text-sm/7">
                {secondaryNavigation.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={(): void => handleChangeDateRange(item.name)}
                    className={
                      currentDateRange.toLowerCase() === item.name.toLowerCase()
                        ? 'text-indigo-600'
                        : 'text-gray-700'
                    }
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={(): void => setOpenAddTransactionForm(true)}
                className="ml-auto flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <PlusSmallIcon aria-hidden="true" className="-ml-1.5 size-5" />
                Add Transaction
              </button>
            </div>
          </header>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-1 flex flex-col gap-6">
              <TransactionStats transactions={expenses} />
              <TransactionsCategoryPieChart loading={loading} transactions={expenses} />
            </div>
            <div className="flex-1">
              <PaginatedTransactionsList transactions={expenses} transactionsPerPage={8} />
            </div>
          </div>
        </main>
        {openAddTransactionForm && <AddTransactionForm />}
      </>
    );
  };

  return <AuthenticatedPageLayout pageName="transactions" content={getContent()} />;
}
