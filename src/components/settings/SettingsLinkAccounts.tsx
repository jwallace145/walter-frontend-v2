import React, { useEffect } from 'react';

import PlaidAccountsList from '@/components/accounts/PlaidAccountsList';
import LinkAccountButton from '@/components/plaid/LinkAccountButton';
import { Account } from '@/lib/models/account';
import { User } from '@/lib/models/User';
import { WalterBackendProxy } from '@/lib/proxy/client';
import { GetAccountsResponse, SyncTransactionsResponse } from '@/lib/proxy/responses';

const SettingsLinkAccounts: React.FC<{ user: User }> = ({ user }): React.ReactElement => {
  const [loading, setLoading] = React.useState(false);
  const [accounts, setAccounts] = React.useState<Account[]>([]);

  useEffect((): void => {
    fetchLinkedAccounts();
  }, []);

  const fetchLinkedAccounts: () => Promise<void> = async (): Promise<void> => {
    setLoading(true);
    WalterBackendProxy.getAccounts()
      .then((response: GetAccountsResponse): void => {
        if (response.isSuccess()) {
          setAccounts(response.getPlaidAccounts());
        } else {
          console.error('GetAccounts API call failed: ', response.message);
        }
      })
      .catch((error: any): void => {
        console.error('There was an error fetching linked accounts:', error);
      })
      .finally((): void => setLoading(false));
  };

  const syncTransactions = (account: Account): void => {
    WalterBackendProxy.syncTransactions(user.user_id, account.account_id)
      .then((response: SyncTransactionsResponse): void => {
        if (response.isSuccess()) {
          console.log('Successfully synced transactions for account: ', account.account_id);
          console.log('Submitted sync transactions request: ', response.getTaskId());
        } else {
          console.error('SyncTransactions API call failed: ', response.message);
        }
      })
      .catch((error: any): void => {
        console.error('Unexpected error occurred while syncing transactions: ', error);
      })
      .finally((): void => setLoading(false));
  };

  const renderLoadingState = (): React.ReactElement => (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex flex-col items-center">
        <svg
          className="h-8 w-8 animate-spin text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="mt-4 text-sm text-gray-500">Loading your linked accounts...</p>
      </div>
    </div>
  );

  const renderEmptyState = (): React.ReactElement => (
    <div className="text-center rounded-lg border-2 border-dashed border-gray-200 p-8 w-full">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
        <svg
          className="h-6 w-6 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.172 14.828a4 4 0 010-5.656l1.414-1.414a4 4 0 015.656 5.656l-.586.586"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.828 9.172a4 4 0 010 5.656l-1.414 1.414a4 4 0 01-5.656-5.656l.586-.586"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-sm font-medium text-gray-900">No accounts linked yet</h3>
      <p className="mt-1 text-sm text-gray-500">
        Link your accounts with Plaid to start tracking your finances in Walter.
      </p>
    </div>
  );

  return (
    <div className="max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header row always visible */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Link Accounts</h2>
          <p className="mt-1 text-sm text-gray-500">
            Link your financial accounts with Plaid so Walter can automatically track your expenses
            and income.
          </p>
        </div>
        <LinkAccountButton />
      </div>

      {/* Accounts list section */}
      <div className="w-full">
        {loading ? (
          renderLoadingState()
        ) : accounts.length === 0 ? (
          renderEmptyState()
        ) : (
          <PlaidAccountsList accounts={accounts} onSyncTransactions={syncTransactions} />
        )}
      </div>
    </div>
  );
};

export default SettingsLinkAccounts;
