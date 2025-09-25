import React from 'react';
import Link from 'next/link';

import TransactionCategoryBadge from '@/components/transactions/TransactionCategoryBadge';
import { Transaction } from '@/lib/models/transaction';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { BanknotesIcon, EllipsisVerticalIcon } from '@heroicons/react/20/solid';

const formatCurrency = (amount: number) => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
};

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  } catch {
    return dateStr;
  }
};

const AmountBadge: React.FC<{ amount: number }> = ({ amount }) => {
  const color = amount < 0 ? 'text-red-600' : 'text-emerald-700';
  return <span className={`text-sm font-semibold ${color}`}>{formatCurrency(amount)}</span>;
};

const TransactionsList: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const defaultLogoUrl =
    'https://d2v0gz9k690ozv.cloudfront.net/public/logos/default-merchant-logo.png';

  if (!transactions || transactions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        <BanknotesIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
        No transactions found.{' '}
        <Link href="/settings" className="text-blue-600 hover:text-blue-800 underline">
          Link your accounts
        </Link>{' '}
        to start tracking spending.
      </div>
    );
  }

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {transactions.map((tx) => {
        const logoUrl = tx.merchant_logo_url || defaultLogoUrl;

        return (
          <li
            key={tx.transaction_id}
            className="flex items-center justify-between px-2 py-2 hover:bg-gray-50 rounded-md"
          >
            {/* LEFT */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 flex items-center justify-center bg-gray-50 rounded-md shadow-sm overflow-hidden">
                <img
                  src={logoUrl}
                  alt={tx.merchant_name || 'Merchant Logo'}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="min-w-0 flex flex-col">
                <p className="truncate text-sm font-medium text-gray-900">
                  {tx.merchant_name || 'Transaction'}
                </p>
                <p className="flex items-center gap-1 text-xs text-gray-500 truncate">
                  <span className="truncate">
                    {tx.account_institution_name} • {tx.account_name}
                  </span>
                  <span className="text-gray-300">•</span>
                  <TransactionCategoryBadge category={tx.transaction_category} />
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex flex-col items-end">
                <AmountBadge amount={tx.transaction_amount} />
                <p className="text-xs text-gray-400">{formatDate(tx.transaction_date)}</p>
              </div>

              <Menu as="div" className="relative">
                <MenuButton className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </MenuButton>
                <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="#"
                        className={`block px-3 py-1 text-sm ${active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'}`}
                      >
                        View details
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="#"
                        className={`block px-3 py-1 text-sm ${active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'}`}
                      >
                        Categorize
                      </a>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default TransactionsList;
