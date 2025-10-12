import React from 'react';
import Link from 'next/link';

import TransactionItem from '@/components/transactions/TransactionItem';
import UpdateTransactionModal from '@/components/transactions/UpdateTransactionModal';
import { Transaction, TransactionCategory } from '@/lib/models/transaction';

import { BanknotesIcon } from '@heroicons/react/20/solid';

const TransactionsList: React.FC<{ transactions: Transaction[] }> = ({
  transactions,
}): React.ReactElement => {
  const [items, setItems] = React.useState<Transaction[]>(transactions || []);
  const [selected, setSelected] = React.useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect((): void => {
    setItems(transactions || []);
  }, [transactions]);

  const handleCategorize: (transaction: Transaction) => void = (tx: Transaction): void => {
    setSelected(tx);
    setIsModalOpen(true);
  };

  const handleCloseModal: () => void = (): void => {
    setIsModalOpen(false);
    setSelected(null);
  };

  const handleUpdated = (updated: {
    merchant_name: string;
    transaction_category: TransactionCategory;
  }) => {
    if (!selected) return;
    setItems((prev) =>
      prev.map((t) =>
        t.transaction_id === selected.transaction_id
          ? {
              ...t,
              merchant_name: updated.merchant_name,
              transaction_category: updated.transaction_category,
            }
          : t
      )
    );
  };

  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        <BanknotesIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
        No transactions found.{' '}
        <Link href="/settings" className="text-blue-600 hover:text-blue-800 underline">
          Link your accounts
        </Link>{' '}
        to start tracking spending.
      </div>
    );
  }

  return (
    <>
      {/* Transactions List */}
      <ul role="list" className="divide-y divide-gray-100">
        {items.map((tx) => (
          <TransactionItem
            key={tx.transaction_id}
            transaction={tx}
            onCategorize={handleCategorize}
            onViewDetails={(): void => {}}
          />
        ))}
      </ul>

      {/* Modals */}
      <UpdateTransactionModal
        isOpen={isModalOpen}
        transaction={selected}
        onClose={handleCloseModal}
        onUpdated={handleUpdated}
      />
    </>
  );
};

export default TransactionsList;
