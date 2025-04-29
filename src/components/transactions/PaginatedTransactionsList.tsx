import React, { useEffect, useState } from 'react';

import Pagination from '@/components/pagination/Pagination';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTransactions, setCurrentTransactions] = useState<Transaction[]>([]);
  const totalPages: number = Math.ceil(transactions.length / transactionsPerPage);

  useEffect((): void => {
    const startIndex: number = (currentPage - 1) * transactionsPerPage;
    setCurrentTransactions(transactions.slice(startIndex, startIndex + transactionsPerPage));
  }, [transactions, currentPage, transactionsPerPage]);

  const handlePageChange: (page: number) => void = (page: number): void => {
    setCurrentPage(page);
  };

  return (
    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
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
  );
};

export default PaginatedTransactionsList;
