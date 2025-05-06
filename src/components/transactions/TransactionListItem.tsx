import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { PencilIcon } from '@heroicons/react/16/solid';
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/20/solid';
import React, { ReactElement } from 'react';

import TransactionCategoryBadge from '@/components/transactions/TransactionCategoryBadge';
import { US_DOLLAR } from '@/lib/constants/Constants';
import { Transaction } from '@/lib/models/Transaction';

const TransactionListItem: React.FC<{
  transaction: Transaction;
  setSelectedTransaction: (transaction: Transaction) => void;
  setOpenEditTransactionModal: (open: boolean) => void;
  setOpenDeleteTransactionModal: (open: boolean) => void;
}> = ({
  transaction,
  setSelectedTransaction,
  setOpenEditTransactionModal,
  setOpenDeleteTransactionModal,
}): ReactElement => {
  return (
    <li
      key={`${transaction.date}#${transaction.transaction_id}`}
      className="flex items-center justify-between py-1 hover:bg-gray-50"
    >
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
        />
        <div className="flex items-center space-x-4 min-w-0">
          <span className="text-sm font-medium text-gray-900">{transaction.vendor}</span>
          <TransactionCategoryBadge category={transaction.category} />
        </div>
      </div>

      <div className="flex items-center">
        <p
          className={`text-sm mr-4 ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}
        >
          {US_DOLLAR.format(transaction.amount > 0 ? transaction.amount : -1 * transaction.amount)}
        </p>
        <Menu as="div" className="relative mr-4">
          <MenuButton className="-m-1.5 p-1.5 text-gray-500 hover:text-gray-900">
            <span className="sr-only">Open options</span>
            <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
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
                className="block px-3 py-1 text-sm text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
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
                className="block px-3 py-1 text-sm text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
              >
                <div className="flex items-center gap-x-2">
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </div>
              </a>
            </MenuItem>
          </MenuItems>
        </Menu>
        <div className="w-2">
          {!transaction.reviewed && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

export default TransactionListItem;
