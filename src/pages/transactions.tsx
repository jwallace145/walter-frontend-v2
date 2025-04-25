'use client';

import { PlusSmallIcon } from '@heroicons/react/20/solid';
import { ChartPieIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { getCookie } from 'typescript-cookie';

import AddTransactionForm from '@/components/transactions/AddTransactionForm';
import PaginatedTransactionsList from '@/components/transactions/PaginatedTransactionsList';
import TransactionStats from '@/components/transactions/TransactionsStats';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { withAuthenticatedRedirect } from '@/lib/auth/AuthenticatedRedirect';
import { Expense } from '@/lib/models/Expense';
import { ExpenseCategory, getExpenseCategory } from '@/lib/models/ExpenseCategory';
import { User } from '@/lib/models/User';
import { WALTER_API_TOKEN_NAME } from '@/pages/api/Constants';

const TransactionsCategoryPieChart = dynamic(
  () => import('@/components/transactions/TransactionsCategoryPieChart'),
  {
    ssr: false,
  }
);

const pages = [
  { name: 'Categories', href: '#', current: false },
  { name: 'Transportation', href: '#', current: true },
];

const START_OF_THE_MONTH: string = dayjs().startOf('month').format('YYYY-MM-DD');
const END_OF_THE_MONTH: string = dayjs().endOf('month').format('YYYY-MM-DD');

interface TransactionsProps {
  user: User;
}

const Transactions: React.FC<TransactionsProps> = ({ user }): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<ExpenseCategory | null>(null);
  const [currentDateRange, setCurrentDateRange] = useState<string>('This month');
  const [startDate, setStartDate] = useState<string>(START_OF_THE_MONTH);
  const [endDate, setEndDate] = useState<string>(END_OF_THE_MONTH);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [openAddTransactionForm, setOpenAddTransactionForm] = useState<boolean>(false);

  useEffect((): void => {
    getTransactions(startDate, endDate, category);
  }, [startDate, endDate, category]);

  const getTransactions: (
    startDate: string,
    endDate: string,
    category: ExpenseCategory | null
  ) => void = (startDate: string, endDate: string): void => {
    setLoading(true);
    fetch(`/api/transactions/get-transactions?start_date=${startDate}&end_date=${endDate}`, {
      headers: {
        Authorization: `Bearer ${getCookie(WALTER_API_TOKEN_NAME)}`,
      },
    })
      .then((response: Response) => response.json())
      .then((data): void => {
        const expenses: Expense[] = data['Data']['expenses'];

        if (category === null) {
          setExpenses(expenses);
        } else {
          const filteredExpenses: Expense[] = expenses.filter(
            (expense: Expense): boolean => expense.category.toLowerCase() === category.toLowerCase()
          );
          setExpenses(filteredExpenses);
        }
      })
      .catch((error): void => console.error('Error:', error))
      .finally((): void => setLoading(false));
  };

  const getCategoryBreadcrumbs: () => any[] = (): any[] => {
    if (category === null) {
      return [];
    } else {
      return [{ name: category, current: true }];
    }
  };

  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return (
      <>
        <main className="p-8">
          <h1 className="text-2xl font-bold mb-4">Your Transactions</h1>
          <header className="pt-6 pb-4 sm:pb-6">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
              <nav aria-label="Breadcrumb" className="flex">
                <ol role="list" className="flex items-center space-x-4">
                  <li>
                    <div>
                      <a
                        href="#"
                        onClick={(): void => setCategory(null)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <ChartPieIcon aria-hidden="true" className="size-5 shrink-0" />
                        <span className="sr-only">Home</span>
                      </a>
                    </div>
                  </li>
                  {getCategoryBreadcrumbs().map((page) => (
                    <li key={page.name}>
                      <div className="flex items-center">
                        <ChevronRightIcon
                          aria-hidden="true"
                          className="size-5 shrink-0 text-gray-400"
                        />
                        <a
                          href={page.href}
                          aria-current={page.current ? 'page' : undefined}
                          className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                          {page.name}
                        </a>
                      </div>
                    </li>
                  ))}
                </ol>
              </nav>
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
              <TransactionsCategoryPieChart
                loading={loading}
                transactions={expenses}
                setCategory={(category: string): void => {
                  setCategory(getExpenseCategory(category) as ExpenseCategory);
                }}
              />
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

  return <AuthenticatedPageLayout pageName="transactions" user={user} content={getContent()} />;
};

export const getServerSideProps: GetServerSideProps = withAuthenticatedRedirect();

export default Transactions;
