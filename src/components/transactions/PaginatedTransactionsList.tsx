import React, { useEffect, useState } from 'react';

import Pagination from '@/components/pagination/Pagination';
import { Expense } from '@/lib/models/Expense';

import TransactionsList from './TransactionsList';

const PaginatedTransactionsList: React.FC<{
  transactions: Expense[];
  transactionsPerPage: number;
}> = ({ transactions, transactionsPerPage }): React.ReactElement => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTransactions, setCurrentTransactions] = useState<Expense[]>([]);
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
        <TransactionsList expenses={currentTransactions} />
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
