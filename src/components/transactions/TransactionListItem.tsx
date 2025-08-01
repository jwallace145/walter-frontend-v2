import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/16/solid';
import React from 'react';

import TransactionCategoryBadge from '@/components/transactions/TransactionCategoryBadge';
import { US_DOLLAR } from '@/lib/constants/Constants';
import { AccountTransaction } from '@/lib/models/AccountTransaction';

const TransactionListItem: React.FC<{
  transaction: AccountTransaction;
  setSelectedTransaction: (transaction: AccountTransaction) => void;
  setOpenEditTransactionModal: (open: boolean) => void;
  setOpenDeleteTransactionModal: (open: boolean) => void;
}> = ({
  transaction,
  setSelectedTransaction,
  setOpenEditTransactionModal,
  setOpenDeleteTransactionModal,
}) => {
  return (
    <tr
      key={`${transaction.transaction_date}#${transaction.transaction_id}`}
      className="hover:bg-gray-50"
    >
      {/* Checkbox */}
      <td className="w-6 px-4 py-2 align-middle">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
        />
      </td>

      {/* Vendor and Account */}
      <td className="px-4 py-2 align-middle max-w-[8.5rem] text-sm font-medium text-gray-900">
        <div className="flex flex-col">
          <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis">
            {transaction.transaction_vendor}
          </span>
          <div className="flex space-x-1">
            <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis italic text-sm text-gray-500">
              {transaction.account_name}
            </span>
            <span className="italic text-sm text-gray-500">
              ...{transaction.account_last_four_numbers}
            </span>
          </div>
        </div>
      </td>

      {/* Category Badge */}
      <td className="px-4 py-2 align-middle min-w-[10rem]">
        <TransactionCategoryBadge category={transaction.transaction_category} />
      </td>

      {/* Amount */}
      <td className="px-2 py-2 align-middle text-sm font-medium text-right w-20">
        <span className={transaction.transaction_amount > 0 ? 'text-green-600' : 'text-gray-900'}>
          {US_DOLLAR.format(Math.abs(transaction.transaction_amount))}
        </span>
      </td>

      {/* Review Status */}
      <td className="px-2 py-2 align-middle w-4 text-right">
        {!transaction.transaction_reviewed && (
          <span className="relative flex h-2 w-2 ml-auto">
            <span className="absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
          </span>
        )}
      </td>

      <td className="px-2 py-2 align-middle w-4 text-right">
        <Menu as="div" className="relative flex-none">
          <MenuButton className="relative block text-gray-500 hover:text-gray-900">
            <span className="absolute -inset-2.5" />
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
                Edit
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href="#"
                className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
              >
                Delete
              </a>
            </MenuItem>
          </MenuItems>
        </Menu>
      </td>
    </tr>
  );
};

export default TransactionListItem;
