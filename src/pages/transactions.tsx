'use client';

import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';

import TransactionsList from '@/components/transactions/TransactionsList';
import TransactionsStats from '@/components/transactions/TransactionsStats';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { withAuthenticationRedirect } from '@/lib/auth/AuthenticationRedirect';
import { Transaction } from '@/lib/models/transaction';
import { User } from '@/lib/models/User';
import { WalterBackendProxy } from '@/lib/proxy/client';
import { GetTransactionsResponse } from '@/lib/proxy/responses';

const TransactionsPage: React.FC<{ user: User }> = ({ user }) => {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = React.useState<number>(0);
  const [totalExpenses, setTotalExpenses] = React.useState<number>(0);
  const [cashFlow, setCashFlow] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect((): void => {
    setLoading(true);
    WalterBackendProxy.getTransactions()
      .then((response: GetTransactionsResponse): void => {
        if (response.isSuccess()) {
          setTotalIncome(response.getTotalIncome());
          setTotalExpenses(response.getTotalExpenses());
          setCashFlow(response.getCashFlow());
          setTransactions(response.getTransactions());
        } else {
          setError(`Failed to get transactions: ${response.message}`);
        }
      })
      .catch((error): void => {
        setError(error?.message || 'Unexpected error occurred while loading transactions.');
      })
      .finally((): void => {
        setLoading(false);
      });
  }, []);

  const content: React.ReactElement = (
    <div className="space-y-6">
      <div>
        <h1 className="text-base/7 font-semibold text-gray-900">Transactions</h1>
        <p className="mt-1 text-sm/6 text-gray-500">
          Review your latest activity across all linked accounts.
        </p>
      </div>

      {loading && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
          Loading transactions...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <TransactionsStats
            title="All time"
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            cashFlow={cashFlow}
          />
          <TransactionsList transactions={transactions} />
        </>
      )}
    </div>
  );

  return <AuthenticatedPageLayout pageName="transactions" user={user} content={content} />;
};

export const getServerSideProps: GetServerSideProps = withAuthenticationRedirect({
  authenticatedPage: true,
});

export default TransactionsPage;
