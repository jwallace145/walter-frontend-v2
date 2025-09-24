import React from 'react';

import TransactionCategoryBadge from '@/components/transactions/TransactionCategoryBadge';
import { Transaction } from '@/lib/models/transaction';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';

const formatCurrency = (amount: number): string => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount);
  } catch (e) {
    return `$${amount.toFixed(2)}`;
  }
};

const formatDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch (e) {
    return dateStr;
  }
};

const AmountBadge: React.FC<{ amount: number }> = ({ amount }) => {
  const isNegative = amount < 0;
  const color = isNegative ? 'text-red-600' : 'text-emerald-700';
  return <span className={`text-sm font-semibold ${color}`}>{formatCurrency(amount)}</span>;
};

const TransactionsList: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        No transactions yet.
      </div>
    );
  }

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {transactions.map((tx) => (
        <li
          key={tx.transaction_id}
          className="flex items-center justify-between px-2 py-3 hover:bg-gray-50"
        >
          {/* LEFT SIDE */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 flex-none rounded-full bg-gray-100 ring-1 ring-inset ring-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-500">
                {tx.merchant_name ? tx.merchant_name.charAt(0).toUpperCase() : 'T'}
              </span>
            </div>
            <div className="min-w-0 flex flex-col">
              <p className="truncate text-sm font-medium text-gray-900">
                {tx.merchant_name || 'Transaction'}
              </p>
              <p className="flex items-center gap-2 text-xs text-gray-500 truncate">
                <span className="truncate">
                  {tx.account_institution_name} • {tx.account_name}
                </span>
                <span className="text-gray-400">•</span>
                <TransactionCategoryBadge category={tx.transaction_category} />
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col items-end">
              <AmountBadge amount={tx.transaction_amount} />
              <p className="text-xs text-gray-500">{formatDate(tx.transaction_date)}</p>
            </div>
            <Menu as="div" className="relative">
              <MenuButton className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
              >
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`block px-3 py-1 text-sm ${
                        active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      View details
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`block px-3 py-1 text-sm ${
                        active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      Categorize
                    </a>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TransactionsList;
