'use client';

import axios, { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { getCookie } from 'typescript-cookie';

import SuccessNotification from '@/components/notifications/SuccessNotification';
import WarningNotification from '@/components/notifications/WarningNotification';
import AddExpenseModal from '@/components/transactions/AddExpenseModal';
import AddIncomeModal from '@/components/transactions/AddIncomeModal';
import PaginatedTransactionsList from '@/components/transactions/PaginatedTransactionsList';
import TransactionsCashFlowLineChart from '@/components/transactions/TransactionsCashFlowLineChart';
import TransactionsChartOptions, {
  TransactionsChartOption,
} from '@/components/transactions/TransactionsChartOptions';
import TransactionsExpensesBarChart from '@/components/transactions/TransactionsExpensesBarChart';
import TransactionsHeader from '@/components/transactions/TransactionsHeader';
import TransactionsIncomeBarChart from '@/components/transactions/TransactionsIncomeBarChart';
import TransactionStats from '@/components/transactions/TransactionsStats';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { withAuthenticationRedirect } from '@/lib/auth/AuthenticationRedirect';
import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';
import { AccountTransaction } from '@/lib/models/AccountTransaction';
import { CashAccount } from '@/lib/models/CashAccount';
import { TransactionCategory } from '@/lib/models/Transaction';
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
  const [gettingTransactions, setGettingTransactions] = useState<boolean>(false);
  const [gettingAccounts, setGettingAccounts] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<CashAccount[]>([]);
  const [category, setCategory] = useState<TransactionCategory | null>(null);
  const [startDate, setStartDate] = useState<string>(START_OF_THE_MONTH);
  const [endDate, setEndDate] = useState<string>(END_OF_THE_MONTH);
  const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState<boolean>(false);
  const [openAddTransactionForm, setOpenAddTransactionForm] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [openAddIncomeSuccessAlert, setOpenAddIncomeSuccessAlert] = useState<boolean>(false);
  const [openAddExpenseSuccessAlert, setOpenAddExpenseSuccessAlert] = useState<boolean>(false);
  const [openEditTransactionSuccessAlert, setOpenEditTransactionSuccessAlert] =
    useState<boolean>(false);
  const [openDeleteTransactionSuccessAlert, setOpenDeleteTransactionSuccessAlert] =
    useState<boolean>(false);
  const [transactionsChartOption, setTransactionsChartOption] = useState<TransactionsChartOption>({
    id: 'cash flow',
    name: 'Cash Flow',
    current: true,
  });

  React.useEffect((): void => {
    getAccounts();
  }, []);

  useEffect((): void => {
    getTransactions(startDate, endDate, category);
  }, [startDate, endDate, category, refresh]);

  const getTransactions: (
    startDate: string,
    endDate: string,
    category: TransactionCategory | null
  ) => void = (startDate: string, endDate: string): void => {
    setGettingTransactions(true);
    axios(`/api/transactions/get-transactions`, {
      method: 'GET',
      params: {
        start_date: startDate,
        end_date: endDate,
      },
      headers: {
        Authorization: `Bearer ${getCookie(WALTER_API_TOKEN_NAME)}`,
      },
    })
      .then((response: AxiosResponse): void => {
        setTransactions(response.data);
      })
      .catch((error): void => console.error('Error:', error))
      .finally((): void => setGettingTransactions(false));
  };

  const getAccounts: () => void = (): void => {
    setGettingAccounts(true);
    axios(`/api/cash-accounts/get-cash-accounts`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getCookie(WALTER_API_TOKEN_NAME)}`,
      },
    })
      .then((response: AxiosResponse): void => {
        setAccounts(response.data);
      })
      .catch((error): void => console.error('Error:', error))
      .finally((): void => setGettingAccounts(false));
  };

  const generateTransactionsChartOptions: () => TransactionsChartOption[] =
    (): TransactionsChartOption[] => {
      return [
        { id: 'cash flow', name: 'Cash Flow', current: transactionsChartOption.id === 'cash flow' },
        { id: 'income', name: 'Income', current: transactionsChartOption.id === 'income' },
        { id: 'expense', name: 'Expense', current: transactionsChartOption.id === 'expense' },
        {
          id: 'categories',
          name: 'Categories',
          current: transactionsChartOption.id === 'categories',
        },
      ];
    };

  const renderTransactionsChart: () => React.ReactElement = (): React.ReactElement => {
    switch (transactionsChartOption.id) {
      case 'cash flow':
        return (
          <>
            <TransactionStats transactions={transactions} />
            <TransactionsCashFlowLineChart
              loading={gettingTransactions}
              transactions={transactions}
            />
          </>
        );
      case 'income':
        return (
          <>
            <TransactionStats transactions={transactions} />
            <TransactionsIncomeBarChart loading={gettingTransactions} transactions={transactions} />
            ;
          </>
        );
      case 'expense':
        return (
          <>
            <TransactionStats transactions={transactions} />
            <TransactionsExpensesBarChart
              loading={gettingTransactions}
              transactions={transactions}
            />
            ;
          </>
        );
      case 'categories':
        return (
          <>
            <TransactionStats transactions={transactions} />
            <TransactionsCategoryPieChart
              loading={gettingTransactions}
              transactions={transactions}
              setCategory={(category: string): void => console.log(category)}
            />
          </>
        );
      default:
        return (
          <>
            <TransactionStats transactions={transactions} />
            <TransactionsCategoryPieChart
              loading={gettingTransactions}
              transactions={transactions}
              setCategory={(category: string): void => console.log(category)}
            />
          </>
        );
    }
  };

  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return (
      <>
        {/* Notifications */}
        <SuccessNotification
          show={openAddIncomeSuccessAlert}
          setShow={setOpenAddIncomeSuccessAlert}
          title={'Income added!'}
          message={
            'Income successfully added to your account. You can now view it in your transactions.'
          }
        />
        <SuccessNotification
          show={openAddExpenseSuccessAlert}
          setShow={setOpenAddExpenseSuccessAlert}
          title={'Expense added!'}
          message={
            'Expense successfully added to your account. You can now view it in your transactions.'
          }
        />
        <SuccessNotification
          show={openEditTransactionSuccessAlert}
          setShow={setOpenEditTransactionSuccessAlert}
          title={'Transaction updated!'}
          message={
            'The transaction has been updated in your account. You can now view it in your transactions.'
          }
        />
        <WarningNotification
          show={openDeleteTransactionSuccessAlert}
          setShow={setOpenDeleteTransactionSuccessAlert}
          title={'Deleted transaction'}
          message={'The transaction has been deleted from your account.'}
        />

        <main className="p-8">
          <h1 className="text-2xl font-bold mb-4">Your Transactions</h1>

          {/* Transactions Page Header */}
          <TransactionsHeader
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            setOpenAddIncomeModal={setOpenAddIncomeModal}
            setOpenAddExpenseModal={setOpenAddTransactionForm}
          />

          {/* Transactions Page Content */}
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Transactions Charts */}
            <div className="flex-1 flex flex-col gap-6">
              <TransactionsChartOptions
                transactionChartOptions={generateTransactionsChartOptions()}
                setTransactionsChartOption={setTransactionsChartOption}
              />
              {renderTransactionsChart()}
            </div>

            {/* Transactions List */}
            <div className="flex-1">
              <PaginatedTransactionsList
                refresh={(): void => setRefresh(!refresh)}
                onUpdateTransactionSuccess={(): void => setOpenEditTransactionSuccessAlert(true)}
                onDeleteTransactionSuccess={(): void => setOpenDeleteTransactionSuccessAlert(true)}
                loading={gettingTransactions}
                transactions={transactions}
                setTransactions={setTransactions}
                transactionsPerPage={12}
              />
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
          accounts={accounts}
        />
        <AddExpenseModal
          open={openAddTransactionForm}
          setOpen={setOpenAddTransactionForm}
          onClose={(): void => setOpenAddTransactionForm(false)}
          onExpenseAdded={(): void => {
            setRefresh(!refresh);
            setOpenAddExpenseSuccessAlert(true);
          }}
          accounts={accounts}
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
