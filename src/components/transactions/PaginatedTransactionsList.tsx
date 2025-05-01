import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import React from 'react';

import Pagination from '@/components/pagination/Pagination';
import TransactionsDownloadModal from '@/components/transactions/TransactionsDownloadModal';
import { Transaction } from '@/lib/models/Transaction';

import TransactionsList from './TransactionsList';

const PaginatedTransactionsList: React.FC<{
  refresh: () => void;
  onUpdateTransactionSuccess: () => void;
  onDeleteTransactionSuccess: () => void;
  transactions: Transaction[];
  transactionsPerPage: number;
}> = ({
  refresh,
  onUpdateTransactionSuccess,
  onDeleteTransactionSuccess,
  transactions,
  transactionsPerPage,
}): React.ReactElement => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentTransactions, setCurrentTransactions] = React.useState<Transaction[]>([]);
  const [openDownloadTransactionsModal, setOpenDownloadTransactionsModal] =
    React.useState<boolean>(false);
  const totalPages: number = Math.ceil(transactions.length / transactionsPerPage);

  React.useEffect((): void => {
    const startIndex: number = (currentPage - 1) * transactionsPerPage;
    setCurrentTransactions(transactions.slice(startIndex, startIndex + transactionsPerPage));
  }, [transactions, currentPage, transactionsPerPage]);

  const handlePageChange: (page: number) => void = (page: number): void => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Transactions List */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-end">
            <ArrowDownTrayIcon
              onClick={(): void => setOpenDownloadTransactionsModal(true)}
              className="size-5 text-gray-500 cursor-pointer hover:text-gray-700"
            />
          </div>
          <TransactionsList
            refresh={refresh}
            onUpdateTransactionSuccess={onUpdateTransactionSuccess}
            onDeleteTransactionSuccess={onDeleteTransactionSuccess}
            transactions={currentTransactions}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Download Transactions Modal */}
      <TransactionsDownloadModal
        open={openDownloadTransactionsModal}
        setOpen={setOpenDownloadTransactionsModal}
        transactions={transactions}
      />
    </>
  );
};

export default PaginatedTransactionsList;
