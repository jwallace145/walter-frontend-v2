'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import React, { useState } from 'react';

const AddTransactionForm: React.FC = (): React.ReactElement => {
  const [open, setOpen] = useState(true);
  const [date, setDate] = useState('');
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/transactions/add-transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date, vendor, amount }),
    })
      .then((response: Response) => response.json())
      .then((data): void => console.log(data));
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
              Add New Transaction
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-gray-500">
              Fill out the form below to add a new transaction.
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
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default AddTransactionForm;
