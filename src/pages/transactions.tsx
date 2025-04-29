'use client';

import { ChartPieIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { BanknotesIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { getCookie } from 'typescript-cookie';

import SuccessAlert from '@/components/alerts/SuccessAlert';
import AddExpenseModal from '@/components/transactions/AddExpenseModal';
import AddIncomeModal from '@/components/transactions/AddIncomeModal';
import PaginatedTransactionsList from '@/components/transactions/PaginatedTransactionsList';
import TransactionStats from '@/components/transactions/TransactionsStats';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { withAuthenticationRedirect } from '@/lib/auth/AuthenticationRedirect';
import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';
import { ExpenseCategory, getExpenseCategory } from '@/lib/models/ExpenseCategory';
import { Transaction } from '@/lib/models/Transaction';
import { User } from '@/lib/models/User';

const TransactionsCategoryPieChart = dynamic(
  () => import('@/components/transactions/TransactionsCategoryPieChart'),
  {
    ssr: false,
  }
);

const START_OF_THE_MONTH: string = dayjs().startOf('month').format('YYYY-MM-DD');
const END_OF_THE_MONTH: string = dayjs().endOf('month').format('YYYY-MM-DD');

const Transactions: React.FC<{ user: User }> = ({ user }): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<ExpenseCategory | null>(null);
  const [currentDateRange, setCurrentDateRange] = useState<string>('This month');
  const [startDate, setStartDate] = useState<string>(START_OF_THE_MONTH);
  const [endDate, setEndDate] = useState<string>(END_OF_THE_MONTH);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState<boolean>(false);
  const [openAddTransactionForm, setOpenAddTransactionForm] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [openAddIncomeSuccessAlert, setOpenAddIncomeSuccessAlert] = useState<boolean>(false);
  const [openAddExpenseSuccessAlert, setOpenAddExpenseSuccessAlert] = useState<boolean>(false);

  useEffect((): void => {
    getTransactions(startDate, endDate, category);
  }, [startDate, endDate, category, refresh]);

  const getTransactions: (
    startDate: string,
    endDate: string,
    category: ExpenseCategory | null
  ) => void = (startDate: string, endDate: string): void => {
    setLoading(true);
    axios
      .get(`/api/transactions/get-transactions`, {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
        headers: {
          Authorization: `Bearer ${getCookie(WALTER_API_TOKEN_NAME)}`,
        },
      })
      .then((response): void => {
        setTransactions(response.data);
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
        {/* Alerts */}
        <SuccessAlert
          open={openAddIncomeSuccessAlert}
          setOpen={setOpenAddIncomeSuccessAlert}
          message={'Income added successfully!'}
        />
        <SuccessAlert
          open={openAddExpenseSuccessAlert}
          setOpen={setOpenAddExpenseSuccessAlert}
          message={'Expense added successfully!'}
        />

        <main className="p-8">
          <h1 className="text-2xl font-bold mb-4">Your Transactions</h1>
          <header className="pt-6 pb-4 sm:pb-6">
            <div className="mx-auto flex max-w-7xl justify-between items-center px-4 sm:px-6 lg:px-8">
              {/* Category Breadcrumbs */}
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

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={(): void => setOpenAddIncomeModal(true)}
                  className="flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <BanknotesIcon aria-hidden="true" className="-ml-1.5 size-5" />
                  <span className="hidden md:inline">Income</span>
                </button>

                <button
                  type="button"
                  onClick={(): void => setOpenAddTransactionForm(true)}
                  className="flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <CreditCardIcon aria-hidden="true" className="-ml-1.5 size-5" />
                  <span className="hidden md:inline">Expense</span>
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-1 flex flex-col gap-6">
              <TransactionStats transactions={transactions} />
              <TransactionsCategoryPieChart
                loading={loading}
                transactions={transactions}
                setCategory={(category: string): void => {
                  setCategory(getExpenseCategory(category) as ExpenseCategory);
                }}
              />
            </div>

            <div className="flex-1">
              <PaginatedTransactionsList transactions={transactions} transactionsPerPage={8} />
            </div>
          </div>
        </main>

        {/* Modals */}
        <AddIncomeModal
          open={openAddIncomeModal}
          setOpen={setOpenAddIncomeModal}
          onClose={(): void => setOpenAddIncomeModal(false)}
          onIncomeAdded={(): void => {
            setRefresh(!refresh);
            setOpenAddIncomeSuccessAlert(true);
          }}
        />
        <AddExpenseModal
          open={openAddTransactionForm}
          setOpen={setOpenAddTransactionForm}
          onClose={(): void => setOpenAddTransactionForm(false)}
          onExpenseAdded={(): void => {
            setRefresh(!refresh);
            setOpenAddExpenseSuccessAlert(true);
          }}
        />
      </>
    );
  };

  return <AuthenticatedPageLayout pageName="transactions" user={user} content={getContent()} />;
};

export const getServerSideProps: GetServerSideProps = withAuthenticationRedirect({
  authenticatedPage: true,
});

export default Transactions;
