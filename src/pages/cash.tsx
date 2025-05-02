'use client';

import axios, { AxiosResponse } from 'axios';
import { GetServerSideProps } from 'next';
import React from 'react';
import { getCookie } from 'typescript-cookie';

import CashAccountDescription from '@/components/cash/CashAccountDescription';
import CashAccountsList from '@/components/cash/CashAccountsList';
import PaginatedTransactionsList from '@/components/transactions/PaginatedTransactionsList';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { withAuthenticationRedirect } from '@/lib/auth/AuthenticationRedirect';
import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';
import { CashAccount } from '@/lib/models/CashAccount';
import { Transaction } from '@/lib/models/Transaction';
import { User } from '@/lib/models/User';

const Cash: React.FC<{ user: User }> = ({ user }): React.ReactElement => {
  const [accounts, setAccounts] = React.useState<CashAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = React.useState<CashAccount | null>(null);
  const [gettingAccounts, setGettingAccounts] = React.useState<boolean>(false);
  const [startDate, setStartDate] = React.useState<string>('2025-01-01');
  const [endDate, setEndDate] = React.useState<string>('2025-04-30');
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [gettingTransactions, setGettingTransactions] = React.useState<boolean>(false);

  React.useEffect((): void => {
    setGettingAccounts(true);
    axios('/api/cash-accounts/get-cash-accounts', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getCookie(WALTER_API_TOKEN_NAME)}`,
      },
    })
      .then((response: AxiosResponse): CashAccount[] => response.data)
      .then((accounts: CashAccount[]): void => {
        setAccounts(accounts);
        setSelectedAccount(accounts.length > 0 ? accounts[0] : null);
        console.log(accounts);
      })
      .catch((error: Error): void => console.error('Error:', error))
      .finally((): void => setGettingAccounts(false));
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
      .then((response): void => {
        setTransactions(response.data);
      })
      .catch((error): void => console.error('Error:', error))
      .finally((): void => setGettingTransactions(false));
  }, []);

  const getTotalBalance: () => number = (): number => {
    return accounts
      .map((account: CashAccount): number => account.balance)
      .reduce((a: number, b: number): number => a + b, 0);
  };

  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return (
      <div className="flex flex-col lg:flex-row h-full">
        {/* Cash Accounts Sidebar/List */}
        <aside className="w-full lg:w-96 lg:flex-shrink-0 lg:overflow-y-auto border-r border-gray-200 bg-white">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <CashAccountsList
              accounts={accounts}
              totalBalance={getTotalBalance()}
              setSelectedAccount={setSelectedAccount}
            />
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 overflow-y-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <CashAccountDescription loading={gettingAccounts} account={selectedAccount} />
          <div className="mt-8">
            <PaginatedTransactionsList
              refresh={() => console.log('refresh')}
              onUpdateTransactionSuccess={() => console.log('update')}
              onDeleteTransactionSuccess={() => console.log('delete')}
              transactions={transactions}
              setTransactions={setTransactions}
              transactionsPerPage={5}
            />
          </div>
        </section>
      </div>
    );
  };

  return <AuthenticatedPageLayout pageName={'cash'} user={user} content={getContent()} />;
};

export const getServerSideProps: GetServerSideProps = withAuthenticationRedirect({
  authenticatedPage: true,
});

export default Cash;
