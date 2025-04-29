import React, { ReactElement, useState } from 'react';

import DeleteTransactionModal from '@/components/transactions/DeleteTransactionModal';
import EditTransactionModal from '@/components/transactions/EditTransactionModal';
import TransactionListItem from '@/components/transactions/TransactionListItem';
import { Transaction } from '@/lib/models/Transaction';

const TransactionsList: React.FC<{ transactions: Transaction[] }> = ({
  transactions,
}): React.ReactElement => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [openEditTransactionModal, setOpenEditTransactionModal] = useState<boolean>(false);
  const [openDeleteTransactionModal, setOpenDeleteTransactionModal] = useState<boolean>(false);

  return (
    <>
      {/* Transaction List Items */}
      <ul role="list" className="divide-y divide-gray-100">
        {transactions.map((transaction: Transaction): ReactElement => {
          return (
            <TransactionListItem
              key={transaction.transaction_id}
              transaction={transaction}
              setSelectedTransaction={setSelectedTransaction}
              setOpenEditTransactionModal={setOpenEditTransactionModal}
              setOpenDeleteTransactionModal={setOpenDeleteTransactionModal}
            />
          );
        })}
      </ul>

      {/* Modals */}
      <EditTransactionModal
        open={openEditTransactionModal}
        setOpen={setOpenEditTransactionModal}
        transaction={selectedTransaction}
      />
      <DeleteTransactionModal
        open={openDeleteTransactionModal}
        setOpen={setOpenDeleteTransactionModal}
        transaction={selectedTransaction}
      />
    </>
  );
};

export default TransactionsList;
