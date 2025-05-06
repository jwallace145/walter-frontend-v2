import dayjs from 'dayjs';
import React, { ReactElement, useState } from 'react';

import DeleteTransactionModal from '@/components/transactions/DeleteTransactionModal';
import EditTransactionModal from '@/components/transactions/EditTransactionModal';
import TransactionListItem from '@/components/transactions/TransactionListItem';
import { CashAccount } from '@/lib/models/CashAccount';
import { Transaction } from '@/lib/models/Transaction';

const TransactionsList: React.FC<{
  refresh: () => void;
  onUpdateTransactionSuccess: () => void;
  onDeleteTransactionSuccess: () => void;
  accounts: CashAccount[];
  transactions: Transaction[];
}> = ({
  refresh,
  onUpdateTransactionSuccess,
  onDeleteTransactionSuccess,
  accounts,
  transactions,
}): ReactElement => {
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

  const getAccountName: (transaction_account_id: string) => string = (
    transaction_account_id: string
  ): string => {
    const transactionAccount: CashAccount | null =
      accounts.find(
        (account: CashAccount): boolean => account.account_id === transaction_account_id
      ) || null;
    if (transactionAccount === null) {
      return 'Anonymous Account';
    }
    return transactionAccount.account_name;
  };

  const getAccountLastFourNumbers: (transaction_account_id: string) => string = (
    transaction_account_id: string
  ): string => {
    const transactionAccount: CashAccount | null =
      accounts.find(
        (account: CashAccount): boolean => account.account_id === transaction_account_id
      ) || null;
    if (transactionAccount === null) {
      return '0000';
    }
    return transactionAccount.account_last_four_numbers;
  };

  return (
    <>
      {transactions.length === 0 ? (
        <p className="p-4 text-center text-gray-500">No transactions found</p>
      ) : (
        <table className="min-w-full table-auto">
          <tbody className="bg-white divide-y divide-gray-100">
            {Array.from(groupTransactionsByDate()).map(([date, dateTransactions]) => (
              <React.Fragment key={date}>
                {/* Date Group Row */}
                <tr>
                  <td
                    colSpan={5}
                    className="bg-gray-50 px-4 py-2 text-xs text-gray-500 font-medium"
                  >
                    {dayjs(date).format('ddd, MMM D').toUpperCase()}
                  </td>
                </tr>

                {/* Transactions */}
                {dateTransactions.map(
                  (transaction: Transaction): React.ReactElement => (
                    <TransactionListItem
                      key={transaction.transaction_id}
                      accountName={getAccountName(transaction.account_id)}
                      accountLastFourNumbers={getAccountLastFourNumbers(transaction.account_id)}
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
      )}

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
