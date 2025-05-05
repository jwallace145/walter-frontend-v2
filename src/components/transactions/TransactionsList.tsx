import dayjs from 'dayjs';
import React, { ReactElement, useState } from 'react';

import DeleteTransactionModal from '@/components/transactions/DeleteTransactionModal';
import EditTransactionModal from '@/components/transactions/EditTransactionModal';
import TransactionListItem from '@/components/transactions/TransactionListItem';
import { Transaction } from '@/lib/models/Transaction';

const TransactionsList: React.FC<{
  refresh: () => void;
  onUpdateTransactionSuccess: () => void;
  onDeleteTransactionSuccess: () => void;
  transactions: Transaction[];
}> = ({
  refresh,
  onUpdateTransactionSuccess,
  onDeleteTransactionSuccess,
  transactions,
}): React.ReactElement => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [openEditTransactionModal, setOpenEditTransactionModal] = useState<boolean>(false);
  const [openDeleteTransactionModal, setOpenDeleteTransactionModal] = useState<boolean>(false);

  const groupTransactionsByDate: () => Map<string, Transaction[]> = (): Map<
    string,
    Transaction[]
  > => {
    const transactionsByDate = new Map<string, Transaction[]>();
    transactions.forEach((transaction: Transaction): void => {
      const dateKey: string = transaction.date;
      if (!transactionsByDate.has(dateKey)) transactionsByDate.set(dateKey, []);
      transactionsByDate.get(dateKey)!.push(transaction);
    });
    return new Map(
      [...transactionsByDate.entries()].sort(
        (a, b) => dayjs(b[0]).valueOf() - dayjs(a[0]).valueOf()
      )
    );
  };

  return (
    <>
      {/* Transaction List Items */}
      <ul role="list" className="divide-y divide-gray-100">
        {transactions.length === 0 ? (
          <li className="p-2 text-center text-gray-500">No transactions found</li>
        ) : (
          Array.from(groupTransactionsByDate()).map(([date, dateTransactions]) => (
            <li key={date} className="px-2 py-1">
              <h3 className="text-xs font-medium text-gray-500 mb-1">
                {dayjs(date).format('ddd, MMM D').toUpperCase()}
              </h3>
              <ul className="space-y-1">
                {dateTransactions.map(
                  (transaction: Transaction): ReactElement => (
                    <TransactionListItem
                      key={transaction.transaction_id}
                      transaction={transaction}
                      setSelectedTransaction={setSelectedTransaction}
                      setOpenEditTransactionModal={setOpenEditTransactionModal}
                      setOpenDeleteTransactionModal={setOpenDeleteTransactionModal}
                    />
                  )
                )}
              </ul>
            </li>
          ))
        )}
      </ul>

      {/* Modals */}
      <EditTransactionModal
        open={openEditTransactionModal}
        setOpen={setOpenEditTransactionModal}
        refresh={refresh}
        transaction={selectedTransaction}
        onUpdateTransactionSuccess={onUpdateTransactionSuccess}
      />
      <DeleteTransactionModal
        open={openDeleteTransactionModal}
        setOpen={setOpenDeleteTransactionModal}
        refresh={refresh}
        transaction={selectedTransaction}
        onDeleteTransactionSuccess={onDeleteTransactionSuccess}
      />
    </>
  );
};

export default TransactionsList;
