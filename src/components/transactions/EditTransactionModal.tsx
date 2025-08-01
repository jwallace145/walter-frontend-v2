'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPanel,
  DialogTitle,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/16/solid';
import { CheckIcon } from '@heroicons/react/20/solid';
import axios, { AxiosResponse } from 'axios';
import React, { ReactElement, useEffect, useState } from 'react';

import { AccountTransaction } from '@/lib/models/AccountTransaction';
import { TransactionCategory } from '@/lib/models/Transaction';
import { getTransactionCategory } from '@/lib/utils/Utils';

interface TransactionCategoryId {
  id: number;
  name: TransactionCategory;
}

const generateTransactionCategories: () => TransactionCategoryId[] =
  (): TransactionCategoryId[] => {
    return Object.values(TransactionCategory).map(
      (category: TransactionCategory, index: number): TransactionCategoryId => ({
        id: index + 1,
        name: category,
      })
    );
  };

const transactionCategories: TransactionCategoryId[] = generateTransactionCategories();

const EditTransactionModal: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  refresh: () => void;
  transaction: AccountTransaction | null;
  onUpdateTransactionSuccess: () => void;
}> = ({ open, setOpen, refresh, transaction, onUpdateTransactionSuccess }): ReactElement => {
  const [date, setDate] = useState(transaction?.transaction_date || '');
  const [vendor, setVendor] = useState(transaction?.transaction_vendor || '');
  const [amount, setAmount] = useState(transaction?.transaction_amount || '');
  const [category, setCategory] = useState<TransactionCategoryId>(transactionCategories[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect((): void => {
    setDate(transaction?.transaction_date || '');
    setVendor(transaction?.transaction_vendor || '');
    setAmount(transaction?.transaction_amount || '');
    setCategory(
      transactionCategories.find(
        (category: TransactionCategoryId): boolean => category.name === getCategory()
      ) || transactionCategories[0]
    );
  }, [transaction]);

  const getCategory: () => TransactionCategory = (): TransactionCategory => {
    return (
      transaction?.transaction_category
        ? getTransactionCategory(transaction.transaction_category)
        : TransactionCategory.BILLS
    ) as TransactionCategory;
  };

  const handleSubmit: (e: React.FormEvent) => Promise<void> = async (
    e: React.FormEvent
  ): Promise<void> => {
    e.preventDefault();
    if (transaction === null || !transaction.transaction_id) return;

    // transaction is set and non-null, attempt to edit transaction and persist to db
    setIsSubmitting(true);
    axios
      .put('/api/transactions/edit-transaction', {
        transaction_date: transaction.transaction_date,
        transaction_id: transaction.transaction_id,
        updated_date: date,
        updated_vendor: vendor,
        updated_amount: amount,
        updated_category: category.name as TransactionCategory,
      })
      .then((response: AxiosResponse): void => response.data)
      .then((data: any): void => {
        if (data['Status'].toLowerCase() === 'success') {
          setOpen(false);
          onUpdateTransactionSuccess();
          refresh();
        } else if (data['Status'].toLowerCase() === 'error') {
          alert(data['Message']);
        }
      })
      .finally((): void => setIsSubmitting(false));
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop transition className="fixed inset-0 bg-gray-500/75 transition-opacity" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
          >
            <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900">
              Edit Transaction
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-gray-500">
              Modify the details of this transaction below.
            </DialogDescription>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">
                  Vendor
                </label>
                <input
                  id="vendor"
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  required
                  placeholder="e.g. Starbucks"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="e.g. 12.50"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <Listbox value={category} onChange={setCategory}>
                <Label className="block text-sm/6 font-medium text-gray-900">Category</Label>
                <div className="relative mt-2">
                  <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                    <span className="col-start-1 row-start-1 truncate pr-6">{category.name}</span>
                    <ChevronUpDownIcon
                      aria-hidden="true"
                      className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                  </ListboxButton>

                  <ListboxOptions
                    transition
                    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                  >
                    {transactionCategories.map(
                      (transactionCategory): ReactElement => (
                        <ListboxOption
                          key={transactionCategory.id}
                          value={transactionCategory}
                          className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                        >
                          <span className="block truncate font-normal group-data-selected:font-semibold">
                            {transactionCategory.name}
                          </span>

                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                            <CheckIcon aria-hidden="true" className="size-5" />
                          </span>
                        </ListboxOption>
                      )
                    )}
                  </ListboxOptions>
                </div>
              </Listbox>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-800'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  }`}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>

            <div className="mt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="inline-flex w-full justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default EditTransactionModal;
