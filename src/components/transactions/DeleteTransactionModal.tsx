'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { Expense } from '@/lib/models/Expense';

const DeleteTransactionModal: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  expense: Expense | null;
}> = ({ open, setOpen, expense }): React.ReactElement => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (expense === null) {
      return;
    }

    const expenseToDelete = expense as Expense;

    setIsDeleting(true);
    fetch(`/api/transactions/delete-transaction`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date: expenseToDelete.date, expense_id: expenseToDelete.expense_id }),
    })
      .then((response: Response) => response.json())
      .then((data): void => {
        if (data['Status'].toLowerCase() === 'success') {
          setOpen(false);
        }
      })
      .finally((): void => setIsDeleting(false));
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
              Delete Transaction
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this transaction?
            </DialogDescription>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm ${
                  isDeleting
                    ? 'bg-gray-400 text-gray-800'
                    : 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
                }`}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>

            <div className="mt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
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

export default DeleteTransactionModal;
