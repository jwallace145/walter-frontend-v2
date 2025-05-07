import { CreditCardIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import React, { ReactElement, useState } from 'react';

import DeleteTransactionModal from '@/components/transactions/DeleteTransactionModal';
import EditTransactionModal from '@/components/transactions/EditTransactionModal';
import TransactionListItem from '@/components/transactions/TransactionListItem';
import { AccountTransaction } from '@/lib/models/AccountTransaction';

const TransactionsList: React.FC<{
  refresh: () => void;
  onUpdateTransactionSuccess: () => void;
  onDeleteTransactionSuccess: () => void;
  loading: boolean;
  transactions: AccountTransaction[];
}> = ({
  refresh,
  onUpdateTransactionSuccess,
  onDeleteTransactionSuccess,
  loading,
  transactions,
}): ReactElement => {
  const [selectedTransaction, setSelectedTransaction] = useState<AccountTransaction | null>(null);
  const [openEditTransactionModal, setOpenEditTransactionModal] = useState<boolean>(false);
  const [openDeleteTransactionModal, setOpenDeleteTransactionModal] = useState<boolean>(false);

  const groupTransactionsByDate: () => Map<string, AccountTransaction[]> = (): Map<
    string,
    AccountTransaction[]
  > => {
    const transactionsByDate = new Map<string, AccountTransaction[]>();
    transactions.forEach((transaction: AccountTransaction): void => {
      const dateKey: string = transaction.transaction_date;
      if (!transactionsByDate.has(dateKey)) transactionsByDate.set(dateKey, []);
      transactionsByDate.get(dateKey)!.push(transaction);
    });
    return new Map(
      [...transactionsByDate.entries()].sort(
        (a, b) => dayjs(b[0]).valueOf() - dayjs(a[0]).valueOf()
      )
    );
  };

  const renderLoadingState: () => React.ReactElement = (): React.ReactElement => {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-gray-400">
            <CreditCardIcon aria-hidden="true" className="size-12" />
          </div>
          <p className="text-sm/6 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  };

  const renderEmptyState: () => React.ReactElement = (): React.ReactElement => {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-gray-400">
            <CreditCardIcon aria-hidden="true" className="size-12" />
          </div>
          <p className="text-sm/6 text-gray-500">No transactions found</p>
        </div>
      </div>
    );
  };

  if (loading) return renderLoadingState();

  if (transactions.length === 0) return renderEmptyState();

  return (
    <>
      <table className="min-w-full table-auto">
        <tbody className="bg-white divide-y divide-gray-100">
          {Array.from(groupTransactionsByDate()).map(([date, dateTransactions]) => (
            <React.Fragment key={date}>
              {/* Date Group Row */}
              <tr>
                <td colSpan={5} className="bg-gray-50 px-4 py-2 text-xs text-gray-500 font-medium">
                  {dayjs(date).format('ddd, MMM D').toUpperCase()}
                </td>
              </tr>

              {/* Transactions */}
              {dateTransactions.map(
                (transaction: AccountTransaction): React.ReactElement => (
                  <TransactionListItem
                    key={transaction.transaction_id}
                    transaction={transaction}
                    setSelectedTransaction={setSelectedTransaction}
                    setOpenEditTransactionModal={setOpenEditTransactionModal}
                    setOpenDeleteTransactionModal={setOpenDeleteTransactionModal}
                  />
                )
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

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
