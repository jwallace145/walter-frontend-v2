import React from 'react';

import TransactionCategoryBadge from '@/components/transactions/TransactionCategoryBadge';
import { Transaction } from '@/lib/models/transaction';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';

const defaultLogoUrl =
  'https://d2v0gz9k690ozv.cloudfront.net/public/logos/default-merchant-logo.png';

const formatCurrency = (amount: number) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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

interface TransactionItemProps {
  transaction: Transaction;
  onViewDetails?: (transaction: Transaction) => void;
  onCategorize?: (transaction: Transaction) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onViewDetails,
  onCategorize,
}): React.ReactElement => {
  const logoUrl = transaction.merchant_logo_url || defaultLogoUrl;

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    onViewDetails?.(transaction);
  };

  const handleCategorize = (e: React.MouseEvent) => {
    e.preventDefault();
    onCategorize?.(transaction);
  };

  return (
    <li className="flex items-center justify-between px-2 py-2 hover:bg-gray-50 rounded-md">
      {/* LEFT */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-8 w-8 flex items-center justify-center bg-gray-50 rounded-md shadow-sm overflow-hidden">
          <img
            src={logoUrl}
            alt={transaction.merchant_name || 'Merchant Logo'}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="min-w-0 flex flex-col">
          <p className="truncate text-sm font-medium text-gray-900">
            {transaction.merchant_name || 'Transaction'}
          </p>
          <p className="flex items-center gap-1 text-xs text-gray-500 truncate">
            <span className="truncate">
              {transaction.account_institution_name} • {transaction.account_name}
            </span>
            <span className="text-gray-300">•</span>
            <TransactionCategoryBadge category={transaction.transaction_category} />
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex flex-col items-end">
          <AmountBadge amount={transaction.transaction_amount} />
          <p className="text-xs text-gray-400">{formatDate(transaction.transaction_date)}</p>
        </div>

        <Menu as="div" className="relative">
          <MenuButton className="text-gray-400 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <EllipsisVerticalIcon className="h-5 w-5" />
          </MenuButton>
          <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleViewDetails}
                  className={`w-full text-left block px-3 py-1 text-sm ${
                    active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                  }`}
                >
                  View details
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleCategorize}
                  className={`w-full text-left block px-3 py-1 text-sm ${
                    active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                  }`}
                >
                  Categorize
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </li>
  );
};

export default TransactionItem;
