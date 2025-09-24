import React from 'react';

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
  return <span className={`text-sm/6 font-semibold ${color}`}>{formatCurrency(amount)}</span>;
};

const TransactionsList: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        No transactions yet.
      </div>
    );
  }

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {transactions.map((tx) => (
        <li key={tx.transaction_id} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            {/* Avatar placeholder circle */}
            <div className="size-12 flex-none rounded-full bg-gray-100 ring-1 ring-inset ring-gray-200 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-500">
                {tx.merchant_name ? tx.merchant_name.charAt(0).toUpperCase() : 'T'}
              </span>
            </div>
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-gray-900">
                {tx.merchant_name || 'Transaction'}
              </p>
              <p className="mt-1 flex text-xs/5 text-gray-500">
                <span className="truncate">
                  {tx.account_institution_name} • {tx.account_name}
                </span>
                <span className="mx-2">•</span>
                <time className="whitespace-nowrap" dateTime={tx.transaction_date}>
                  {formatDate(tx.transaction_date)}
                </time>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-6">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <AmountBadge amount={tx.transaction_amount} />
              <p className="mt-1 text-xs/5 text-gray-500">{tx.transaction_type}</p>
            </div>
            <Menu as="div" className="relative flex-none">
              <MenuButton className="relative block text-gray-500 hover:text-gray-900">
                <span className="absolute -inset-2.5" />
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg outline outline-gray-900/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                  >
                    View details
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                  >
                    Categorize
                  </a>
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
