'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import axios, { AxiosResponse } from 'axios';
import React, { FormEvent, ReactElement, useState } from 'react';

interface AddExpenseModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose: () => void;
  onExpenseAdded: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  open,
  setOpen,
  onClose,
  onExpenseAdded,
}): ReactElement => {
  const [date, setDate] = useState('');
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit: (event: FormEvent) => Promise<void> = async (
    event: FormEvent
  ): Promise<void> => {
    event.preventDefault();

    // ensure all form fields are set
    if (!date || !vendor || !amount) {
      console.log('All fields are required.');
      return;
    }

    // ensure amount is positive and a valid number
    const parsedAmount: number = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      console.log('Amount must be a positive number.');
      return;
    }

    // attempt to add expense for user to db
    setLoading(true);
    await axios
      .post('/api/transactions/add-transaction', {
        date: date,
        vendor: vendor,
        amount: -1 * parsedAmount, // expenses are always negative in the db
      })
      .then((response: AxiosResponse): any => response.data)
      .then((data: any): void => {
        console.log(data);
        setOpen(false);
        onExpenseAdded();
        onClose();
        setDate('');
        setVendor('');
        setAmount('');
      })
      .catch((err: any) => console.log(err))
      .finally(() => {
        setLoading(false);
        setOpen(false);
      });
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
              Add Expense
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-gray-500">
              Add a new expense with the following details.
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

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Expense'}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default AddExpenseModal;
