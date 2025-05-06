import React from 'react';

import TransactionCategoryBadge from '@/components/transactions/TransactionCategoryBadge';
import { US_DOLLAR } from '@/lib/constants/Constants';
import { Transaction } from '@/lib/models/Transaction';

const TransactionListItem: React.FC<{
  transaction: Transaction;
  setSelectedTransaction: (transaction: Transaction) => void;
  setOpenEditTransactionModal: (open: boolean) => void;
  setOpenDeleteTransactionModal: (open: boolean) => void;
}> = ({
  transaction,
  setSelectedTransaction,
  setOpenEditTransactionModal,
  setOpenDeleteTransactionModal,
}) => {
  return (
    <tr key={`${transaction.date}#${transaction.transaction_id}`} className="hover:bg-gray-50">
      {/* Checkbox */}
      <td className="w-6 px-4 py-2 align-middle">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
        />
      </td>

      {/* Vendor (truncated) */}
      <td className="px-4 py-2 align-middle max-w-[8.5rem] truncate text-sm font-medium text-gray-900">
        {transaction.vendor}
      </td>

      {/* Category Badge */}
      <td className="px-4 py-2 align-middle min-w-[10rem]">
        <TransactionCategoryBadge category={transaction.category} />
      </td>

      {/* Amount */}
      <td className="px-2 py-2 align-middle text-sm font-medium text-right w-20">
        <span className={transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}>
          {US_DOLLAR.format(Math.abs(transaction.amount))}
        </span>
      </td>

      {/* Review Status */}
      <td className="px-2 py-2 align-middle w-4 text-right">
        {!transaction.reviewed && (
          <span className="relative flex h-2 w-2 ml-auto">
            <span className="absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
          </span>
        )}
      </td>
    </tr>
  );
};

export default TransactionListItem;
