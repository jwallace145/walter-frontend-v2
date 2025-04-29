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

  return (
    <>
      {/* Transaction List Items */}
      <ul role="list" className="divide-y divide-gray-100">
        {transactions.length === 0 ? (
          <li className="p-4 text-center text-gray-500">No transactions found</li>
        ) : (
          transactions.map((transaction: Transaction): ReactElement => {
            return (
              <TransactionListItem
                key={transaction.transaction_id}
                transaction={transaction}
                setSelectedTransaction={setSelectedTransaction}
                setOpenEditTransactionModal={setOpenEditTransactionModal}
                setOpenDeleteTransactionModal={setOpenDeleteTransactionModal}
              />
            );
          })
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
