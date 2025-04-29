import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { PencilIcon } from '@heroicons/react/16/solid';
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/20/solid';
import React, { ReactElement, useState } from 'react';

import DeleteTransactionModal from '@/components/transactions/DeleteTransactionModal';
import EditTransactionModal from '@/components/transactions/EditTransactionModal';
import { US_DOLLAR } from '@/lib/constants/Constants';
import { Transaction } from '@/lib/models/Transaction';

const TransactionsList: React.FC<{ transactions: Transaction[] }> = ({
  transactions,
}): React.ReactElement => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [openEditTransactionModal, setOpenEditTransactionModal] = useState<boolean>(false);
  const [openDeleteTransactionModal, setOpenDeleteTransactionModal] = useState<boolean>(false);

  const getTransactionCategoryBadge: (category: string) => ReactElement = (
    category: string
  ): ReactElement => {
    switch (category.toLowerCase()) {
      case 'bills':
        return (
          <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-orange-700/10 ring-inset">
            💰 Bills
          </span>
        );
      case 'entertainment':
        return (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-700/10 ring-inset">
            🎮 Entertainment
          </span>
        );
      case 'groceries':
        return (
          <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset">
            🛒 Groceries
          </span>
        );
      case 'health and wellness':
        return (
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-700/10 ring-inset">
            ❤️ Health and Wellness
          </span>
        );
      case 'hobbies':
        return (
          <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-pink-700/10 ring-inset">
            🎨 Hobbies
          </span>
        );
      case 'housing':
        return (
          <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-600/20 ring-inset">
            🏠 Housing
          </span>
        );
      case 'income':
        return (
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
            💵 Income
          </span>
        );
      case 'insurance':
        return (
          <span className="inline-flex items-center rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-700 ring-1 ring-cyan-700/10 ring-inset">
            🛡️ Insurance
          </span>
        );
      case 'merchandise':
        return (
          <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-700/10 ring-inset">
            📦 Merchandise
          </span>
        );
      case 'restaurants':
        return (
          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-700/10 ring-inset">
            🍽️ Restaurants
          </span>
        );
      case 'shopping':
        return (
          <span className="inline-flex items-center rounded-md bg-fuchsia-50 px-2 py-1 text-xs font-medium text-fuchsia-700 ring-1 ring-fuchsia-700/10 ring-inset">
            🛍️ Shopping
          </span>
        );
      case 'subscriptions':
        return (
          <span className="inline-flex items-center rounded-md bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-700/10 ring-inset">
            📱 Subscriptions
          </span>
        );
      case 'transportation':
        return (
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
            🚗 Transportation
          </span>
        );
      case 'travel':
        return (
          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
            ✈️ Travel
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
            ❔ Other
          </span>
        );
    }
  };

  const getDate: (transaction: Transaction) => string = (transaction: Transaction): string => {
    const date: Date = new Date(transaction.date);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <ul role="list" className="divide-y divide-gray-100">
        {transactions.map(
          (transaction: Transaction): React.ReactElement => (
            <li
              key={`${transaction.date}#${transaction.transaction_id}`}
              className="flex justify-between gap-x-6 py-5"
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <div className="flex items-start gap-x-3">
                    <p className="text-sm/6 font-semibold text-gray-900">{transaction.vendor}</p>
                    {getTransactionCategoryBadge(transaction.category)}
                  </div>

                  <p className="mt-1 flex text-xs/5 text-gray-500">{getDate(transaction)}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-x-6">
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p
                    className={`text-sm/6 ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}
                  >
                    {US_DOLLAR.format(
                      transaction.amount > 0 ? transaction.amount : -1 * transaction.amount
                    )}
                  </p>
                </div>
                <Menu as="div" className="relative flex-none">
                  <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <MenuItem>
                      <a
                        onClick={(): void => {
                          setSelectedTransaction(transaction);
                          setOpenEditTransactionModal(true);
                        }}
                        className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                      >
                        <div className="flex items-center gap-x-2">
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </div>
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        onClick={(): void => {
                          setSelectedTransaction(transaction);
                          setOpenDeleteTransactionModal(true);
                        }}
                        className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                      >
                        <div className="flex items-center gap-x-2">
                          <TrashIcon className="h-4 w-4" />
                          Delete
                        </div>
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </li>
          )
        )}
      </ul>

      {/* Modals */}
      <EditTransactionModal
        open={openEditTransactionModal}
        setOpen={setOpenEditTransactionModal}
        transaction={selectedTransaction}
      />
      <DeleteTransactionModal
        open={openDeleteTransactionModal}
        setOpen={setOpenDeleteTransactionModal}
        transaction={selectedTransaction}
      />
    </>
  );
};

export default TransactionsList;
