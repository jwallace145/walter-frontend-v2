'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import axios from 'axios';
import React, { useState } from 'react';

import { PortfolioStock } from '@/lib/models/PortfolioStock';

interface DeletePortfolioStockModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  stock: PortfolioStock | null;
  refresh: () => void;
}

const DeletePortfolioStockModal: React.FC<DeletePortfolioStockModalProps> = ({
  open,
  setOpen,
  stock,
  refresh,
}): React.ReactElement => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stock === null) return;

    setIsSubmitting(true);
    axios
      .delete('/api/stocks/delete-stock', {
        data: {
          stock: stock.symbol,
        },
      })
      .then((response): void => {
        if (response.data['Status']?.toLowerCase() === 'success') {
          setOpen(false);
          refresh();
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
              Delete Stock from Portfolio
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-gray-500">
              {stock ? (
                <>
                  Are you sure you want to delete the stock{' '}
                  <span className="font-semibold text-red-600">{stock.symbol}</span> from your
                  portfolio?
                </>
              ) : (
                'No stock selected.'
              )}
            </DialogDescription>
            <form onSubmit={handleDelete} className="mt-4 space-y-4">
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !stock}
                  className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-800'
                      : 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
                  }`}
                >
                  {isSubmitting ? 'Deleting...' : 'Delete Stock'}
                </button>
              </div>

              {/* Cancel Button */}
              <div>
                <button
                  type="button"
                  onClick={(): void => setOpen(false)}
                  disabled={isSubmitting}
                  className="inline-flex w-full justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default DeletePortfolioStockModal;
