import React, { useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Expense } from '@/lib/Expense';
import { US_DOLLAR } from '@/pages/api/Constants';
import DeleteTransactionModal from '@/components/transactions/DeleteTransactionModal';
import EditTransactionModal from '@/components/transactions/EditTransactionModal';

const TransactionsList: React.FC<{ expenses: Expense[] }> = ({ expenses }): React.ReactElement => {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [openEditTransactionModal, setOpenEditTransactionModal] = useState<boolean>(false);
  const [openDeleteTransactionModal, setOpenDeleteTransactionModal] = useState<boolean>(false);

  const getExpenseCategoryBadge: (category: string) => React.ReactElement = (
    category: string
  ): React.ReactElement => {
    switch (category.toLowerCase()) {
      case 'transportation':
        return (
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
            Transportation
          </span>
        );
      case 'housing':
        return (
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
            Housing
          </span>
        );
      case 'groceries':
        return (
          <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset">
            Groceries
          </span>
        );
      case 'travel':
        return (
          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
            Travel
          </span>
        );
      case 'merchandise':
        return (
          <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-700/10 ring-inset">
            Merchandise
          </span>
        );
      case 'hobbies':
        return (
          <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-pink-700/10 ring-inset">
            Hobbies
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
            Other
          </span>
        );
    }
  };

  return (
    <>
      <ul role="list" className="divide-y divide-gray-100">
        {expenses.map(
          (expense: Expense): React.ReactElement => (
            <li
              key={`${expense.date}#${expense.expense_id}`}
              className="flex justify-between gap-x-6 py-5"
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm/6 font-semibold text-gray-900">
                    <a href="#" className="hover:underline">
                      {expense.vendor}
                    </a>
                  </p>
                  <p className="mt-1 flex text-xs/5 text-gray-500">
                    <a href="#" className="truncate hover:underline">
                      {expense.date}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-6">
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm/6 text-gray-900">{US_DOLLAR.format(expense.amount)}</p>
                  {getExpenseCategoryBadge(expense.category)}
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
                          setSelectedExpense(expense);
                          setOpenEditTransactionModal(true);
                        }}
                        className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                      >
                        Edit<span className="sr-only">, {expense.category}</span>
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        onClick={(): void => {
                          setSelectedExpense(expense);
                          setOpenDeleteTransactionModal(true);
                        }}
                        className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                      >
                        Delete<span className="sr-only">, {expense.expense_id}</span>
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </li>
          )
        )}
      </ul>
      <DeleteTransactionModal
        open={openDeleteTransactionModal}
        setOpen={setOpenDeleteTransactionModal}
        expense={selectedExpense}
      />
      <EditTransactionModal
        open={openEditTransactionModal}
        setOpen={setOpenEditTransactionModal}
        expense={selectedExpense}
      />
    </>
  );
};

export default TransactionsList;
