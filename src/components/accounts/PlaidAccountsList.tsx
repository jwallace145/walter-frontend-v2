import React from 'react';

import { Account } from '../../lib/models/account';

interface PlaidAccountsListProps {
  accounts: Account[];
  onSyncTransactions?: (account: Account) => void;
}

function initials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '');
  return letters.join('') || name[0]?.toUpperCase() || '?';
}

function formatCurrency(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '-';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString();
}

const PlaidAccountsList: React.FC<PlaidAccountsListProps> = ({ accounts, onSyncTransactions }) => {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {accounts?.map((account) => (
        <li key={account.account_id} className="relative flex justify-between gap-x-6 py-5">
          {/* Left side: account info */}
          <div className="flex min-w-0 gap-x-4">
            <div className="size-12 flex-none rounded-full bg-gray-100 ring-1 ring-inset ring-gray-200 text-gray-600 grid place-items-center font-semibold">
              {initials(account.institution_name || account.account_name)}
            </div>
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold text-gray-900">{account.account_name}</p>
              <p className="mt-1 text-xs text-gray-500 truncate">{account.institution_name}</p>
              <p className="mt-1 text-xs text-gray-500 truncate">
                {account.account_type}
                {account.account_subtype ? ` • ${account.account_subtype}` : ''}
              </p>
              <p className="mt-1 text-xs text-gray-400 truncate">ID: {account.account_id}</p>
            </div>
          </div>

          {/* Right side: balance + actions */}
          <div className="flex shrink-0 flex-col items-end justify-center space-y-2">
            <p className="text-sm font-medium text-gray-900">{formatCurrency(account.balance)}</p>
            {account.updated_at && (
              <p className="text-xs text-gray-500">
                Updated <time dateTime={account.updated_at}>{formatDate(account.updated_at)}</time>
              </p>
            )}

            {/* Linked status */}
            <div className="flex items-center gap-x-1.5">
              <div
                className={`flex-none rounded-full p-1 ${
                  account.linked_with_plaid ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                }`}
              >
                <div
                  className={`size-1.5 rounded-full ${
                    account.linked_with_plaid ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
              </div>
              <p className="text-xs text-gray-500">
                {account.linked_with_plaid ? 'Linked' : 'Disconnected'}
              </p>
            </div>

            {/* Refresh button */}
            <button
              type="button"
              onClick={() => onSyncTransactions?.(account)}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PlaidAccountsList;
