import axios, { AxiosResponse } from 'axios';
import { GetServerSideProps } from 'next';
import React from 'react';
import { getCookie } from 'typescript-cookie';

import CreditAccountDescription from '@/components/accounts/credit/CreditAccountDescription';
import CreditAccountsList from '@/components/accounts/credit/CreditAccountsList';
import PaginatedTransactionsList from '@/components/transactions/PaginatedTransactionsList';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { withAuthenticationRedirect } from '@/lib/auth/AuthenticationRedirect';
import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';
import { AccountTransaction } from '@/lib/models/AccountTransaction';
import { CreditAccount } from '@/lib/models/CreditAccount';
import { User } from '@/lib/models/User';

const Credit: React.FC<{ user: User }> = ({ user }): React.ReactElement => {
  const [creditAccounts, setCreditAccounts] = React.useState<CreditAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = React.useState<CreditAccount | undefined>(
    undefined
  );
  const [fetchingCreditAccounts, setFetchingCreditAccounts] = React.useState<boolean>(false);
  const [transactions, setTransactions] = React.useState<AccountTransaction[]>([]);
  const [fetchingTransactions, setFetchingTransactions] = React.useState<boolean>(false);

  React.useEffect((): void => {
    fetchCreditAccounts();
    fetchTransactions();
  }, []);

  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return (
      <>
        <div className="flex flex-col lg:flex-row h-full">
          {/* Credit Accounts List */}
          <aside className="w-full lg:w-96 lg:flex-shrink-0 lg:overflow-y-auto border-r border-gray-200 bg-white">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
              <CreditAccountsList
                loading={fetchingCreditAccounts}
                accounts={creditAccounts}
                selectedAccount={selectedAccount}
                setSelectedAccount={setSelectedAccount}
                onCreateAccountSuccess={() => console.log('create credit account success')}
                onCreateAccountError={() => console.log('create credit account error')}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex-1 overflow-y-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <CreditAccountDescription
              loading={fetchingCreditAccounts}
              account={selectedAccount}
              onUpdateCreditAccountSuccess={() => console.log('update credit account success')}
              onUpdateCreditAccountError={() => console.log('update credit account error')}
              onDeleteCreditAccountSuccess={() => console.log('delete credit account success')}
              onDeleteCreditAccountError={() => console.log('delete credit account error')}
            />
            <div className="mt-8">
              <div className="mt-6">
                <PaginatedTransactionsList
                  refresh={(): void => console.log('refresh')}
                  onUpdateTransactionSuccess={(): void => console.log('update')}
                  onDeleteTransactionSuccess={(): void => console.log('delete')}
                  loading={fetchingTransactions}
                  transactions={transactions}
                  setTransactions={setTransactions}
                  transactionsPerPage={8}
                />
              </div>
            </div>
          </section>
        </div>
      </>
    );
  };

  const fetchCreditAccounts: () => void = (): void => {
    setFetchingCreditAccounts(true);
    axios('api/credit-accounts/get-credit-accounts', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getCookie(WALTER_API_TOKEN_NAME)}`,
      },
    })
      .then((response: AxiosResponse): CreditAccount[] => response.data)
      .then((creditAccounts: CreditAccount[]): void => {
        setCreditAccounts(creditAccounts);
        setSelectedAccount(creditAccounts.length === 0 ? undefined : creditAccounts[0]);
      })
      .catch((error: Error): void => console.error('Error:', error))
      .finally((): void => setFetchingCreditAccounts(false));
  };

  const fetchTransactions: () => void = (): void => {
    setFetchingTransactions(true);
    axios('api/transactions/get-transactions', {
      method: 'GET',
      params: {
        start_date: '2025-07-30',
        end_date: '2025-08-30',
      },
      headers: {
        Authorization: `Bearer ${getCookie(WALTER_API_TOKEN_NAME)}`,
      },
    })
      .then((response: AxiosResponse): AccountTransaction[] => response.data)
      .then((transactions: AccountTransaction[]): void => {
        setTransactions(transactions);
      })
      .catch((error: Error): void => console.error('Error:', error))
      .finally((): void => setFetchingTransactions(false));
  };

  return <AuthenticatedPageLayout pageName={'credit'} user={user} content={getContent()} />;
};

export const getServerSideProps: GetServerSideProps = withAuthenticationRedirect({
  authenticatedPage: true,
});

export default Credit;
