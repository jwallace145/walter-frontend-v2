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

const AddPortfolioStockModal: React.FC<{ open: boolean; setOpen: (open: boolean) => void }> = ({
  open,
  setOpen,
}): React.ReactElement => {
  const [stock, setStock] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    axios
      .post('/api/stocks/add-stock', {
        stock: stock,
        quantity: parseFloat(quantity),
      })
      .then((response: AxiosResponse): any => response.data)
      .then((data: any): void => {
        if (data['Status'].toLowerCase() === 'success') {
          setStock('');
          setQuantity('');
          setOpen(false);
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
              Add Stock to Portfolio
            </DialogTitle>

            <DialogDescription className="mt-1 text-sm text-gray-500">
              Fill out the form below to add a new stock to your portfolio.
            </DialogDescription>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="stock-symbol" className="block text-sm font-medium text-gray-700">
                  Stock Symbol
                </label>
                <input
                  id="stock-symbol"
                  type="text"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  placeholder="e.g., AAPL"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  min="1"
                  placeholder="e.g., 10"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

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
                  {isSubmitting ? 'Adding...' : 'Add Stock'}
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

export default AddPortfolioStockModal;
