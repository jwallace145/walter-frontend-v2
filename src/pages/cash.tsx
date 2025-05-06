'use client';

import axios, { AxiosResponse } from 'axios';
import { GetServerSideProps } from 'next';
import React from 'react';
import { getCookie } from 'typescript-cookie';

import CashAccountDescription from '@/components/cash/CashAccountDescription';
import CashAccountsList from '@/components/cash/CashAccountsList';
import CashAccountTransactionsDateRangeOptions from '@/components/cash/CashAccountTransactionsDateRangeOptions';
import ErrorNotification from '@/components/notifications/ErrorNotification';
import SuccessNotification from '@/components/notifications/SuccessNotification';
import WarningNotification from '@/components/notifications/WarningNotification';
import PaginatedTransactionsList from '@/components/transactions/PaginatedTransactionsList';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { withAuthenticationRedirect } from '@/lib/auth/AuthenticationRedirect';
import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';
import { CashAccount } from '@/lib/models/CashAccount';
import { Transaction } from '@/lib/models/Transaction';
import { User } from '@/lib/models/User';

const Cash: React.FC<{ user: User }> = ({ user }): React.ReactElement => {
  const [accounts, setAccounts] = React.useState<CashAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = React.useState<CashAccount | undefined>(undefined);
  const [gettingAccounts, setGettingAccounts] = React.useState<boolean>(false);
  const [startDate, setStartDate] = React.useState<string>('2025-01-01');
  const [endDate, setEndDate] = React.useState<string>('2025-04-30');
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [gettingTransactions, setGettingTransactions] = React.useState<boolean>(false);
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [updateAccountSuccess, setUpdateAccountSuccess] = React.useState<boolean>(false);
  const [updateAccountError, setUpdateAccountError] = React.useState<boolean>(false);
  const [deleteAccountSuccess, setDeleteAccountSuccess] = React.useState<boolean>(false);
  const [deleteAccountError, setDeleteAccountError] = React.useState<boolean>(false);
  const [createAccountSuccess, setCreateAccountSuccess] = React.useState<boolean>(false);
  const [createAccountError, setCreateAccountError] = React.useState<boolean>(false);

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
        setSelectedAccount(accounts.length === 0 ? undefined : accounts[0]);
        console.log('whattt');
        console.log(accounts);
        console.log(accounts[0]);
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
  }, [refresh]);

  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return (
      <>
        <div className="flex flex-col lg:flex-row h-full">
          {/* Cash Accounts Sidebar/List */}
          <aside className="w-full lg:w-96 lg:flex-shrink-0 lg:overflow-y-auto border-r border-gray-200 bg-white">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
              <CashAccountsList
                loading={gettingAccounts}
                accounts={accounts}
                selectedAccount={selectedAccount}
                setSelectedAccount={setSelectedAccount}
                onCreateAccountSuccess={(): void => {
                  setRefresh(!refresh);
                  setCreateAccountSuccess(true);
                }}
                onCreateAccountError={(): void => {
                  setRefresh(!refresh);
                  setCreateAccountError(true);
                }}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex-1 overflow-y-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <CashAccountDescription
              loading={gettingAccounts}
              account={selectedAccount}
              onUpdateAccountSuccess={(): void => {
                setRefresh(!refresh);
                setUpdateAccountSuccess(true);
              }}
              onUpdateAccountError={(): void => {
                setRefresh(!refresh);
                setUpdateAccountError(true);
              }}
              onDeleteAccountSuccess={(): void => {
                setRefresh(!refresh);
                setDeleteAccountSuccess(true);
              }}
              onDeleteAccountError={(): void => {
                setRefresh(!refresh);
                setDeleteAccountError(true);
              }}
            />
            <div className="mt-8">
              <CashAccountTransactionsDateRangeOptions />
              <div className="mt-6">
                <PaginatedTransactionsList
                  refresh={(): void => console.log('refresh')}
                  onUpdateTransactionSuccess={(): void => console.log('update')}
                  onDeleteTransactionSuccess={(): void => console.log('delete')}
                  accounts={accounts}
                  transactions={transactions}
                  setTransactions={setTransactions}
                  transactionsPerPage={8}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Notifications */}
        <SuccessNotification
          show={updateAccountSuccess}
          setShow={setUpdateAccountSuccess}
          title="Updated account successfully"
          message="Your account has been updated successfully and can now be view in the Cash page."
        />
        <ErrorNotification
          show={updateAccountError}
          setShow={setUpdateAccountError}
          title="Failed to update account"
          message="Failed to update your account. Please try again or contact support."
        />
        <WarningNotification
          show={deleteAccountSuccess}
          setShow={setDeleteAccountSuccess}
          title="Account deleted successfully"
          message="Your account has been deleted successfully."
        />
        <ErrorNotification
          show={deleteAccountError}
          setShow={setDeleteAccountError}
          title="Failed to delete account"
          message="Failed to delete your account. Please try again or contact support."
        />
      </>
    );
  };

  return <AuthenticatedPageLayout pageName={'cash'} user={user} content={getContent()} />;
};

export const getServerSideProps: GetServerSideProps = withAuthenticationRedirect({
  authenticatedPage: true,
});

export default Cash;
