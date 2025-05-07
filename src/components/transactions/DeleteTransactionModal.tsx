'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import axios, { AxiosResponse } from 'axios';
import React, { useState } from 'react';

import { AccountTransaction } from '@/lib/models/AccountTransaction';

const DeleteTransactionModal: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  refresh: () => void;
  transaction: AccountTransaction | null;
  onDeleteTransactionSuccess: () => void;
}> = ({ open, setOpen, refresh, transaction, onDeleteTransactionSuccess }): React.ReactElement => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (transaction === null) return;

    const transactionToDelete: AccountTransaction = transaction as AccountTransaction;

    setIsDeleting(true);
    axios
      .delete('/api/transactions/delete-transaction', {
        data: {
          date: transactionToDelete.transaction_date,
          transaction_id: transactionToDelete.transaction_id,
        },
      })
      .then((response: AxiosResponse) => response.data)
      .then((data: any): void => {
        if (data['Status'].toLowerCase() === 'success') {
          setOpen(false);
          onDeleteTransactionSuccess();
          refresh();
        } else {
          alert(data['Message']);
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
