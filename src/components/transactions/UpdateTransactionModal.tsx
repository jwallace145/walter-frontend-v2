import React, { useEffect, useMemo, useState } from 'react';

import { Transaction, TransactionCategory } from '@/lib/models/transaction';
import { WalterBackendProxy } from '@/lib/proxy/client';
import { UpdateTransactionResponse } from '@/lib/proxy/responses';

interface UpdateTransactionModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onUpdated?: (updated: {
    merchant_name: string;
    transaction_category: TransactionCategory;
  }) => void;
}

const categoryOptions: { value: TransactionCategory; label: string }[] = Object.values(
  TransactionCategory
).map((c) => ({ value: c as TransactionCategory, label: String(c) }));

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
    <path
      d="M6 8l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UpdateTransactionModal: React.FC<UpdateTransactionModalProps> = ({
  isOpen,
  transaction,
  onClose,
  onUpdated,
}) => {
  const [merchantName, setMerchantName] = useState('');
  const [category, setCategory] = useState<TransactionCategory | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transaction) {
      setMerchantName(transaction.merchant_name || '');
      setCategory(transaction.transaction_category || '');
      setError(null);
    } else {
      setMerchantName('');
      setCategory('');
      setError(null);
    }
  }, [transaction, isOpen]);

  const disabled = useMemo(() => {
    return submitting || !transaction || !merchantName || !category;
  }, [submitting, transaction, merchantName, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction || !merchantName || !category) return;

    setSubmitting(true);
    setError(null);

    try {
      const response: UpdateTransactionResponse = await WalterBackendProxy.updateTransaction(
        transaction.transaction_date,
        transaction.transaction_id,
        merchantName,
        category
      );

      if (response.isSuccess()) {
        onUpdated?.({ merchant_name: merchantName, transaction_category: category });
        onClose();
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Unexpected error occurred updating transaction!');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="border-b px-4 py-3">
          <h3 className="text-base font-semibold text-gray-900">Update transaction</h3>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
          {/* Merchant name input */}
          <div>
            <label htmlFor="merchantName" className="block text-sm/6 font-medium text-gray-900">
              Merchant name
            </label>
            <input
              id="merchantName"
              type="text"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              placeholder="Enter merchant name"
              className="mt-2 col-start-1 row-start-1 w-full rounded-md bg-white py-1.5 pr-3 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
            />
          </div>

          {/* Category select */}
          <div>
            <label htmlFor="category" className="block text-sm/6 font-medium text-gray-900">
              Category
            </label>
            <div className="mt-2 grid grid-cols-1 relative">
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 self-center justify-self-end text-gray-500 size-5 sm:size-4 absolute right-2 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base font-medium text-gray-700 hover:bg-gray-50 sm:text-sm/6"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={disabled}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-base font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:text-sm/6"
            >
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTransactionModal;
