'use client';

import { useEffect, useState } from 'react';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import React from 'react';
import TransactionsList from '@/components/transactions/TransactionsList';
import { getCookie } from 'typescript-cookie';
import { WALTER_API_TOKEN_NAME } from '@/pages/api/Constants';
import dayjs from 'dayjs';

export default function Transactions(): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect((): void => {
    getTransactions();
  }, []);

  const getTransactions: () => void = (): void => {
    const startDate = dayjs().startOf('month').format('YYYY-MM-DD');
    const endDate = dayjs().endOf('month').format('YYYY-MM-DD');

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

  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Your Transactions</h1>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1">
            <TransactionsList expenses={expenses} />
          </div>
          <div className="flex-1">
            <TransactionsList expenses={expenses} />
          </div>
        </div>
      </main>
    );
  };

  return <AuthenticatedPageLayout pageName="transactions" content={getContent()} />;
}
